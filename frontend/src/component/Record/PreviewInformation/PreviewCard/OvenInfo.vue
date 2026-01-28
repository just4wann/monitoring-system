<script lang="ts" setup>
interface OvenInfoProps {
    ovenName: string;
    ovenNo: string;
}

defineProps<OvenInfoProps>();

const capitalize = (s: string): string => !s ? '' : s.charAt(0).toUpperCase() + s.slice(1);
</script>

<template>
    <section class="flex gap-1 -mb-6">
        <div class="flex gap-1 text-slate-600">
            <div class="flex flex-col-reverse">
                <IconField>
                    <InputIcon class="pi pi-warehouse" />
                    <InputText id="oven" :modelValue="capitalize(ovenName)" class="w-48" contenteditable="true" disabled size="small"/>
                </IconField>
                <label for="oven">Oven Name</label>
            </div>
            <div class="flex flex-col-reverse">
                <IconField>
                    <InputIcon class="pi pi-filter" />
                    <InputText id="ch" :modelValue="ovenNo" class="w-28" disabled size="small"/>
                </IconField>
                <label for="ch">Oven CH</label>
            </div>
        </div>
    </section>
</template>