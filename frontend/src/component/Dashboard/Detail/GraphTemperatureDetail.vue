<script lang="ts" setup>
import type { ITemperatureResponseType } from '../../../types';
import { OVEN_CONFIG } from '../../../constant';
import { ref, watchEffect } from 'vue';
import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair, VisAnnotations } from '@unovis/vue';
import { UtilityClass } from '../../../utils';
import type { AnnotationItem } from '@unovis/ts';

interface PreviewGraphReportProps {
    data: ITemperatureResponseType[];
    ovenType: string;
    target: number;
}

const props = defineProps<PreviewGraphReportProps>()

const itemAnnotations = ref<AnnotationItem[]>([])
const yDomainGraph = ref<number[]>([])

let count = 0;
let xPixel1 = -1;
let xPixel2 = -1;
let yPixel1 = -1;
let yPixel2 = -1;
const CHART_CONTAINER_WIDTH = 425;
const CHART_CONTAINER_HEIGHT = 200;

const setOvenConfigRecord = (oven: string) => {
  const o = OVEN_CONFIG[oven.toLowerCase()];
  if (!o) return;
  yDomainGraph.value = o.domain;
}

const setAnnotationCoordinate = (x: [number, number], y: [number, number]) => {
    itemAnnotations.value = [
        {
            x: ((x[0] + x[1]) / x.length),
            y: ((y[0] + y[1]) / y.length) - 20,
            content: { text: `${props.target}°C`, fontSize: 10 },
            subject: { x: x[0], y: y[0], radius: 3, fillColor: 'red' }
        },
        {
            x: ((x[0] + x[1]) / x.length),
            y: ((y[0] + y[1]) / y.length) - 20,
            content: { text: `${props.target}°C`, fontSize: 10 },
            subject: { x: x[1], y: y[1], radius: 3, fillColor: 'red' }
        }
    ]
}

const xReport = (_d: ITemperatureResponseType, i: number): number => {
    if (parseInt(_d.temperature) >= props.target && count == 0) {
        xPixel1 = Math.round((i / 1439) * CHART_CONTAINER_WIDTH);
        yPixel1 = Math.round((CHART_CONTAINER_HEIGHT - (parseInt(_d.temperature) / yDomainGraph.value[1]) * CHART_CONTAINER_HEIGHT));
        count = 1;
    }
    if (parseInt(_d.temperature) < (props.target - 2) && count == 1) {
        xPixel2 = Math.round((i / 1439) * CHART_CONTAINER_WIDTH);
        yPixel2 = Math.round((CHART_CONTAINER_HEIGHT - (parseInt(_d.temperature) / yDomainGraph.value[1]) * CHART_CONTAINER_HEIGHT));
        count = 2;
    }
    if (count == 2) {
        setAnnotationCoordinate([xPixel1, xPixel2], [yPixel1, yPixel2]);
        count = 3;
    }
    return i
};
const yReport = [(d: ITemperatureResponseType): number => parseInt(d.temperature)];
const toolTipFormat = (d: ITemperatureResponseType) => `<div class="flex flex-col -gap-1 items-start"><p class="text-[0.6rem]">${UtilityClass.generateTimestamp(d.createdAt)[2]}</p><p class="text-[0.7rem] self-end">${d.temperature} °C</p></div>`;
const xTickFormat = (i: number): string => UtilityClass.generateTimestamp(props.data[i].createdAt)[0];

watchEffect(() => {
    setOvenConfigRecord(props.ovenType);
})
</script>

<template>
    <main class="relative px-3 py-2 border rounded-xl flex flex-col gap-4 overflow-hidden">
        <p class="text-[0.6rem] pnsc-light text-slate-500">Oven temperature last 24h</p>
        <VisXYContainer :data="data" :height="250" :yDomain="yDomainGraph">
            <VisLine :x="xReport" :y="yReport" :lineWidth="1"/>
            <VisAxis type="x" :x="xReport" label="Time" labelFontSize="0.6rem" tickTextFontSize="0.6rem" :tickTextAngle="30" numTicks="20" :tickFormat="xTickFormat"/>
            <VisAxis type="y" :y="xReport" label="Temperature(°C)" labelFontSize="0.6rem" tickTextFontSize="0.6rem"/>
            <VisCrosshair :template="toolTipFormat" />
            <VisAnnotations :items="itemAnnotations"/>
            <VisTooltip />
        </VisXYContainer>
    </main>
</template>