<script setup lang="ts">
const props = defineProps<{
    temperature: string;
    temperatureTarget: number
}>()

let formatNumber = new Intl.NumberFormat('en-US', {
  signDisplay: 'always',
});

function barWidth(value: string): string {
  const percent = (parseInt(value) / props.temperatureTarget) * 100;
  return `${percent}%`;
}
</script>
<template>
  <div class="flex flex-col gap-5">
    <h1 class="flex items-end">
      <p class="text-5xl">{{ temperature }}</p>
      <span class="text-slate-400">°C</span>
    </h1>
    <div class="flex flex-col gap-1 w-50">
      <h1 class="text-xs text-slate-400 flex gap-1">
        <p>Target: {{ temperatureTarget }}°C</p>
        <span class="text-green-600">( {{ formatNumber.format(parseInt(temperature) - temperatureTarget) }}° )</span>
      </h1>
      <div class="h-1.5 rounded-md overflow-hidden w-full bg-slate-200">
        <div class="h-full w-1/6 bg-blue-400" :style="{ width: barWidth(temperature) }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
