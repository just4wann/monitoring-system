<script setup lang="ts">
defineProps<{
    ovenNo: number;
    ovenName: string;
}>()
</script>
<template>
  <div class="flex gap-2 items-center">
    <UIcon name="i-lucide-warehouse" />
    <h1 class="text-sm pnsc-light mb-0.5">Oven {{ ovenNo }} {{ ovenName }}</h1>
  </div>
</template>

<style scoped></style>
