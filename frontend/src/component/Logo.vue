<script setup lang="ts">
interface LogoProps {
    size: number;
}

defineProps<LogoProps>();
</script>
<template>
    <img src="../assets/logo/images.png" alt="Company logo" :width="size" loading="lazy" />
</template>