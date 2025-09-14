<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui';

const toasterProps: ToasterProps = {
    position: 'bottom-right'
}
</script>

<template>
    <UApp :toaster="toasterProps">
        <RouterView></RouterView>
    </UApp>
</template>