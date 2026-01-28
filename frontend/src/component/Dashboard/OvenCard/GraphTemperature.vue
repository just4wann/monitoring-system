<script lang="ts" setup>
import { VisXYContainer, VisLine, VisTooltip } from '@unovis/vue';
import type { ITemperatureResponseType, TemperatureListType } from '../../../types';

interface GraphTemperatureProps {
    ovenData: ITemperatureResponseType[],
    temperatureTarget: number,
}
defineProps<GraphTemperatureProps>();

const xMonitoring = (_d: TemperatureListType, i: number): number => i;
const yMonitoring = [(d: TemperatureListType): number => parseInt(d.temperature)];

const reverseData = (data: TemperatureListType[]): TemperatureListType[] => data.slice(0, data.length - (data.length - 600)).reverse()
</script>

<template>
    <VisXYContainer :data="reverseData(ovenData)" :height="50" :yDomain="[0, temperatureTarget + 20]">
        <VisLine :x="xMonitoring" :y="yMonitoring" :lineWidth="2" color="#006154"/>
        <VisTooltip />
    </VisXYContainer>
</template>