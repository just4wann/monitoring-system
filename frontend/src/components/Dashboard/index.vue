<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { temporaryData } from '../../utils';
import type { OvenResponseType } from '../../types';
import { store } from '../../store';

const emits = defineEmits<{
  getTemperatureTarget: [value: number];
}>();

const item = ref<string>('Mangan');

const maxTemperatureTarget = ref<number>(430);
const temperatureMonitoringData = ref<OvenResponseType[] | []>([]);

function checkingOvenType(oven: string) {
  oven.toLowerCase() === 'mangan'
    ? (temperatureMonitoringData.value = store.temperatureOvenMangan)
    : oven.toLowerCase() === 'bubuk'
    ? (temperatureMonitoringData.value = store.temperatureOvenBubuk)
    : (temperatureMonitoringData.value = store.temperatureOvenBobin);
}

function setMaxTemperatureTarget(oven: string) {
  if (oven.toLowerCase() === 'mangan') {
    maxTemperatureTarget.value = 430;
  } else if (oven.toLowerCase() === 'bobin') {
    maxTemperatureTarget.value = 250;
  } else {
    maxTemperatureTarget.value = 120;
  }
  emits('getTemperatureTarget', maxTemperatureTarget.value);
}

function handleGetItemProps(value: string) {
  item.value = value;
}

setInterval(() => {
  checkingOvenType(item.value);
}, 60000);

watchEffect(() => {
  checkingOvenType(item.value);
  setMaxTemperatureTarget(item.value);
});
</script>

<template>
  <section class="flex flex-col gap-5">
    <TopBar @updateItem="handleGetItemProps"/>
    <div class="flex gap-5 flex-wrap justify-center">
      <OvenCard v-for="oven in temporaryData" :ovenList="oven" :temperatureTarget="maxTemperatureTarget" :ovenLabel="item"/>
    </div>
  </section>
</template>
