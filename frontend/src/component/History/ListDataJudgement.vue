<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import type { IOvenJudgement } from '../../types';
import { UtilityClass } from '../../utils';
import { OvenAPI } from '../../composables';
import { store, clearNotification } from '../../store';
import { useConfirm, useToast } from 'primevue';

interface DataJudgementProps {
    department: string | null;
}

const props = defineProps<DataJudgementProps>();

const confirm = useConfirm();
const toast = useToast()

const formatStringDate = (str: string): string => {
    const strSplit = str.split(' ~ ');
    const start = strSplit[0];
    const end = strSplit[1];

    const startSplit = start.split(' ');
    const sDate = startSplit[0];
    const startTime = startSplit[1];
    const sDateSplit = sDate.split('-').reverse();
    const startDate = sDateSplit.join('/');

    const endSplit = end.split(' ');
    const eDate = endSplit[0];
    const endTime = endSplit[1];
    const eDateSplit = eDate.split('-').reverse();
    const endDate = eDateSplit.join('/');

    return `${startDate}, ${startTime} ~ ${endDate}, ${endTime}`;
}

const reverseData = (data: IOvenJudgement[]): IOvenJudgement[] => data.slice(0, data.length).reverse()

const loading = ref<boolean>(false);
const downloadBy = ref<string>('');
const showModalDownload = ref<boolean>(false);
const op = ref();
const idList = ref<number>(0);
const oven = ref<string>('');
const ch = ref<number[]>([]);
const selectedItemJudgement = ref<IOvenJudgement | null>()

const displayDownloadBy = (event: any, judgement: IOvenJudgement) => {
    op.value.hide();

    if (selectedItemJudgement.value?.id === judgement.id) {
        selectedItemJudgement.value = null
    } else {
        selectedItemJudgement.value = judgement;

        nextTick(() => {
            op.value.show(event)
        })
    }
}

const show = (itemJudgement: IOvenJudgement) => {
    showModalDownload.value = true;
    idList.value = itemJudgement.id;
    oven.value = itemJudgement.ovenType;
    ch.value = itemJudgement.channels;
}

const handleDeleteConfirmation = (index: number, event: any) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure want to delete it?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            const res = await OvenAPI.deleteJudgement({ id: index });
            if (res.data) {
                toast.add({
                    summary: 'Notification',
                    detail: `Judgment deleted`,
                    severity: 'success',
                    life: 5000
                })
            }

            store.ovenJudgements = (await OvenAPI.getJudgements()).data;
        },
        reject: () => {

        }
    })
}

const refreshList = async () => {
    store.ovenJudgements = (await OvenAPI.getJudgements()).data;
    clearNotification();
}

const propSetting = (condition: number): [string, string, string] => {
    return condition == 0 ? ['Pending', 'warn', 'hover:cursor-default'] : ['Downloaded', 'success', 'hover:cursor-pointer']
}

const handleDownloadPDF = async () => {
    loading.value = true;
    const depart = props.department == 'qc' ? 'QC' : 'Production';
    const result = await OvenAPI.getReport({ id: idList.value, prods: downloadBy.value }, oven.value, ch.value)
    if (!result) {
        loading.value = false
        return;
    }
    loading.value = false
    showModalDownload.value = false
    await OvenAPI.judgementDownload({
        judgementId: idList.value,
        downloadBy: `${downloadBy.value} - ${depart}`
    })
    downloadBy.value = ''
}

onMounted(async() => {
    if (store.notifications.length > 0) return;
    store.ovenJudgements = (await OvenAPI.getJudgements()).data;
})
</script>

