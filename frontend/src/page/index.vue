<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OvenAPI } from '../composables';
import { store } from '../store';

const toast = useToast();
const target = ref<number>(430);

const pageIndication = ref<string | undefined>('');

setInterval(async () => {
  // const { message: _manganMessage, data: manganData } = await OvenAPI.getOvenByType('mangan');
  // const { message: _bobinMessage, data: bobinData } = await OvenAPI.getOvenByType('bobin');
  // const { message: _bubukMessage, data: bubukData } = await OvenAPI.getOvenByType('bubuk');

  // if (manganData.length === 0 || bobinData.length === 0 || bubukData.length === 0) {
  //   toast.add({
  //     title: 'Error',
  //     description: 'Internal Server Error',
  //     color: 'error',
  //   })
  //   return;
  // }
  // store.temperatureOvenMangan = manganData;
  // store.temperatureOvenBubuk = bubukData;
  // store.temperatureOvenBobin = bobinData;
}, 60000);

onMounted(async () => {
  // const { message: _manganMessage, data: manganData } = await OvenAPI.getOvenByType('mangan');
  // const { message: _bobinMessage, data: bobinData } = await OvenAPI.getOvenByType('bobin');
  // const { message: _bubukMessage, data: bubukData } = await OvenAPI.getOvenByType('bubuk');

  // if (manganData.length === 0 || bobinData.length === 0 || bubukData.length === 0) {
  //   toast.add({
  //     title: 'Error',
  //     description: 'Internal Server Error',
  //     color: 'error',
  //   })
  //   return;
  // }

  // store.temperatureOvenMangan = manganData;
  // store.temperatureOvenBubuk = bubukData;
  // store.temperatureOvenBobin = bobinData;
});

function handleUpdatePageIndicationProps(value?: string) {
  pageIndication.value = value
}
function handleGetTemperatureTargetProps(value: number) {
  target.value = value;
}
</script>
<template>
  <main class="relative flex h-screen">
    <Sidebar @update="handleUpdatePageIndicationProps"/>
    <UCard class="w-full overflow-y-auto" variant="subtle">
      <template #header>
        <Header/>
      </template>
      <Dashboard v-if="pageIndication == 'Dashboard'" @getTemperatureTarget="handleGetTemperatureTargetProps"/>
      <Record v-if="pageIndication == 'Record'" :maxTemperatureTarget="target"/>
      <History v-if="pageIndication === 'History'"/>
    </UCard>
  </main>
</template>