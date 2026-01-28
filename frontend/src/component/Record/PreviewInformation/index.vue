<script lang="ts" setup>
import type { ITemperatureFTPResponseType } from '../../../types';
import PreviewCard from '../PreviewInformation/PreviewCard/index.vue'
import PreviewAdditionalInfo from '../PreviewInformation/PreviewAdditionalInfo/index.vue'
import { ref } from 'vue';

interface PreviewInformationEmits {
  judgements: [vals: string[]]
  lot: [vals: string[]]
  check: [vals?: Date | Date[] | (Date | null)[] | null]
  qc: [vals?: string]
  confirm: [vals: boolean]
}

interface PreviewInformationProps {
  data: ITemperatureFTPResponseType[]
  temperatureLabel: number[]
  startTime: string[]
  finishTime: string[]
  overallTime: string[]
  role: string | null
  judgements: string[]
}

const emits = defineEmits<PreviewInformationEmits>()

defineProps<PreviewInformationProps>();

const set = ref<boolean>(false);

// const handleJudgementsEmit = (val: string[]) => {
//   emits('judgements', val);
// }

const handleLotEmit = (val: string[]) => {
  emits('lot', val);
}

const handleCheckDateEmit = (val?: Date | Date[] | (Date | null)[] | null) => {
  emits('check', val)
}

const handleQCInfoEmit = (val?: string) => {
  emits('qc', val)
}

const handleConfirmEmit = (val: boolean) => {
  emits('confirm', val)
}
</script>

<template>
    <main class="flex flex-col px-2">
      <section class="flex flex-col gap-10 items-center">
        <PreviewCard 
          :data="data"
          :startTime="startTime"
          :finishTime="finishTime"
          :overallTime="overallTime"
          :temperatureLabel="temperatureLabel"
          :setJudgement="set"
          :role="role"
          :judgements="judgements"
          @lots="handleLotEmit"
        />
        <Divider/>
        <PreviewAdditionalInfo
          v-if="role == 'qc'"
          @checkDateInformation="handleCheckDateEmit"
          @qcInformation="handleQCInfoEmit"
          @confirm="handleConfirmEmit"
        />
      </section>
  </main>
</template>