<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip, VisScatter, VisBulletLegend } from '@unovis/vue';
import { ref, onMounted, shallowRef } from 'vue';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

type Data = { id: number; timestamp: string; temperature: number };

const showGraph = ref<boolean>(false);
const selectItems = ref<string[]>(['Mangan', 'Bobin', 'Bubuk']);
const selectedItems = ref<string>('');
const selectNo = ref<string[]>(['Block 1', 'Block, 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6']);
const selectedNo = ref<string>('');
const pageIndication = ref<string | undefined>('');
const time = ref<string>();
const date = ref<string>();
const count = 20;

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
});
const dateModel = shallowRef({
  start: new CalendarDate(2023, 1, 20),
  end: new CalendarDate(2023, 1, 30),
});

const x = (_d: Data, i: number): number => i;
const y = [(d: Data): number => d.temperature];

const item = ref<TabsItem[]>([
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
  },
  {
    label: 'Record',
    icon: 'i-lucide-notebook-tabs',
  },
  {
    label: 'History',
    icon: 'i-lucide-history',
  },
]);

const toolTipFormat = (d: Data) => `<p class="text-xs">${d.temperature} C</p>`;

function checkSlot(item?: string) {
  pageIndication.value = item;
}

function generateTimestamp(at: string | Date): string[] {
  const date = new Date(at);
  const formatDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
  });

  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return [`${time}`, `${formatDate}`];
}

function generateTemperatureData(count: number): Data[] {
  const data = [];
  const startTime = new Date('2025-08-18T08:00:00Z');

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startTime.getTime() + i * 1 * 60 * 1000);
    const temperature = 25 + Math.random() * 10;

    data.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      temperature: parseFloat(temperature.toFixed(1)),
    });
  }

  return data;
}

const data = generateTemperatureData(500);

function xTickFormat(i: number): string {
  const d = getShortData(data);
  return generateTimestamp(d[i].timestamp)[0];
}

function xTickFormatL(i: number): string {
  return generateTimestamp(data[i].timestamp)[0];
}

function generateTime(): { timestamp: string[]; current: number[] } {
  const now = new Date();
  return {
    timestamp: [
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Jakarta',
      }),
      now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      }),
    ],
    current: [now.getFullYear(), now.getMonth() + 1, now.getDate()],
  };
}

function getShortData(data: Data[]): Data[] {
  let shortedData = [];
  for (let i = data.length - 1; i > data.length - 10; i--) {
    shortedData.unshift(data[i]);
  }
  return shortedData;
}

setInterval(() => {
  const { timestamp } = generateTime();
  time.value = timestamp[0];
  date.value = timestamp[1];
}, 60000);

