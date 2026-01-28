<script lang="ts" setup>
interface OvenStatusProps {
    severity: string
    label: string
}

defineProps<OvenStatusProps>()
</script>

<template>
    <div class="flex gap-1 items-center text-xs">
        <i class="pi pi-tag" style="font-size: 0.8rem"/>
        <p>Status : </p>
        <Badge :value="label" :severity="severity" size="small"/>
    </div>
</template>