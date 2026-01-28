<script lang="ts" setup>
interface OvenTimeInfoProps {
    startPeak: string;
    finishPeak: string;
    overall: string;
}

defineProps<OvenTimeInfoProps>()
</script>

<template>
    <div class="flex flex-col gap-2 items-center text-slate-600">
        <div class="flex flex-col-reverse">
            <IconField>
            <InputIcon class="pi pi-clock" />
            <InputText id="start" :modelValue="startPeak ?? '10/20/2025 10.00'" disabled size="small"/>
            </IconField>
            <label for="start">Start Peak Temperature</label>
        </div>
        <div class="flex flex-col-reverse">
            <IconField>
            <InputIcon class="pi pi-clock" />
            <InputText id="finish" :modelValue="finishPeak ?? '10/20/2025 10.00'" disabled size="small"/>
            </IconField>
            <label for="finish">Finish Peak Temperature</label>
        </div>
        <div class="flex flex-col-reverse">
            <IconField>
                <InputIcon class="pi pi-clock" />
                <InputText id="all" :modelValue="overall ?? '7 hour 10 minute'" disabled size="small"/>
            </IconField>
            <label for="all">Overall Time</label>
        </div>
    </div>
</template>