<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { UtilityClass } from '../utils';

import Logo from './Logo.vue';

interface HeaderAndTimeProps {
  viewLogo: boolean;
}

defineProps<HeaderAndTimeProps>();

const time = ref<string>();
const date = ref<string>();

setInterval(() => {
    const { timestamp } = UtilityClass.generateCurrentTime();
    [time.value, date.value] = timestamp;
})

onMounted(() => {
    const { timestamp } = UtilityClass.generateCurrentTime();
    [time.value, date.value] = timestamp;
})
</script>

<template>
    <header class="flex items-center justify-center relative pt-3 px-6">
      <Logo v-if="viewLogo" :size="150" class="absolute left-6 top-2"/>
      <h1 class="text-2xl pnsc-semibold text-slate-700">Factory 1 Oven Monitoring System</h1>
      <div class="pnsc-light text-xs absolute right-6">
        <p>{{ time }}</p>
        <p>{{ date }}</p>
      </div>
    </header>
</template>