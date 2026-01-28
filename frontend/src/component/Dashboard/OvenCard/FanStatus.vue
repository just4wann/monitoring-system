<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { IOvenTemperatureResponseType } from '../../../types';
import { UtilityClass } from '../../../utils';

interface FanStatusProps {
    ovenData: IOvenTemperatureResponseType;
    maxTemperatureTarget: number;
    peakTime: string;
}

const label = ref<string>('');

const props = defineProps<FanStatusProps>();

[ , , , label.value] = UtilityClass.getOvenState(
    [props.ovenData.temperatures[0].temperature, props.ovenData.temperatures[1].temperature, props.ovenData.temperatures[2].temperature, props.ovenData.temperatures[3].temperature, props.ovenData.temperatures[4].temperature], 
    props.maxTemperatureTarget - 15,
    props.peakTime
)

watch(props, (newVal, _oldVal) => {
    [ , , , label.value] = UtilityClass.getOvenState(
        [newVal.ovenData.temperatures[0].temperature, newVal.ovenData.temperatures[1].temperature, newVal.ovenData.temperatures[2].temperature, newVal.ovenData.temperatures[3].temperature, newVal.ovenData.temperatures[4].temperature], 
        newVal.maxTemperatureTarget - 15,
        newVal.peakTime
    )
})
</script>

<template>
    <div class="text-slate-500">
        <div class="flex gap-2 items-center">
            <div class="flex gap-1 items-end text-xs">
                <i class="pi pi-slack" style="font-size: 0.8rem"/>
                <p>Fan :</p>
            </div>
            <Badge :value="label" severity="secondary" size="small"/>
        </div>
    </div>
</template>