<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { onMounted, ref, shallowRef, watchEffect } from 'vue';
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from '@unovis/vue';
import { OvenAPI } from '../../composables';
import { generateTime, generateTimestamp, getOverallPeakTime, getStartFinishPeak, temporary } from '../../utils';
import type { DateRangeType, IReportParameter, TemperatureListType, TemperatureResponseType } from '../../types';
import type { RadioGroupItem, RadioGroupValue } from '@nuxt/ui';
import { Canvg } from 'canvg';

const props = defineProps<{
  maxTemperatureTarget: number;
}>();

const toast = useToast();
const startHour = ref<string>('');
const endHour = ref<string>('');
const selectItems = ref<string[]>(['Mangan', 'Bobin', 'Bubuk']);
const selectedItemsReport = ref<string>('Mangan');
const inputOvenReport = ref<string>('');
const temperatureReportData = ref<TemperatureResponseType[]>([]);
const showGraph = ref<boolean>(false);
const judgementItems = ref<RadioGroupItem[]>(['OK', 'NG']);
const judgementValue = ref<RadioGroupValue>('OK');
const judgementColor = ref<'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral' | undefined>('success');
const selectedOvenReport = ref<string>('');
const lotOvenValue = ref<string>('');
const ovenCHValue = ref<string>('');
const targetTemperature = ref<number>(0);
const startPeakValue = ref<string>('');
const finishPeakValue = ref<string>('');
const overallPeakValue = ref<string>('');
const qcMemberValue = ref<string>('');
const productionMemberValue = ref<string>('');
const confirmation = ref<boolean>(false);
const graphArea = ref<HTMLElement | null>(null);

const isLoading = ref<boolean>(false);

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
});

const dateModel = shallowRef({
  start: new CalendarDate(2023, 1, 20),
  end: new CalendarDate(2023, 2, 10),
});

const dateModelReport = shallowRef(new CalendarDate(2022, 1, 10));

const xReport = (_d: TemperatureListType, i: number): number => i;
const yReport = [(d: TemperatureListType): number => parseInt(d.temperature)];
const toolTipFormat = (d: TemperatureListType) => `<div class="flex flex-col -gap-1 items-start">
<p class="text-[0.7rem]">${generateTimestamp(d.createdAt)[2]}</p>
<p class="text-[0.9rem] self-end">${d.temperature} °C</p>
    </div>`;

function xReportTickFormat(i: number): string {
  return generateTimestamp(temperatureReportData.value[i].createdAt)[0];
}

async function handleGetTemperatureByPeriode() {
  const startY = dateModel.value.start.year;
  const startM = dateModel.value.start.month < 10 ? `0${dateModel.value.start.month}` : dateModel.value.start.month;
  const startD = dateModel.value.start.day < 10 ? `0${dateModel.value.start.day}` : dateModel.value.start.day;

  const endY = dateModel.value.end.year;
  const endM = dateModel.value.end.month < 10 ? `0${dateModel.value.end.month}` : dateModel.value.end.month;
  const endD = dateModel.value.end.day < 10 ? `0${dateModel.value.end.day}` : dateModel.value.end.day;

  const startDay: string = `${startY}-${startM}-${startD}`;
  const endDay: string = `${endY}-${endM}-${endD}`;

  let startH: string = parseInt(startHour.value) < 10 ? `0${startHour.value}` : startHour.value;
  let endH: string = parseInt(endHour.value) - 1 < 10 ? `0${parseInt(endHour.value) - 1}` : (parseInt(endHour.value) - 1).toString();

  if (startH === '' || endH === 'NaN') {
    startH = '00';
    endH = '23';
  }

  const { data } = await OvenAPI.getTemperatureByPeriode(selectedItemsReport.value.toLowerCase(), inputOvenReport.value, startDay, endDay, startH, endH);
  // if (!data || data.length === 0) {
  //   toast.add({
  //     title: 'Error',
  //     description: message,
  //     color: 'error',
  //   })
  //   showGraph.value = false;
  //   return;
  // };

  temperatureReportData.value = temporary;
  showGraph.value = true;

  const [startPeak, finishPeak] = getStartFinishPeak(data, targetTemperature.value);
  overallPeakValue.value = getOverallPeakTime(startPeak, finishPeak);
  startPeakValue.value = generateTimestamp(startPeak)[2];
  finishPeakValue.value = generateTimestamp(finishPeak)[2];
}

