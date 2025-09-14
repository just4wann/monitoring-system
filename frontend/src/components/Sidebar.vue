<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { ref } from 'vue';

const emits = defineEmits<{
    update: [value?: string]
}>()

const item = ref<TabsItem[]>([
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
  },
  {
    label: 'Record',
    icon: 'i-lucide-notebook-tabs',
  },
  {
    label: 'History',
    icon: 'i-lucide-history',
  },
]);
</script>
<template>
    <section class="flex flex-col justify-between bg-white text-slate-700 pl-10 py-10 pnsc-light overflow-auto">
      <div class="flex flex-col justify-start gap-10 w-fit">
        <img src="../assets/logo/Panasonic_logo_blue.png" alt="" width="120" class="mr-auto" />
        <UTabs :items="item" orientation="vertical" class="w-full" variant="link" size="lg">
          <template #content="{ item }">
            <p>{{ emits('update', item.label) }}</p>
          </template>
        </UTabs>
      </div>
      <div class="flex flex-col items-start gap-1">
        <p class="pnsc-light text-xs text-slate-500">Developed by</p>
        <h1 class="pnsc-bold leading-4 text-blue-800">PRODUCTION ENGINEERING</h1>
      </div>
    </section>
</template>