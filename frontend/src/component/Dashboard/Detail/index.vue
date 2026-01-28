<script setup lang="ts">
import { ref, watch } from 'vue';
import type { IOvenTemperatureResponseType, ITemperatureResponseType } from '../../../types';
import GraphTemperatureDetail from './GraphTemperatureDetail.vue';
import OvenProcessTime from './OvenProcessTime.vue';
import { UtilityClass } from '../../../utils';

interface PreviewGraphReportProps {
    data: IOvenTemperatureResponseType;
    peakTime: string;
}

interface IPillStyles {
    danger: string;
    success: string;
    secondary: string;
    info: string;
}

interface IUpAndDownIcon {
    increase: string[];
    decrease: string[];
    stable: string[];
}

const pillStyles: IPillStyles = {
    danger: 'border-red-400 bg-red-100 text-red-700',
    success: 'border-green-400 bg-green-100 text-green-700',
    secondary: 'border-slate-400 bg-slate-100 text-slate-700',
    info: 'border-blue-400 bg-blue-100 text-blue-700'
}

const iconUpAndDown: IUpAndDownIcon = {
    increase: ['pi pi-arrow-up', 'color: blue;'],
    decrease: ['pi pi-arrow-down', 'color: red;'],
    stable: ['pi pi-arrow-right-arrow-left', 'color: green;']
}

const reverseData = (data: ITemperatureResponseType[]): ITemperatureResponseType[] => data.slice(0, data.length).reverse();

const props = defineProps<PreviewGraphReportProps>();
const ovenStatus = ref<string>('Running');
const ovenStatusStyle = ref<string>('success');

const calculateUpAndDownIcon = (): string => {
    if (parseInt(props.data.temperatures[0].temperature) > parseInt(props.data.temperatures[1].temperature)) return 'increase';
    if (parseInt(props.data.temperatures[0].temperature) < parseInt(props.data.temperatures[1].temperature)) return 'decrease';
    return 'stable';
}

[ovenStatus.value, ovenStatusStyle.value] = UtilityClass.getOvenState(
    [props.data.temperatures[0].temperature, props.data.temperatures[1].temperature, props.data.temperatures[2].temperature, props.data.temperatures[3].temperature, props.data.temperatures[4].temperature], props.data.ovenTargetTemperature - 15, props.peakTime
)

watch(props, (newVal, _) => {
    [ovenStatus.value, ovenStatusStyle.value] = UtilityClass.getOvenState(
        [newVal.data.temperatures[0].temperature, newVal.data.temperatures[1].temperature, newVal.data.temperatures[2].temperature, newVal.data.temperatures[3].temperature, newVal.data.temperatures[4].temperature], newVal.data.ovenTargetTemperature - 15, newVal.peakTime
    )
})

</script>

<template>
    <main class="flex flex-col gap-3">
        <section class="flex items-center gap-2">
            <div class="p-3 border rounded-xl flex flex-col gap-2 w-28">
                <p class="text-[0.6rem] pnsc-light text-slate-500">Status</p>
                <span class="text-xs px-1.5 py-[0.1rem] pnsc-light rounded-md border w-fit" :class="pillStyles[ovenStatusStyle as keyof IPillStyles]">{{ ovenStatus }}</span>
            </div>
            <div class="p-3 border rounded-xl flex flex-col gap-2 w-28">
                <p class="text-[0.6rem] pnsc-light text-slate-500">Temperature Target</p>
                <h1 class="text-sm pnsc-light text-slate-600">{{ data.ovenTargetTemperature }}°C</h1>
            </div>
            <div class="p-3 border rounded-xl flex flex-col gap-2 w-28">
                <p class="text-[0.6rem] pnsc-light text-slate-500">Temperature Latest</p>
                <div class="flex items-center gap-1">
                    <h1 class="text-sm pnsc-light text-slate-600">{{ data.temperatures[0].temperature }}°C</h1>
                    <i :class="iconUpAndDown[calculateUpAndDownIcon() as keyof IUpAndDownIcon][0]" style="font-size: 0.6rem; font-weight: bold;" :style="iconUpAndDown[calculateUpAndDownIcon() as keyof IUpAndDownIcon][1]"/>
                </div>
            </div>
            <div class="p-3 border rounded-xl flex flex-col gap-2 w-28">
                <p class="text-[0.6rem] pnsc-light text-slate-500">Realtime Timer</p>
                <h1 class="text-sm pnsc-light text-slate-600">10 h 45 m</h1>
            </div>
        </section>
        <GraphTemperatureDetail :data="reverseData(data.temperatures)" :ovenType="data.ovenType" :target="data.ovenTargetTemperature"/>
        <OvenProcessTime/>
    </main>
</template>