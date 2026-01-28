<script lang="ts" setup>
interface SubmitButtonEmits {
    submit: [];
}
const emits = defineEmits<SubmitButtonEmits>()

const onClicked = () => {
    emits('submit')
}
</script>

<template>
    <div class="flex justify-end">
        <Button label="Show record" icon="pi pi-chart-line"  size="small" severity="secondary" @click="onClicked" class="hover:cursor-pointer"/>
    </div>
</template>