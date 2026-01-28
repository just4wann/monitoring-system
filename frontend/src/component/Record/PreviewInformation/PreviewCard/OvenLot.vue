<script setup lang="ts">
import { ref, watch } from 'vue';

interface OvenLotProps {
    modelValue?: string;
}

const emits = defineEmits(['update:modelValue'])
defineProps<OvenLotProps>();

const lotOvenValue = ref<string>();

watch(lotOvenValue, (newVal, _oldVal) => {
    emits('update:modelValue', newVal);
})
</script>

<template>
    <div class="flex flex-col-reverse">
        <IconField>
        <InputIcon class="pi pi-hashtag" />
        <InputText id="lot" v-model="lotOvenValue" variant="filled" placeholder="Enter Lot Oven" class="w-full" size="small"/>
        </IconField>
        <label for="lot">Lot Oven</label>
    </div>
</template>