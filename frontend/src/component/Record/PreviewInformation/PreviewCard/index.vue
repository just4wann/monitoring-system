<script lang="ts" setup>
import OvenInfo from '../PreviewCard/OvenInfo.vue';
import OvenTimeInfo from '../PreviewCard/OvenTimeInfo.vue';
import OvenLot from './OvenLot.vue';
import OvenJudgement from '../PreviewCard/OvenJudgement.vue';
import type { ITemperatureFTPResponseType } from '../../../../types';
import { ref, watchEffect } from 'vue';

interface PreviewCardProps {
    data: ITemperatureFTPResponseType[];
    startTime: string[];
    finishTime: string[];
    overallTime: string[];
    temperatureLabel: number[];
    setJudgement: boolean;
    role: string | null;
    judgements: string[]
}

interface PreviewCardEmits {
    lots: [vals: string[]]
}

const props = defineProps<PreviewCardProps>()

const emits = defineEmits<PreviewCardEmits>();

const lotValue = ref<string[]>([])

watchEffect(() => {
    const set = props.setJudgement;
    if (set || !set) {
        emits('lots', lotValue.value)
    }
})
</script>

<template>
    <section class="flex gap-2 justify-center flex-wrap -mb-5 text-xs">
        <Card v-for="(data, index) in data" :key="index">
            <template #content>
                <main class="flex flex-col items-center gap-8">
                    <OvenInfo :ovenName="data.name" :ovenNo="data.no"/>
                    <Divider>
                        <p class="text-xs text-slate-800 bg-yellow-300 px-1">{{ `Temperature ${temperatureLabel[index]}°C` }}</p>
                    </Divider>
                    <section class="flex flex-col items-center gap-2 -mt-8 w-full">
                        <OvenTimeInfo 
                            :startPeak="startTime[index]"
                            :finishPeak="finishTime[index]"
                            :overall="overallTime[index]"
                        />
                        <OvenJudgement v-if="role == 'qc'" :judgementResult="judgements[index]"/>
                        <OvenLot v-if="role == 'qc'" v-model="lotValue[index]"/>
                    </section>
                </main>
            </template>
        </Card>
    </section>
</template>