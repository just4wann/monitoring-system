<script lang="ts" setup>
interface OvenTitleProps {
    ovenNo: number;
    ovenName: string;
}
defineProps<OvenTitleProps>();
</script>

<template>
    <div class="flex gap-2 items-center">
        <i class="pi pi-warehouse" style="font-size: 0.9rem;"/>
        <h1 class="text-sm pnsc-light">Oven {{ ovenNo }} {{ ovenName }}</h1>
    </div>
</template>