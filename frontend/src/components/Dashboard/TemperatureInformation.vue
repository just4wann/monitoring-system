<script setup lang="ts">
defineProps<{
  temperatureTarget: number;
}>();
</script>
<template>
  <section class="flex flex-col gap-2">
    <div class="flex gap-1 items-center text-xs">
      <UIcon name="i-lucide-timer" class="size-4" />
      <p>Timer :</p>
      <p>{{}} min</p>
    </div>
    <div class="flex gap-1 items-center text-xs">
      <UIcon name="i-lucide-thermometer" class="size-4" />
      <p>Above {{ temperatureTarget - 5 }}°C :</p>
      <p>{{}}min</p>
    </div>
  </section>
</template>

<style scoped></style>
