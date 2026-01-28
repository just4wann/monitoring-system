<script lang="ts" setup>
import { ref } from 'vue';

interface TimeRangePickerEmits {
    start: [val: number];
    end: [val: number];
}

const emits = defineEmits<TimeRangePickerEmits>()

const startHour = ref<number>();
const endHour = ref<number>();

const onStartUpdate = (val: number) => {
    emits('start', val);
}

const onEndUpdate = (val: number) => {
    emits('end', val)
}

</script>

<template>
    <div class="flex flex-col gap-2 w-50 text-xs">
        <div class="flex flex-col-reverse gap-1">
            <InputNumber id="startH" v-model="startHour" inputId="integeronly" fluid size="small" placeholder="Start Hour" @update:modelValue="onStartUpdate"/>
            <label for="startH">Start hour</label>
        </div>
        <div class="flex flex-col-reverse gap-1">
            <InputNumber id="endH" v-model="endHour" inputId="integeronly" fluid size="small" placeholder="End Hour" @update:modelValue="onEndUpdate"/>
            <label for="endH">End hour</label>
        </div>
        
    </div>
</template>