<script lang="ts" setup>
import { ref } from 'vue';

interface AdditionalInfoEmits {
    lotInformation: [vals?: string]
    checkDateInformation: [vals?: Date | Date[] | (Date | null)[] | null]
    qcInformation: [vals?: string]
    confirm: [vals: boolean]
}

const emits = defineEmits<AdditionalInfoEmits>()

const qcMemberValue = ref<string>('');
const dateCheckModel = ref<Date>();
const confirmation = ref<boolean>(false);

const onUpdateCheckDate = (val?: Date | Date[] | (Date | null)[] | null) => {
    emits('checkDateInformation', val)
}

const onUpdateQCInfo = (val?: string) => {
    emits('qcInformation', val);
}

const onUpdateConfirm = (val: boolean) => {
    emits('confirm', val)
}
</script>

<template>
    <aside class="flex flex-col gap-2 w-96 -mt-5 text-xs">
        <section class="flex gap-2 text-slate-600">
            <div class="flex items-center gap-2">
                <div class="flex flex-col-reverse">
                    <IconField>
                    <InputIcon class="pi pi-calendar" />
                    <DatePicker id="date" v-model="dateCheckModel" :manualInput="false" fluid placeholder="Select date" class="hover:cursor-pointer" @update:modelValue="onUpdateCheckDate" size="small"/>
                    </IconField>
                    <label for="date">Date Check</label>
                </div>
            </div>
            <div class="flex flex-col-reverse">
            <IconField>
                <InputIcon class="pi pi-user" />
                <InputText id="qc" v-model="qcMemberValue" variant="filled" placeholder="Enter QC Member" class="w-full" @update:modelValue="onUpdateQCInfo" size="small"/>
            </IconField>
            <label for="qc">PIC (QC)</label>
            </div>
        </section>
        <div class="flex items-center gap-2">
            <Checkbox id="check" v-model="confirmation" binary @update:modelValue="onUpdateConfirm" size="small"/>
            <label for="check">Are you sure all data is valid?<span class="text-red-500">*</span></label>
        </div>
    </aside>
</template>