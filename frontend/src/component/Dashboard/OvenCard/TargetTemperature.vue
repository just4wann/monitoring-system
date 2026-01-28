<script lang="ts" setup>
import { ref, watch } from 'vue';

interface TargetTemperatureProps {
    target: number;
    currentTemperature: string
}

const props = defineProps<TargetTemperatureProps>();

const divisor = ref<string>('0')

let formatNumber = new Intl.NumberFormat("en-US", {
  signDisplay: 'always'
})

divisor.value = formatNumber.format(parseInt(props.currentTemperature) - props.target)

watch(props, (newVal, _oldVal) => {
    divisor.value = formatNumber.format(parseInt(newVal.currentTemperature) - newVal.target)
})
</script>

<template>
    <h1 class="text-xs text-slate-400 flex gap-1">
        <p>Target: {{target}}°C</p>
        <span :class="divisor.split('')[0] == '-' ? 'text-green-600' : 'text-red-600'">( {{ divisor }}° )</span>
    </h1>
</template>