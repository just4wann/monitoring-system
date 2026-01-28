<script lang="ts" setup>
import { ref } from 'vue';
import { selectItems } from '../../../constant';

interface SelectOvenEmits {
    updateOven: [name: string];
}

interface ItemsReportType {
    name: string;
    code: string;
}

const emits = defineEmits<SelectOvenEmits>()

const selectedItemsReport = ref<ItemsReportType>({
  name: 'Mangan',
  code: 'mn'
});

const updateOven = (val: ItemsReportType) => {
    emits('updateOven', val.name);
}
</script>

<template>
    <main class="flex flex-col-reverse text-xs gap-1">
        <Select id="type" v-model="selectedItemsReport" size="small" :options="selectItems" optionLabel="name" placeholder="Select Oven" checkmark :highlightOnSelect="false" class="w-50 hover:cursor-pointer" @update:modelValue="updateOven"/>
        <label for="type">Select oven type</label>
    </main>
</template>