<script lang="ts" setup>
interface CurrentTemperatureProps {
    temperature: string;
}
defineProps<CurrentTemperatureProps>();
</script>

<template>
    <h1 class="flex items-end">
        <p class="text-4xl">{{ temperature }}</p>
        <span class="text-slate-400">°C</span>
    </h1>
</template>