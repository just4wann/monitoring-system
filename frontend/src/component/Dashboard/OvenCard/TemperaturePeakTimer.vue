<script lang="ts" setup>
import { UtilityClass } from '../../../utils';

interface TemperaturePeakTimerProps {
    temperatureTarget: number;
    peakDuration: string;
}
defineProps<TemperaturePeakTimerProps>();
</script>

<template>
    <div class="flex gap-1 items-end text-xs">
        <i class="pi pi-gauge" style="font-size: 0.8rem"/>
        <p>Above {{ temperatureTarget - 5 }}°C : </p>
        <p>{{ UtilityClass.generateDuration({ ms: peakDuration }) }}</p>
    </div>
</template>