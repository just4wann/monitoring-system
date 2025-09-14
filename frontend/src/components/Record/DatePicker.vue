<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { shallowRef, watchEffect } from 'vue';
import type { DateRangeType } from '../../types';

const emits = defineEmits<{
    getDate: [value: DateRangeType]
}>()

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
});

const dateModel = shallowRef({
  start: new CalendarDate(2023, 1, 20),
  end: new CalendarDate(2023, 2, 10),
});

watchEffect(() => {
    emits('getDate', dateModel.value)
})
</script>
<template>
  <UPopover>
    <section class="flex items-center gap-3 text-sm w-full">
      <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" size="sm" class="w-full">
        <template v-if="dateModel.start">
          <template v-if="dateModel.end"> {{ df.format(dateModel.start.toDate(getLocalTimeZone())) }} - {{ df.format(dateModel.end.toDate(getLocalTimeZone())) }} </template>
        </template>
      </UButton>
    </section>
    <template #content>
      <UCalendar v-model="dateModel" class="p-2" color="neutral" :numberOfMonths="2" range :monthControls="true" />
    </template>
  </UPopover>
</template>

<style scoped></style>
