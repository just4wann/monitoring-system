<script lang="ts" setup>
import { ref } from 'vue';
import { selectTemperatureTarget } from '../../../constant';

interface SelectTemperatureTargetEmits {
    target: [val: number]
}

interface TemperatureTargetType {
    label: string;
    value: number;
}

const emits = defineEmits<SelectTemperatureTargetEmits>()

const selectedTemperatureTarget = ref<TemperatureTargetType | undefined>();

const onUpdateSelectTemperature = (val: TemperatureTargetType) => {
    emits('target', val.value);
}
</script>

<template>
    <main class="flex flex-col-reverse text-xs gap-1">
        <Select v-model="selectedTemperatureTarget" size="small" :options="selectTemperatureTarget" optionLabel="label" checkmark :highlightOnSelect="false" optionGroupLabel="label" optionGroupChildren="items" placeholder="Select temperature" class="w-50" @update:modelValue="onUpdateSelectTemperature">
            <template #optiongroup="slotProps">
                <div>{{ slotProps.option.label }}</div>
            </template>
        </Select>
        <label for="target">Select temperature target</label>
    </main>
</template>