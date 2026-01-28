<script lang="ts" setup>
import type { ITemperatureFTPResponseType, ITemperatureData } from '../../../types';
import { OVEN_CONFIG } from '../../../constant';
import { ref, watchEffect } from 'vue';
import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/vue';

interface PreviewGraphReportEmits {
    graphElements: [vals: HTMLElement | null];
}

interface PreviewGraphReportProps {
    loading: boolean;
    data: ITemperatureFTPResponseType;
    tickFormatData: ITemperatureFTPResponseType;
    ovenType: string;
    getGraphEl: boolean;
}

const props = defineProps<PreviewGraphReportProps>()

const emits = defineEmits<PreviewGraphReportEmits>()

const domainGraph = ref<number[]>([])
const graphAreas = ref<HTMLElement | null>(null)

const setOvenConfigRecord = (oven: string) => {
  const o = OVEN_CONFIG[oven.toLowerCase()];
  if (!o) return;
  domainGraph.value = o.domain;
}

const capitalize = (s: string): string => !s ? '' : s.charAt(0).toUpperCase() + s.slice(1);

const xReport = (_d: ITemperatureData, i: number): number => i;
const yReport = [(d: ITemperatureData): number => parseInt(d.temperature)];
const toolTipFormat = (d: ITemperatureData) => `<div class="flex flex-col -gap-1 items-start"><p class="text-[0.7rem]">${d.timestamp}</p><p class="text-[0.9rem] self-end">${d.temperature} °C</p></div>`;
const xReportTickFormat = (i: number): string => props.tickFormatData.values[i].timestamp.split(',')[1];

watchEffect(() => {
    const state = props.getGraphEl;
    if (state || !state) {
        emits('graphElements', graphAreas.value)
    }
    setOvenConfigRecord(props.ovenType);
})
</script>

<template>
    <div class="mb-6 w-[33rem] pnsc-light">
        <h3 v-if="loading" class="text-center mb-3">Preview Graph Oven {{ data.no }} {{ capitalize(data.name) }}</h3>
        <Card class="w-full" v-if="loading">
            <template #content>
                <section ref="graphAreas">
                    <VisXYContainer :data="data.values" :height="550" :yDomain="domainGraph">
                        <VisLine :x="xReport" :y="yReport" :lineWidth="2" color="blue"/>
                        <VisAxis type="x" :x="xReport" label="Time" labelFontSize="0.8rem" tickTextFontSize="0.8rem" :tickTextAngle="30" :numTicks="data.values.length < 100 ? 0 : 10" :tickFormat="xReportTickFormat"/>
                        <VisAxis type="y" :y="xReport" label="Temperature(°C)" labelFontSize="0.8rem" tickTextFontSize="0.8rem" />
                        <VisCrosshair :template="toolTipFormat" />
                        <VisTooltip />
                    </VisXYContainer>
                </section>
            </template>
        </Card>
    </div>
</template>