async function handleGetReport() {
  if (!graphArea.value) return;

  const svgEl = graphArea.value.querySelector('svg');
  if (!svgEl) return;

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgEl);

  svgString = svgString.replace('<svg', `<svg><rect width="100%" height="100%" fill="#ffffff00"/>`);

  const canvas = document.createElement('canvas');
  canvas.width = svgEl.clientWidth || 800;
  canvas.height = svgEl.clientHeight || 600;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.log('no ctx');
    return;
  }

  ctx.fillStyle = '#ffffff00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const v = Canvg.fromString(ctx, svgString);

  await v.render();

  const dataUrl = canvas.toDataURL('image/png');

  const param: IReportParameter = {
    buffer: dataUrl,
    ovenType: selectedOvenReport.value,
    ovenNo: ovenCHValue.value,
    lot: lotOvenValue.value,
    temperatureTarget: props.maxTemperatureTarget,
    temperatureMaxStart: startPeakValue.value,
    temperatureMaxEnd: finishPeakValue.value,
    temperatureMaxTime: overallPeakValue.value,
    checkDate: `${dateModelReport.value.day}/${dateModelReport.value.month}/${dateModelReport.value.year}`,
    judgement: judgementValue.value as string,
    qcMember: qcMemberValue.value,
    productionMember: productionMemberValue.value,
  };

  isLoading.value = true;
  const res = await OvenAPI.getReport(param);
  if (!res) {
    toast.add({
      title: 'Error',
      description: 'Download Failed',
      color: 'error',
    });
  }
  isLoading.value = false;
}

function setMaxTemperatureTargetReport(oven: string) {
  oven.toLowerCase() === 'mangan' ? (targetTemperature.value = 430) : oven.toLowerCase() === 'bubuk' ? (targetTemperature.value = 120) : (targetTemperature.value = 250);
}

watchEffect(async () => {
  setMaxTemperatureTargetReport(selectedOvenReport.value);
  judgementValue.value == 'NG' ? (judgementColor.value = 'error') : (judgementColor.value = 'success');
  selectedOvenReport.value = selectedItemsReport.value;
  ovenCHValue.value = inputOvenReport.value;
});

onMounted(() => {
  const { current } = generateTime();

  dateModel.value.start = new CalendarDate(current[0], current[1], current[2]);
  dateModel.value.end = new CalendarDate(current[0], current[1], current[2]);
  dateModelReport.value = new CalendarDate(current[0], current[1], current[2]);
});

const startDate = ref<CalendarDate>();
const finishDate = ref<CalendarDate>();

