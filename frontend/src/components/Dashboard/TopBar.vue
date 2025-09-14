<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const emits = defineEmits<{
    updateItem: [value: string]
}>()
const selectItems = ref<string[]>(['Mangan', 'Bobin', 'Bubuk']);
const selectedItems = ref<string>('Mangan');

watchEffect(() => {
    emits('updateItem', selectedItems.value);
})
</script>
<template>
  <div class="flex items-center w-full justify-between">
    <h1 class="text-center pnsc-bold">OVEN {{ selectedItems.toUpperCase() }}</h1>
    <div class="flex gap-2">
      <USelect :items="selectItems" v-model="selectedItems" placeholder="Select Oven" variant="outline" class="pnsc-light w-40" />
    </div>
  </div>
</template>