<script lang="ts" setup>
import { UtilityClass } from '../../../utils';

interface OvenTimerProps {
    runningDuration: string
}
defineProps<OvenTimerProps>();
</script>

<template>
    <div class="flex gap-1 items-end text-xs">
        <i class="pi pi-clock" style="font-size: 0.8rem"/>
        <p>Timer : </p>
        <p>{{ UtilityClass.generateDuration({ ms: runningDuration }) }}</p>
    </div>
</template>