function handleGetDateProps(value: DateRangeType) {
  startDate.value = value.start;
  finishDate.value = value.end;
  console.log(value)
}
</script>
<template>
  <section class="flex items-start gap-2">
    <section class="flex-1"> 
      <h1 class="pnsc-bold items-center">Data Record</h1>
      <section class="flex flex-col gap-4 w-90">
        <div class="flex flex-2 mt-5 gap-5">
          <div class="flex flex-col gap-5 pnsc-light text-sm">
            <p>Select day periode :</p>
            <p>Select time range :</p>
            <p>Select Oven Type :</p>
            <p>Oven No :</p>
          </div>
          <div class="flex-1 flex flex-col items-start justify-center gap-3 w-full">
            <DatePicker @getDate="handleGetDateProps"/>
            <div class="flex gap-4">
              <UInput placeholder="Hour" size="sm" class="w-full" v-model="startHour" />
              <p>-</p>
              <UInput placeholder="Hour" size="sm" class="w-full" v-model="endHour" />
            </div>
            <USelect :items="selectItems" v-model="selectedItemsReport" placeholder="Select Oven Type" variant="outline" class="pnsc-light w-full" size="sm" />
            <UInput placeholder="Input Oven CH.." size="sm" class="w-full" v-model="inputOvenReport" />
          </div>
        </div>
        <UButton label="Show Graph" class="self-end hover:cursor-pointer" size="sm" color="neutral" @click="handleGetTemperatureByPeriode" />
      </section>
    </section>
    <section class="flex-2 h-[calc(100vh-120px)] flex flex-col gap-5">
      <UCard class="h-full flex justify-center items-center">
        <h1 v-if="showGraph" class="text-center -mt-10">Preview Graph</h1>
        <UCard class="flex flex-col gap-5 w-[65rem]" variant="soft" v-if="showGraph">
          <section ref="graphArea">
            <VisXYContainer :data="temperatureReportData" :height="550" :yDomain="[0, 500]">
              <VisLine :x="xReport" :y="yReport" :lineWidth="2" color="blue" />
              <VisAxis type="x" :x="xReport" label="Time" labelFontSize="11px" tickTextFontSize="12px" :tickFormat="xReportTickFormat" :tickTextAngle="30" :numTicks="temperatureReportData.length < 50 ? 0 : 22" />
              <VisAxis type="y" :y="xReport" label="Temp(°C)" labelFontSize="11px" tickTextFontSize="12px" />
              <VisCrosshair :template="toolTipFormat" />
              <VisTooltip />
            </VisXYContainer>
          </section>
        </UCard>
        <h1 v-else class="text-slate-400 text-lg">Result will appear here</h1>
      </UCard>
      <UModal title="Data Information Preview" fullscreen>
        <UButton label="Create PDF" class="self-end hover:cursor-pointer" color="primary" v-if="showGraph" />

        <template #body>
          <main class="flex flex-col gap-5 px-8">
            <section class="flex gap-10">
              <aside class="flex flex-col gap-6 w-74">
                <section class="flex flex-col gap-2">
                  <div class="flex gap-1">
                    <UFormField label="Oven Name" class="">
                      <USelect v-model="selectedOvenReport" variant="subtle" placeholder="Select Oven" :items="selectItems" class="w-47" disabled />
                    </UFormField>
                    <UFormField label="CH" class="w-28">
                      <UInput v-model="ovenCHValue" variant="subtle" placeholder="Enter CH" disabled />
                    </UFormField>
                  </div>

                  <UFormField label="Lot Oven" class="w-full">
                    <UInput v-model="lotOvenValue" placeholder="Enter Lot Oven" class="w-full" />
                  </UFormField>
                </section>
                <USeparator :label="`Temperature ${targetTemperature}°C`" :ui="{ label: 'text-[0.75rem] text-slate-400' }" />
                <section class="flex flex-col gap-2 -mt-2">
                  <div class="flex gap-1">
                    <UFormField label="Start">
                      <UInput v-model="startPeakValue" placeholder="" disabled variant="subtle" />
                    </UFormField>
                    <UFormField label="Finish">
                      <UInput v-model="finishPeakValue" placeholder="" disabled variant="subtle" />
                    </UFormField>
                  </div>
                  <UFormField label="Overall Time" class="w-full">
                    <UInput v-model="overallPeakValue" placeholder="" class="w-full" disabled variant="subtle" />
                  </UFormField>
                </section>
              </aside>
              <USeparator orientation="vertical" class="h-80" />
              <aside class="flex flex-col gap-6 w-72">
                <section class="flex flex-col gap-2">
                  <UFormField label="Date Check" class="">
                    <UPopover>
                      <UButton color="neutral" variant="outline" icon="i-lucide-calendar" class="w-full hover:cursor-pointer" size="md">
                        <p>{{ dateModelReport ? df.format(dateModelReport.toDate(getLocalTimeZone())) : 'Select a date' }}</p>
                      </UButton>
                      <template #content>
                        <UCalendar v-model="dateModelReport" class="p-2" />
                      </template>
                    </UPopover>
                  </UFormField>
                  <UFormField label="PIC (QC)" class="w-full">
                    <UInput v-model="qcMemberValue" placeholder="Enter QC Member" class="w-full" />
                  </UFormField>
                  <UFormField label="PIC (Production)" class="w-full">
                    <UInput v-model="productionMemberValue" placeholder="Enter Production Member" class="w-full" />
                  </UFormField>
                  <UFormField label="Judgement?" class="w-full">
                    <URadioGroup v-model="judgementValue" indicator="start" variant="card" :color="judgementColor" orientation="horizontal" defaultValue="OK" :items="judgementItems" size="sm" :ui="{ wrapper: 'w-23' }" />
                  </UFormField>
                </section>
                <UCheckbox required label="Are you sure all data is valid?" v-model="confirmation" />
              </aside>
            </section>
            <UButton :label="isLoading ? 'Downloading...' : 'Download PDF'" :loading="isLoading" class="self-end hover:cursor-pointer mb-2" size="md" color="neutral" @click="handleGetReport()" :disabled="!confirmation" />
          </main>
        </template>
      </UModal>
    </section>
  </section>
</template>

<style scoped></style>
