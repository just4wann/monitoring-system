<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { OVEN_CONFIG } from '../../../constant';

interface SelectMultipleEmits {
    multiSelect: [val: number[]];
}

interface SelectMultipleProps {
    ovenType: string;
}

interface OvenChannelType {
    name: number;
}

const emits = defineEmits<SelectMultipleEmits>();

const props = defineProps<SelectMultipleProps>();

const selectOvensNomor = ref<OvenChannelType[]>([]);
const selectedOvensNomor = ref<OvenChannelType[]>([]);

const onUpdateMultiple = (vals: OvenChannelType[]) => {
    const channels: number[] = []
    for (const ch of vals) {
        channels.push(ch.name);
    }
    emits('multiSelect', channels);
}

const setOvenChannelList = (oven: string): void => {
  selectedOvensNomor.value = []
  const o = OVEN_CONFIG[oven.toLowerCase()];
  if (!o) return;

  if (oven.toLocaleLowerCase() == 'mangan') {
    selectOvensNomor.value = [{ name: 21 }, { name: 22 }, { name: 23 }]
    for (let i = 3; i < o.count; i++) {
        selectOvensNomor.value.push({
            name: i + 1
        })
    }
    return;
  }
  selectOvensNomor.value = Array.from({ length: o.count }, (_, i) => {
    return {
      name: i + 1
    }
  });
}

watch(props, (newVal, _oldVal) => {
    setOvenChannelList(newVal.ovenType)
})

onMounted(() => {
    setOvenChannelList('Mangan');
})
</script>

<template>
    <main class="flex flex-col-reverse text-xs gap-1">
        <MultiSelect id="ch" v-model="selectedOvensNomor" :options="selectOvensNomor" optionLabel="name" :maxSelectedLabels="5" class="text-xs w-50" size="small" placeholder="Select ovens..." @update:modelValue="onUpdateMultiple"/>
        <label for="ch">Select oven number</label>
    </main>
</template>