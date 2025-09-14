<script setup lang="ts">
import { VisXYContainer, VisLine, VisTooltip } from '@unovis/vue';
import type { TemperatureListType, TemperatureResponseType } from '../../types';

defineProps<{
    temperatureTarget: number;
    temperatureList: TemperatureResponseType[]
}>()

const xMonitoring = (_d: TemperatureListType, i: number): number => i;
const yMonitoring = [(d: TemperatureListType): number => parseInt(d.temperature)];

function reverseData(data: TemperatureListType[]): TemperatureListType[] {
  if (data.length === 0)
    return [
      {
        temperature: '0',
        createdAt: '',
      },
    ];

  let shortedData = [];
  for (let i = 0; i < 20; i++) {
    shortedData.unshift(data[i]);
  }
  return shortedData;
}
</script>
<template>
    <VisXYContainer :data="reverseData(temperatureList)" :height="50" :yDomain="[0, temperatureTarget + 20]">
      <VisLine :x="xMonitoring" :y="yMonitoring" :lineWidth="2" />
      <VisTooltip />
    </VisXYContainer>
</template>

<style scoped></style>