onMounted(() => {
  const { timestamp, current } = generateTime();
  time.value = timestamp[0];
  date.value = timestamp[1];

  dateModel.value.start = new CalendarDate(current[0], current[1], current[2]);
  dateModel.value.end = new CalendarDate(current[0], current[1], current[2]);
});
</script>
<template>
  <main class="relative flex h-screen">
    <section class="flex flex-col justify-between bg-white text-slate-700 pl-10 py-10 pnsc-light overflow-auto">
      <div class="flex flex-col justify-start gap-10 w-fit">
        <img src="../assets/logo/Panasonic_logo_blue.png" alt="" width="120" class="mr-auto" />
        <UTabs :items="item" orientation="vertical" class="w-full" variant="link" size="lg">
          <template #content="{ item }">
            <p>{{ checkSlot(item.label) }}</p>
          </template>
        </UTabs>
      </div>
      <div class="flex flex-col items-start gap-1">
        <p class="pnsc-light text-xs text-slate-500">Developed by</p>
        <h1 class="pnsc-bold leading-4 text-blue-800">PRODUCTION ENGINEERING</h1>
      </div>
    </section>
    <UCard class="w-full overflow-y-auto" variant="soft">
      <template #header>
        <section class="flex justify-center relative">
          <h1 class="text-2xl pnsc-bold text-blue-800 tracking-wider">FACTORY 1 OVEN MONITORING SYSTEM</h1>
          <div class="pnsc-light text-xs absolute right-0">
            <p>{{ time }}</p>
            <p>{{ date }}</p>
          </div>
        </section>
      </template>
      <section v-if="pageIndication == 'Dashboard'" class="flex flex-col gap-5">
        <div class="flex items-center w-full justify-between">
          <h1 class="text-center pnsc-bold">OVEN {{ selectedItems.toUpperCase() || 'MANGAN' }}</h1>
          <div class="flex gap-2">
            <USelect :items="selectItems" v-model="selectedItems" placeholder="Select Oven" variant="outline" class="pnsc-light w-40" />
            <USelect :items="selectNo" v-model="selectedNo" placeholder="Select Block No" variant="outline" class="pnsc-light w-40" />
          </div>
        </div>
        <div class="flex gap-1.5 flex-wrap justify-start">
          <UCard v-for="i in count" class="flex flex-col gap-5" :class="count < 3 ? 'w-full' : 'w-95'">
            <h1 class="text-xs pnsc-light mb-2">Oven {{ i }} {{ selectedItems }}</h1>
            <VisXYContainer :data="getShortData(data)" :height="180">
              <VisLine :x="x" :y="y" :lineWidth="2" />
              <VisAxis type="x" :x="x" :gridLine="false" label="Time" labelFontSize="11px" tickTextFontSize="12px" :tickFormat="xTickFormat" :numTicks="5" :tickTextAngle="15"/>
              <VisAxis type="y" :y="x" label="Temp(C)" labelFontSize="11px" tickTextFontSize="12px" />
              <VisCrosshair :template="toolTipFormat" />
              <VisTooltip />
            </VisXYContainer>
          </UCard>
        </div>
      </section>
      <section v-if="pageIndication === 'Record'" class="flex items-start gap-2">
        <section class="flex-1">
          <h1 class="pnsc-bold items-center">Data Record</h1>
          <section class="flex flex-col gap-4 w-fit">
            <div class="flex flex-2 mt-5 gap-5">
              <div class="flex flex-col gap-5 pnsc-light text-sm">
                <p>Select periode time :</p>
                <p>Select Oven Type :</p>
                <p>Oven No :</p>
              </div>
              <div class="flex-1 flex flex-col items-start justify-center gap-3">
                <UPopover>
                  <section class="flex items-center gap-3 text-sm">
                    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" size="sm" class="w-full">
                      <template v-if="dateModel.start">
                        <template v-if="dateModel.end"> {{ df.format(dateModel.start.toDate(getLocalTimeZone())) }} - {{ df.format(dateModel.end.toDate(getLocalTimeZone())) }} </template>
                        <template v-else>
                          {{ df.format(dateModel.start.toDate(getLocalTimeZone())) }}
                        </template>
                      </template>
                      <template v-else> Pick a periode time </template>
                    </UButton>
                  </section>
                  <template #content>
                    <UCalendar v-model="dateModel" class="p-2" :number-of-months="1" range color="neutral" />
                  </template>
                </UPopover>
                <USelect :items="selectItems" v-model="selectedItems" placeholder="Select Oven Type" variant="outline" class="pnsc-light w-full" size="sm" />
                <UInput placeholder="Input Oven CH.." size="sm" class="w-full" />
              </div>
            </div>
            <UButton label="Show Graph" class="self-end" size="sm" color="neutral" @click="showGraph = !showGraph" />
          </section>
        </section>
        <section class="flex-2 h-[calc(100vh-120px)] flex flex-col gap-5">
          <UCard class="h-full flex justify-center items-center">
            <UCard class="flex flex-col gap-5 w-[45rem]" variant="soft" v-if="showGraph">
              <VisXYContainer :data="data" :height="500">
                <VisLine :x="x" :y="y" :lineWidth="2" />
                <VisAxis type="x" :x="x" label="Time" labelFontSize="11px" tickTextFontSize="12px" :numTicks="10" :tickFormat="xTickFormatL" :tickTextAngle="30" />
                <VisAxis type="y" :y="x" label="Temp(C)" labelFontSize="11px" tickTextFontSize="12px" />
                <VisCrosshair :template="toolTipFormat" />
                <VisTooltip />
              </VisXYContainer>
            </UCard>
            <h1 v-else class="text-slate-400 text-lg">Result will appear here</h1>
          </UCard>
          <UButton label="Download PDF" class="self-end" size="sm" color="primary" v-if="showGraph" />
        </section>
      </section>
      <section v-if="pageIndication === 'History'">
        <h1>History Page</h1>
      </section>
    </UCard>
  </main>
</template>
