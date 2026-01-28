<script lang="ts" setup>
interface EmptyPreviewStateProps {
    dataLength: number;
    loading: boolean;
}
defineProps<EmptyPreviewStateProps>();
</script>

<template>
    <Card v-if="dataLength === 0 && !loading" class="mt-52">
        <template #content>
            <h1 class="text-slate-600 text-xl">Preview Graph Oven</h1>
        </template>
    </Card>
</template>