<script setup lang="ts">
import type { BadgeType, OvenResponseType, TemperatureResponseType } from '../../types';

const props = defineProps<{
  temperatureTarget: number;
  ovenLabel: string;
  ovenList: OvenResponseType;
}>();

function setOvenStatus(values: TemperatureResponseType[]): string {
  const compareDataLength = 5;
  let count: number = 0;
  let isCooling: boolean = false;
  for (let i = 0; i < compareDataLength - 1; i++) {
    if (parseInt(values[compareDataLength - 1 - i].temperature) >= parseInt(values[compareDataLength - 1 - (i + 1)].temperature)) count++;
  }

  if (parseInt(values[0].temperature) < props.temperatureTarget - 10) isCooling = true;
  return count >= compareDataLength - 1 && isCooling ? 'Cooling' : 'Running';
}

function setStatusColor(values: TemperatureResponseType[]): BadgeType {
  const compareDataLength = 5;
  let count: number = 0;
  let isCooling: boolean = false;
  for (let i = 0; i < compareDataLength - 1; i++) {
    if (parseInt(values[compareDataLength - 1 - i].temperature) >= parseInt(values[compareDataLength - 1 - (i + 1)].temperature)) count++;
  }

  if (parseInt(values[0].temperature) < props.temperatureTarget - 10) isCooling = true;
  return count >= 4 && isCooling ? 'primary' : 'success';
}
</script>
<template>
  <UCard class="flex flex-col gap-5 w-[30rem]" :key="ovenList.id">
    <section class="flex justify-between items-center">
      <OvenLabel :ovenName="ovenLabel" :ovenNo="ovenList.ovenNo" />
      <UBadge :label="setOvenStatus(ovenList.temperatures)" variant="soft" :color="setStatusColor(ovenList.temperatures)" size="md" />
    </section>
    <section class="flex justify-between mt-5 gap-5">
      <TemperatureDisplay :temperature="ovenList.temperatures[0].temperature" :temperatureTarget="temperatureTarget" />
      <div class="w-52 flex flex-col gap-5 text-slate-500">
        <TemperatureGraph :temperatureList="ovenList.temperatures" :temperatureTarget="temperatureTarget" />
        <TemperatureInformation :temperatureTarget="temperatureTarget" />
      </div>
    </section>
  </UCard>
</template>

<style scoped></style>
