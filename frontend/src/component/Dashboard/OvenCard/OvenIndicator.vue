<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { BadgeType, IOvenTemperatureResponseType } from '../../../types';
import { UtilityClass } from '../../../utils';

interface OvenIndicatorProps {
    ovenData: IOvenTemperatureResponseType;
    maxTemperatureTarget: number;
    peakTime: string;
}
const props = defineProps<OvenIndicatorProps>();
const label = ref<string>('');
const severity = ref<BadgeType>();
const style = ref<string>('');

[label.value, severity.value, style.value] = UtilityClass.getOvenState(
        [props.ovenData.temperatures[0].temperature, props.ovenData.temperatures[1].temperature, props.ovenData.temperatures[2].temperature, props.ovenData.temperatures[3].temperature, props.ovenData.temperatures[4].temperature], 
        props.maxTemperatureTarget - 15,
        props.peakTime
    )

watch(props, (newVal, _oldVal) => {
    [label.value, severity.value, style.value] = UtilityClass.getOvenState(
        [newVal.ovenData.temperatures[0].temperature, newVal.ovenData.temperatures[1].temperature, newVal.ovenData.temperatures[2].temperature, newVal.ovenData.temperatures[3].temperature, newVal.ovenData.temperatures[4].temperature], 
        newVal.maxTemperatureTarget - 15,
        newVal.peakTime
    )
})
</script>

<template>
    <main class="flex items-center gap-2">
        <Tag
            :value="label"
            :severity="severity"
            rounded 
            :style="style"
        />
    </main>
</template>