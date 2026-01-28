<script lang="ts" setup>
import { ref, watch } from 'vue';

interface OvenJudgementProps {
    modelValue?: string;
    judgementResult: string
}

const emits = defineEmits(['update:modelValue'])
defineProps<OvenJudgementProps>();

const judgementValue = ref<string>();

watch(judgementValue, (newVal, _oldVal) => {
    emits('update:modelValue', newVal);
})

</script>

<template>
    <div class="flex items-center flex-wrap gap-2 border px-4 py-2 rounded-md bg-slate-600">
        <h1 class="text-slate-100 text-md">Judgment Result : </h1>
        <Badge :severity="judgementResult == 'OK' ? 'success' : 'danger'" size="small">{{ judgementResult }}</Badge>
    </div>
</template>