<template>
    <DataTable :value="reverseData(store.ovenJudgements)" stripedRows :rows="10" size="small">
        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-md font-bold">Oven Judgement List</span>
                <OverlayBadge severity="danger" v-if="store.notifications.length > 0">
                    <Button label="Refresh" @click="refreshList" size="small" icon="pi pi-refresh" severity="secondary"/>
                </OverlayBadge>
                <Button v-else label="Refresh" @click="refreshList" size="small" icon="pi pi-refresh" severity="secondary"/>
            </div>
        </template>
        <template #empty>No data judgment found.</template>
        <template #loading>Loading data judgment...</template>
        <Column>
            <template #header>
                <p class="text-sm">No</p>
            </template>
            <template #body="slotProps">
                <p class="text-xs">{{ slotProps.index + 1 }}</p>
            </template>
        </Column>
        <Column>
            <template #header>
                <p class="text-sm">Lot Oven</p>
            </template>
            <template #body="slotProps">
                <section class="flex flex-col items-start gap-2">
                    <p v-for="(lot, i) in slotProps.data.lot" :key="i" class="text-xs">{{ lot }}</p>
                </section>
            </template>
        </Column>
        <Column field="oven">
            <template #header>
                <p class="text-sm">Oven Name</p>
            </template>
            <template #body="slotProps">
                <section class="flex flex-col items-start gap-2">
                    <p v-for="(val, i) in slotProps.data.channels" :key="i" class="text-xs">Oven {{ slotProps.data.ovenType }} {{ val }}</p>
                </section>
            </template>
        </Column>
        <Column field="rating">
            <template #header>
                <p class="text-sm">Period</p>
            </template>
            <template #body="slotProps">
                <p class="text-xs">{{ formatStringDate(slotProps.data.periode) }}</p>
            </template>
        </Column>
        <Column>
            <template #header>
                <p class="text-sm">Judgment Date</p>
            </template>
            <template #body="slotProps">
                <p class="text-xs">{{ UtilityClass.generateTimestamp(slotProps.data.createdAt)[2] }}</p>
            </template>
        </Column>
        <Column>
            <template #header>
                <p class="text-sm">Judgment</p>
            </template>
            <template #body="slotProps">
                <section class="flex flex-col items-start gap-2">
                    <Badge v-for="(val, i) in slotProps.data.judgement" size="small" :severity="val == 'OK' ? 'success' : 'danger'" :key="i">{{ val }}</Badge>
                </section>
            </template>
        </Column>
        <Column>
            <template #header>
                <p class="text-sm">Judged by</p>
            </template>
            <template #body="slotProps">
                <p class="text-xs">{{ slotProps.data.judged }}</p>
            </template>
        </Column>
        <Column v-if="department == 'prods'">
            <template #header>
                <p class="text-sm">Download</p>
            </template>
            <template #body="slotProps">
                <Button 
                    label="Download"
                    size="small" 
                    rounded 
                    icon="pi pi-download" 
                    severity="info"
                    iconPos="right" 
                    @click="show(slotProps.data)"
                />
            </template>
        </Column>
        <Column>
            <template #header>
                <p class="text-sm">Status</p>
            </template>
            <template #body="slotProps">
                <Tag
                    :value="propSetting(slotProps.data.downloads.length)[0]" 
                    rounded
                    :severity="propSetting(slotProps.data.downloads.length)[1]" 
                    :class="propSetting(slotProps.data.downloads.length)[2]"
                    @click="displayDownloadBy($event, slotProps.data)"
                    
                />
            </template>
        </Column>
        <Column v-if="department == 'qc'">
            <template #header>
                <p class="text-sm">Delete</p>
            </template>
            <template #body="slotProps">
                <Button 
                    size="small" 
                    rounded 
                    icon="pi pi-trash" 
                    severity="danger"
                    iconPos="right" 
                    @click="handleDeleteConfirmation(slotProps.data, $event)"
                />
            </template>
        </Column>
    </DataTable>
    <Dialog v-model:visible="showModalDownload" modal :style="{ width: '25.5rem' }">
        <template #header >
            <p>Who's download this file?</p>
        </template>
        <div class="flex flex-col gap-5">
            <div class="flex flex-col-reverse gap-1 text-xs">
                <IconField>
                    <InputIcon class="pi pi-user" />
                    <InputText id="pr" v-model="downloadBy" variant="filled" class="w-full" size="small"/>
                </IconField>
                <label for="pr">Name</label>
            </div>
            <div class="flex items-center gap-2 self-end">
                <Button class="ml-2" label="Cancel" size="small" type="button" @click="showModalDownload = false" severity="secondary"/>
                <Button 
                    :label="loading ? 'Downloading' : 'Download'"
                    :loading="loading"
                    size="small"
                    icon="pi pi-download" 
                    iconPos="right" 
                    @click="handleDownloadPDF"
                />
            </div>
        </div>
    </Dialog>
    <Popover ref="op">
        <section class="text-slate-600 text-xs">
            <h1 v-if="selectedItemJudgement?.downloads.length === 0">Not downloaded yet</h1>
            <div v-else class="flex flex-col">
                <h1 class="-mb-2">Downloaded By : </h1>
                <Divider/>
                <div v-for="(value, index) in selectedItemJudgement?.downloads" class="flex flex-col gap-2">
                    <p>{{ index + 1 }}. {{ value.downloadBy }} at {{ UtilityClass.generateTimestamp(value.createdAt)[2] }}</p>
                </div>
            </div>
        </section>
    </Popover>
</template>