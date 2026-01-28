<script lang="ts" setup>
import { ref, watch } from 'vue';
import { selectItems } from '../../constant';

interface OvenSelectType {
    name: string;
    code: string;
}

interface OvenSelectDashboardEmits {
    select: [oven: string];
    show: [val: boolean];
}

const emits = defineEmits<OvenSelectDashboardEmits>();

const selectedItems = ref<OvenSelectType>({
  name: 'Mangan',
  code: 'mn'
});

const showSideBar = ref<boolean>(false)

watch(selectedItems, (newVal, _oldVal) => {
  emits('select', newVal.name);
})

watch(showSideBar, (newVal, _oldVal) => {
    emits('show', newVal);
})
</script>

<template>
    <main class="flex items-center justify-between mb-4">
        <h2 class="pnsc-light text-md">Oven {{ selectedItems.name }}</h2>
        <div class="flex items-center gap-5">
            <ToggleButton v-model="showSideBar" onLabel="Dashboard View Only" offLabel="Dashboard View Only" size="small"/>
            <div class="flex gap-2">
                <Select v-model="selectedItems" size="small" :options="selectItems" optionLabel="name" placeholder="Select Oven" checkmark :highlightOnSelect="false" class="w-32 md:w-56"/>
            </div>
        </div>
    </main>
</template>