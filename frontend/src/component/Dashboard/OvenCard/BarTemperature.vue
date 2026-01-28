<script lang="ts" setup>
interface BarTemperatureProps {
    target: number;
    currentTemperature: string;
}
const props = defineProps<BarTemperatureProps>();

const barWidth = (value: string): string => {
  const percent = (parseInt(value) / props.target) * 100;
  return `${percent}%`;
}
</script>

<template>
    <div class="h-1.5 rounded-md overflow-hidden w-full bg-slate-200 -mt-1">
        <div class="h-full w-1/6 bg-[#006154]" :style="{ width: barWidth(currentTemperature) }"></div>
    </div>
</template>