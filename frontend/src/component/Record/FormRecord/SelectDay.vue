<script lang="ts" setup>
import { ref, watch } from 'vue';

interface SelecDayEmits {
    periode: [vals: Date[]]
}

const emits = defineEmits<SelecDayEmits>();

const dateModel = ref<Date[]>([new Date(), new Date()]);

watch(dateModel, (newVal, _oldVal) => {
    emits('periode', newVal)
})
</script>

<template>
    <main class="flex flex-col-reverse text-xs gap-1">
        <IconField>
            <InputIcon class="pi pi-calendar"/>
            <DatePicker id="pick-date" v-model="dateModel" :numberOfMonths="2" selectionMode="range" :manualInput="false" fluid size="small" placeholder="Select periode" class="w-full hover:cursor-pointer"/>
        </IconField>
        <label for="pick-date">Select day range</label>
    </main>
</template>