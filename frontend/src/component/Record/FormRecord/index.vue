<script lang="ts" setup>
import SelectDay from './SelectDay.vue';
import SelectOven from './SelectOven.vue';
import SelectMultipleOvenCH from './SelectMultipleOvenCH.vue';
import SelectTemperatureTarget from './SelectTemperatureTarget.vue';
import TimeRangePicker from './TimeRangePicker.vue';
import SubmitButton from './SubmitButton.vue';
import { ref } from 'vue';

interface FormRecordEmits {
  dayPeriode: [val: Date[]];
  startTime: [val: number];
  endTime: [val: number];
  ovenType: [val: string];
  ovenChannels: [val: number[]];
  targetTemperature: [val: number];
  submit: []
}

const emits = defineEmits<FormRecordEmits>();

const ovenType = ref<string>('Mangan');

const handlePeriodeEmits = (vals: Date[]) => {
  emits('dayPeriode', vals)
}

const handleStartTimeEmits = (vals: number) => {
  emits('startTime', vals);
}

const handleEndTimeEmits = (vals: number) => {
  emits('endTime', vals);
}

const handleUpdateOvenEmits = (vals: string) => {
  ovenType.value = vals;
  emits('ovenType', vals);
}

const handleMultiSelectEmits = (vals: number[]) => {
  emits('ovenChannels', vals);
}

const handleTargetTemperatureEmits = (vals: number) => {
  emits('targetTemperature', vals);
}

const handleButtonEmits = () => {
  emits('submit')
}
</script>

<template>
  <h2 class="self-start pnsc-light text-md mb-4">Data Record</h2>
  <aside class="w-full">
    <!-- <form class="space-y-4">
      <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center text-xs pnsc-light">
        <label class="text-sm w-32">Select day period :</label>
        <SelectDay @periode="handlePeriodeEmits"/>
       
        <label class="text-sm">Select time range :</label>
        <TimeRangePicker @start="handleStartTimeEmits" @end="handleEndTimeEmits"/>
       
        <label class="text-sm">Select oven type :</label>
        <SelectOven @updateOven="handleUpdateOvenEmits"/>
       
        <label class="text-sm">Select oven CH :</label>
        <SelectMultipleOvenCH @multiSelect="handleMultiSelectEmits" :ovenType="ovenType"/>
       
        <label class="text-sm">Select temperature target :</label>
        <SelectTemperatureTarget @target="handleTargetTemperatureEmits"/>
      </div>
       
      <SubmitButton @submit="handleButtonEmits"/>
    </form> -->
    <form class="w-full flex flex-col gap-3">
      <div class="flex items-start justify-between gap-5">
        <div class="w-full flex flex-col gap-2">
          <SelectOven @updateOven="handleUpdateOvenEmits"/>
         
          <SelectMultipleOvenCH @multiSelect="handleMultiSelectEmits" :ovenType="ovenType"/>
         
          <!-- <SelectTemperatureTarget @target="handleTargetTemperatureEmits"/> -->
        </div>
        <div class="w-full flex flex-col gap-2">
          <SelectDay @periode="handlePeriodeEmits"/>
         
          <TimeRangePicker @start="handleStartTimeEmits" @end="handleEndTimeEmits"/>
        </div>
      </div>
       
      <SubmitButton @submit="handleButtonEmits"/>
    </form>
  </aside>
</template>