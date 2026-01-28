<script lang="ts" setup>
import GraphLoading from './GraphLoading.vue';
import PreviewGraphReport from './PreviewGraphReport.vue';
import type { ITemperatureFTPResponseType } from '../../../types';

interface GraphRecordEmits {
  graphEl: [val: HTMLElement | null]
}

interface GraphRecordProps {
  data: ITemperatureFTPResponseType[];
  isComplete: boolean;
  isPreviewComplete: boolean;
  ovenType: string;
  getGraphEl: boolean;
}

defineProps<GraphRecordProps>();

const emits = defineEmits<GraphRecordEmits>();

const handleGraphElEmit = (val: HTMLElement | null) => {
  emits('graphEl', val)
}
</script>

<template>
    <section class="">
          <GraphLoading v-if="isComplete" class="flex flex-wrap gap-2 justify-center w-full"/>
          <div v-else class="flex flex-wrap gap-2 justify-center w-full">
            <!-- <EmptyPreviewState :dataLength="data.length" :loading="isComplete"/> -->
            <PreviewGraphReport 
              v-for="(val, i) in data" 
              :key="val.no || i" 
              :data="val" 
              :loading="isPreviewComplete" 
              :tickFormatData="data[0]"
              :ovenType="ovenType"
              :getGraphEl="getGraphEl"
              @graphElements="handleGraphElEmit"
            />
          </div>
    </section>
</template>