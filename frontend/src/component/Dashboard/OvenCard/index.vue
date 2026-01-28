<script lang="ts" setup>
import type { IOvenDurationResponseType, IOvenTemperatureResponseType, IUpdateTemperature } from '../../../types';
import { OVEN_CONFIG } from '../../../constant';

import OvenTitle from './OvenTitle.vue';
import OvenIndicator from './OvenIndicator.vue';
import CurrentTemperature from './CurrentTemperature.vue';
import TargetTemperature from './TargetTemperature.vue';
import BarTemperature from './BarTemperature.vue';
import FanStatus from './FanStatus.vue';
import GraphTemperature from './GraphTemperature.vue';
import OvenTimer from './OvenTimer.vue';
import TemperaturePeakTimer from './TemperaturePeakTimer.vue';
import OvenStatus from './OvenStatus.vue';
import OvenDetail from '../Detail/index.vue'
import { ref, watchEffect } from 'vue';
import { useToast } from 'primevue';
import { OvenAPI } from '../../../composables';

interface OvenCardProps {
  temperatureData: IOvenTemperatureResponseType[] | [],
  durationData: IOvenDurationResponseType[] | [],
  ovenName: string,
  dashboardView: boolean;
  role: string | null;
}

const props = defineProps<OvenCardProps>();

const toast = useToast()
const maxTemperatureTarget = ref<number[]>([]);
const showModalSetting = ref<boolean>(false);
const showDrawerDetails = ref<boolean>(false);
const selectedTemperatureSetting = ref<string>("430");
const cardIndex = ref<number>(-1);
const detailCardIndex = ref<number>(-1);
const ovenIndex = ref<number>(-1);

const temperatureSettingList = ref<string[]>(["430"]);

const setOvenConfigDashboard = (oven: string) => {
  maxTemperatureTarget.value = []
  const o = OVEN_CONFIG[oven.toLowerCase()];
  if (!o) return;
  for (let i = 0; i < o.count; i++) {
    maxTemperatureTarget.value.push(o.maxTemperature);
  }
}

const capitalize = (s: string): string => !s ? '' : s.charAt(0).toUpperCase() + s.slice(1);

const setTemperatureList = (oven: string) => {
  switch (oven) {
    case "Mangan":
      temperatureSettingList.value = ["430"];
      break;
    case "Bobin":
      temperatureSettingList.value = ["250"];
      break;
    case "Bubuk":
      temperatureSettingList.value = ["120", "90", "70"];
      break;
  }
}

const showModalSet = (idxCard: number, idxOven: number) => {
  showModalSetting.value = true;
  cardIndex.value = idxCard;
  ovenIndex.value = idxOven;
}

const showDrawerDetailSet = (idxCard: number) => {
  showDrawerDetails.value = true;
  detailCardIndex.value = idxCard;
}

const setTemperatureEach = async() => {
  const body: IUpdateTemperature = {
    ovenId: ovenIndex.value,
    temperature: parseInt(selectedTemperatureSetting.value)
  }
  const res = await OvenAPI.updateTemperatureTarget(body);
  if (res.statusCode == 200) {
    toast.add({
      summary: 'Success',
      detail: 'Target Temperature Updated',
      severity: 'success',
      life: 3000
    })
  }
  maxTemperatureTarget.value[cardIndex.value] = parseInt(selectedTemperatureSetting.value);
  showModalSetting.value = false;
}

watchEffect(() => { 
  setOvenConfigDashboard(props.ovenName);
  setTemperatureList(props.ovenName);
})
</script>

<template>
    <div class="flex flex-wrap items-center justify-center" :class="dashboardView ? 'gap-3' : 'gap-3'">
      <Card v-for="(oven, index) in temperatureData" class="flex flex-col border hover:border-[#00917d]" :class="dashboardView ? 'w-[25rem]' : 'w-[22rem]'" :key="index">
        <template #content>
          <section class="flex justify-between items-center">
            <OvenTitle :ovenName="ovenName" :ovenNo="oven.ovenNo"/>
            <div class="flex items-center gap-2">
              <Button v-if="role !== 'guest'" icon="pi pi-cog" severity="secondary" size="small" rounded @click="showModalSet(index, oven.id)"/>
              <OvenIndicator :ovenData="oven" :maxTemperatureTarget="oven.ovenTargetTemperature" :peakTime="durationData[index].timer.peakDuration"/>
            </div>
          </section>
          <section class="flex justify-between gap-4 mt-3">
            <div class="flex w-full flex-col gap-2">
              <CurrentTemperature :temperature="`${oven.temperatures[0].temperature}`"/>
              <div class="flex flex-col gap-2">
                <TargetTemperature :target="oven.ovenTargetTemperature" :currentTemperature="`${oven.temperatures[0].temperature}`"/>
                <BarTemperature :target="oven.ovenTargetTemperature" :currentTemperature="`${oven.temperatures[0].temperature}`"/>
                <FanStatus :ovenData="oven" :maxTemperatureTarget="oven.ovenTargetTemperature" :peakTime="durationData[index].timer.peakDuration"/>
              </div>
              <button @click="showDrawerDetailSet(index)" class="bg-blue-100 px-1 py-1 rounded-md hover:bg-blue-200">
                <p class="text-xs">Details</p>
              </button>
            </div>
            <div class="w-40 flex flex-col gap-5 text-slate-500">
              <GraphTemperature :ovenData="oven.temperatures" :temperatureTarget="oven.ovenTargetTemperature"/>
              <section class="flex flex-col gap-2">
                <OvenTimer :runningDuration="durationData[index].timer.runningDuration"/>
                <TemperaturePeakTimer :peakDuration="durationData[index].timer.peakDuration" :temperatureTarget="oven.ovenTargetTemperature"/>
                <OvenStatus :severity="durationData[index].timer.severityStatus" :label="durationData[index].timer.labelStatus"/>
              </section>
            </div>
          </section>
        </template>
      </Card>
      <Dialog v-model:visible="showModalSetting" header="Temperature Setting" modal :style="{ width: '25.5rem' }">
        <div class="flex flex-col gap-5">
            <div class="flex flex-col-reverse gap-1 self-center">
                <SelectButton v-model="selectedTemperatureSetting" :options="temperatureSettingList"/>
            </div>
            <div class="flex items-center gap-2 self-end">
                <Button class="ml-2" label="Cancel" size="small" type="button" @click="showModalSetting = false" severity="secondary"/>
                <Button 
                    label="Set"
                    size="small"
                    icon="pi pi-cog" 
                    iconPos="right" 
                    variant="outlined"
                    @click="setTemperatureEach"
                />
            </div>
        </div>
    </Dialog>
    <div class="flex justify-center">
      <Drawer v-model:visible="showDrawerDetails" position="right" style="width: 35rem;">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-warehouse" style="font-size: 0.8rem;"/>
            <p class="text-sm">Oven {{ temperatureData[detailCardIndex].ovenNo }} {{ capitalize(temperatureData[detailCardIndex].ovenType) }} Details</p>
          </div>
        </template>
        <OvenDetail :data="temperatureData[detailCardIndex]" :peakTime="durationData[detailCardIndex].timer.peakDuration"/>
      </Drawer>
    </div>
    </div>
</template>