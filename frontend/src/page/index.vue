<script setup lang="ts">

// ========================= Libraries Import =========================

import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue';
import { OvenAPI, UserAPI } from '../composables';
import type { IOvenTemperatureResponseType, IOvenDurationResponseType, ITemperatureFTPResponseType, IOvenJudgementParameter } from '../types';
import { UtilityClass } from '../utils';
import { store } from '../store';
import { useRouter } from 'vue-router';

// ========================= UI Component Import =========================

import OvenSelectDashboard from '../component/Dashboard/OvenSelectDashboard.vue';
import OvenSkeletonCardDashboard from '../component/Dashboard/OvenSkeletonCardDashboard.vue';
import OvenCard from '../component/Dashboard/OvenCard/index.vue';
import FormRecord from '../component/Record/FormRecord/index.vue';
import GraphRecord from '../component/Record/GraphRecord/index.vue';
import PreviewInformation from '../component/Record/PreviewInformation/index.vue'
import ListDataJudgement from '../component/History/ListDataJudgement.vue';
import RoleInfo from '../component/Profile/RoleInfo.vue';
import Logo from '../component/Logo.vue';
import Navigation from '../component/Navigation.vue';
import DeveloperCredit from '../component/DeveloperCredit.vue';
import HeaderAndTime from '../component/HeaderAndTime.vue';
import { useWebsocketNotification } from '../composables/websocket';

// ========================= Variables =========================

const router = useRouter();
const toast = useToast();
const judgementValue = ref<string[]>([]);
const selectedOvenReport = ref<string>('Mangan');
const lotOvenValue = ref<string[]>([]);
const startPeakValue = ref<string[]>([]);
const finishPeakValue = ref<string[]>([]);
const overallPeakValue = ref<string[]>([]);
const qcMemberValue = ref<string>('');
const confirmation = ref<boolean>(false);
const temperatureReportData = ref<ITemperatureFTPResponseType[]>([]);
const showGraph = ref<boolean>(false);
const graphAreas = ref<HTMLElement[]>([]);
const selectedItems = ref<string>('Mangan');
const selectedItemsReport = ref<string>('Mangan');
const showModal = ref<boolean>(false);
const selectedTemperatureTarget = ref<number>();
const temperaturesTarget = ref<number[]>([])
const startHour = ref<number>();
const endHour = ref<number>();
const pageIndication = ref<string>('Dashboard');
const temperatureMonitoringData = ref<IOvenTemperatureResponseType[] | []>([]);
const durationData = ref<IOvenDurationResponseType[] | []>([]);
const selectedOvensNomor = ref<number[]>([]);
const waitingData = ref<boolean>(true);
const waitGenerateGraph = ref<boolean>(false);
const role = ref<string | null>(null);
const dateModel = ref<Date[]>();
const dateCheckModel = ref<Date>();
const getGraphEl = ref<boolean>(false)
const showSideBar = ref<boolean>(false)

// ========================= Utility functions =========================

function checkingOvenType(oven: string) {
  switch (oven.toLowerCase()) {
    case 'mangan':
      temperatureMonitoringData.value = store.temperatureOvenMangan;
      durationData.value = store.ovenManganDuration;
    break;
    case 'bobin':
      temperatureMonitoringData.value = store.temperatureOvenBobin;
      durationData.value = store.ovenBobinDuration;
    break;
    case 'bubuk':
      temperatureMonitoringData.value = store.temperatureOvenBubuk;
      durationData.value = store.ovenBubukDuration;
    break;
  }
}

const handleSignOut = () => {
  localStorage.removeItem('token');
  router.push('/login')
}

const trgGraphEl = () => {
  graphAreas.value = [];
  showModal.value = true;
  getGraphEl.value = !getGraphEl.value;
}

// ===================== Handle User Authorization =================

const handleUserAuthorization = async(): Promise<string> => {
  if (localStorage.getItem('token') == 'guest') return 'guest'
  const isLoggedin = await UserAPI.userCheck();
  if (!isLoggedin.data.loggedIn) router.push('/login');
  if (isLoggedin.data.roles == null) return 'guest';
  return isLoggedin.data.roles;
}

// ========================= Handle Report =========================

const handleSetJudgment = async (): Promise<void> => {
  const removeDuplicate = [...new Set(graphAreas.value)]
  if (removeDuplicate.length == 0 || removeDuplicate.length > 5) return;

  const graphBuffers: string[] = await UtilityClass.getGraphBuffer(removeDuplicate)

  if (graphBuffers.length < 1) return;

  const startDay = UtilityClass.generateDayFormat(dateModel.value![0]);
  const endDay = UtilityClass.generateDayFormat(dateModel.value![1]);

  const { startH, endH } = UtilityClass.getTimeRange(startHour.value, endHour.value)

  const param: IOvenJudgementParameter = { 
    buffers: graphBuffers,
    ovenType: selectedOvenReport.value,
    channels: selectedOvensNomor.value,
    lot: lotOvenValue.value,
    tempTarget: temperaturesTarget.value,
    tempMaxStart: startPeakValue.value,
    tempMaxEnd: finishPeakValue.value,
    tempMaxTime: overallPeakValue.value,
    periode: `${startDay} ${startH}.00 ~ ${endDay} ${endH}.00`,
    judgement: judgementValue.value,
    judged: qcMemberValue.value,
  }

  const setJudgement = await OvenAPI.setJudgement(param)
  if (setJudgement.statusCode !== 200) {
    toast.add({
      summary: 'Error',
      detail: 'Create Judgement Failed',
      severity: 'error',
      life: 3000
    })
    return;
  }
  showModal.value = false
  toast.add({
    summary: 'Success',
    detail: 'Create Judgement Completed',
    severity: 'success',
    life: 3000
  })
}

// ========================= Handle Graph Generation =========================

const handleGetTemperatureRecord = async () => {
  if (selectedOvensNomor.value.length > 5) {
    toast.add({
      severity: 'info',
      summary: 'Oopss',
      detail: 'Maximal Selected Oven is 5',
      life: 3000
    })
    return;
  }

  const startDay = UtilityClass.generateDayFormat(dateModel.value![0]);
  const endDay = UtilityClass.generateDayFormat(dateModel.value![1]);

  const { startH, endH } = UtilityClass.getTimeRange(startHour.value, endHour.value)

  showGraph.value = false;
  waitGenerateGraph.value = true;

  const { data } = await OvenAPI.getTemperatureByPeriodeFTP(
    selectedItemsReport.value.toLowerCase(), 
    selectedOvensNomor.value, 
    startDay, 
    endDay, 
    startH, 
    endH
  );

  if (!data || data.length === 0) {
    toast.add({
      summary: 'Failed get Data',
      detail: 'Temperature Data Unavailable',
      severity: 'error',
      life: 3000
    })
    showGraph.value = false;
    waitGenerateGraph.value = false;
    return;
  };

  const { data: targets } = await OvenAPI.getTemperatureTarget(selectedItemsReport.value.toLowerCase(), selectedOvensNomor.value)
  
  temperaturesTarget.value = targets
  temperatureReportData.value = data;
  showGraph.value = true;
  waitGenerateGraph.value = false;

  overallPeakValue.value = [];
  startPeakValue.value = [];
  finishPeakValue.value = [];
  judgementValue.value = [];

  for (let i = 0; i < data.length; i++) {
    const [startPeak, finishPeak] = UtilityClass.getStartFinishPeak(data[i].values, targets[i]);
    overallPeakValue.value.push(UtilityClass.getOverallPeakTime(startPeak, finishPeak));
    startPeakValue.value.push(UtilityClass.generateTimestamp(startPeak)[2]);
    finishPeakValue.value.push(UtilityClass.generateTimestamp(finishPeak)[2]);
    judgementValue.value.push(UtilityClass.getOvenAutoJudgment(startPeak, finishPeak));
  }
}

// ========================= Auto Update (Interval) =========================

const intervalId = setInterval(async () => {
  const [manganResult, bobinResult, bubukResult] = await Promise.all([
    OvenAPI.getLatestTemperature('mangan', store.temperatureOvenMangan),
    OvenAPI.getLatestTemperature('bobin', store.temperatureOvenBobin),
    OvenAPI.getLatestTemperature('bubuk', store.temperatureOvenBubuk)
  ])

  const [manganDuration, bobinDuration, bubukDuration] = await Promise.all([
    OvenAPI.getOvenDuration('mangan'),
    OvenAPI.getOvenDuration('bobin'),
    OvenAPI.getOvenDuration('bubuk')
  ])

  if (
    !manganResult || 
    !bobinResult || 
    !bubukResult || 
    manganDuration.data.length === 0 || 
    bobinDuration.data.length === 0 || 
    bubukDuration.data.length === 0
  ) {
    toast.add({
      summary: 'Error',
      detail: 'Get Data Failed',
      severity: 'error',
      life: 3000
    })
    return;
  }

  Object.assign(store, {
    ovenManganDuration: manganDuration.data,
    ovenBobinDuration: bobinDuration.data,
    ovenBubukDuration: bubukDuration.data
  })

  checkingOvenType(selectedItems.value);
}, 60000);

onUnmounted(() => clearInterval(intervalId))

// ========================= onMounted Initialization =========================

onBeforeMount(async () => {
  role.value = await handleUserAuthorization();
  useWebsocketNotification(toast, role.value);
})

onMounted(async () => {
  dateModel.value = [new Date(), new Date()];

  const [manganData, bobinData, bubukData] = await Promise.all([
    OvenAPI.getOvenByType('mangan'),
    OvenAPI.getOvenByType('bobin'),
    OvenAPI.getOvenByType('bubuk')
  ]);

  const [manganDuration, bobinDuration, bubukDuration] = await Promise.all([
    OvenAPI.getOvenDuration('mangan'),
    OvenAPI.getOvenDuration('bobin'),
    OvenAPI.getOvenDuration('bubuk')
  ])

  if (
    manganData.data.length === 0 || 
    bobinData.data.length === 0 || 
    bubukData.data.length === 0 || 
    manganDuration.data.length === 0 || 
    bobinDuration.data.length === 0 || 
    bubukDuration.data.length === 0
  ) {
    waitingData.value = false;
    toast.add({
      summary: 'Error',
      detail: 'Internal Server Error',
      severity: 'error',
      life: 3000
    })
    return;
  }

  waitingData.value = false;

  Object.assign(store, {
    temperatureOvenMangan: manganData.data,
    temperatureOvenBobin: bobinData.data,
    temperatureOvenBubuk: bubukData.data,
    ovenManganDuration: manganDuration.data,
    ovenBobinDuration: bobinDuration.data,
    ovenBubukDuration: bubukDuration.data
  })
  checkingOvenType(selectedItems.value);
});

// ========================= Handle Emits Function =========================

const handleOvenSelectEmits = (oven: string) => {
  selectedItems.value = oven;
  checkingOvenType(oven);
}

const handlePeriodeEmits = (vals: Date[]) => {
  dateModel.value = vals;
}

const handleStartTimeEmits = (vals: number) => {
  startHour.value = vals;
}

const handleEndTimeEmits = (vals: number) => {
  endHour.value = vals;
}

const handleUpdateOvenEmits = (vals: string) => {
  selectedItemsReport.value = vals;
  selectedOvenReport.value = vals;
}

const handleMultiSelectEmits = (vals: number[]) => {
  selectedOvensNomor.value = vals;
}

const handleTargetTemperatureEmits = (vals: number) => {
  selectedTemperatureTarget.value = vals
}

const handleButtonEmits = () => {
  handleGetTemperatureRecord()
}

const handleLotEmit = (val: string[]) => {
  lotOvenValue.value = val;
}

const handleCheckDateEmit = (val?: Date | Date[] | (Date | null)[] | null) => {
  dateCheckModel.value = val as Date;
}

const handleQCInfoEmit = (val?: string) => {
  qcMemberValue.value = val as string;
}

const handleConfirmEmit = (val: boolean) => {
  confirmation.value = val;
}

const handleGraphElEmit = (val: HTMLElement | null) => {
  if (val === null) return;
  graphAreas.value.push(val);
}

const handleShowSidebar = (val: boolean) => {
  showSideBar.value = val
}

const handlePageIndicationEmit = (val: string) => {
  pageIndication.value = val
}
</script>
<template>
  <main class="relative flex h-screen pnsc-light">
    <aside v-if="!showSideBar" class="flex flex-col justify-between text-slate-700 py-6 pnsc-light w-[12rem] min-w-[12.5rem] h-screen">
      <div class="flex flex-col items-center gap-6">
        <Logo :size="100"/>
        <Navigation @page="handlePageIndicationEmit"/>
      </div>
      <DeveloperCredit/>
    </aside>
    <Card class="w-full overflow-y-auto">
      <template #header>
        <HeaderAndTime :viewLogo="showSideBar"/>
      </template>
      <template #content>
          <main class="relative">
            <!-- DASHBOARD -->
            <Transition>
              <section v-if="pageIndication === 'Dashboard'" class="py-6 absolute w-full">
                <OvenSelectDashboard @select="handleOvenSelectEmits" @show="handleShowSidebar"/>
                <div>
                  <OvenSkeletonCardDashboard v-if="waitingData" :count="20"/>
                  <OvenCard v-else 
                    :temperatureData="temperatureMonitoringData"
                    :durationData="durationData"
                    :ovenName="selectedItems"
                    :dashboardView="showSideBar"
                    :role="role"
                  />
                </div>
              </section>
            </Transition>
            
            <!-- RECORD -->
             <Transition>
               <section v-if="pageIndication === 'Record'" class=" absolute w-full">
                 <div v-if="role == 'guest'">Prohibitted</div>
                 <div v-else class="flex flex-col items-center justify-between">
                    <FormRecord
                      @dayPeriode="handlePeriodeEmits"
                      @startTime="handleStartTimeEmits"
                      @endTime="handleEndTimeEmits"
                      @ovenType="handleUpdateOvenEmits"
                      @ovenChannels="handleMultiSelectEmits"
                      @targetTemperature="handleTargetTemperatureEmits"
                      @submit="handleButtonEmits"
                    />
                   <main class="flex flex-col gap-4 w-fit mt-5">
                    <GraphRecord
                      :data="temperatureReportData"
                      :isComplete="waitGenerateGraph"
                      :isPreviewComplete="showGraph"
                      :ovenType="selectedItemsReport"
                      :getGraphEl="getGraphEl"
                      @graphEl="handleGraphElEmit"
                    />

                    <Button label="Preview" icon="pi pi-search" class="mb-8 self-end hover:cursor-pointer" severity="secondary" size="small" v-if="showGraph" @click="trgGraphEl"/>

                    <Dialog v-model:visible="showModal" modal :style="{ width: '100%' }">
                      <template #header>
                        <h1>Data Information Preview</h1>
                      </template>
                      <PreviewInformation 
                        :data="temperatureReportData"
                        :startTime="startPeakValue"
                        :finishTime="finishPeakValue"
                        :overallTime="overallPeakValue"
                        :temperatureLabel="temperaturesTarget"
                        :role="role"
                        :judgements="judgementValue"
                        @lot="handleLotEmit"
                        @check="handleCheckDateEmit"
                        @qc="handleQCInfoEmit"
                        @confirm="handleConfirmEmit"
                      />
                      <div class="flex justify-end gap-2">
                        <Button type="button" label="Close" size="small" severity="secondary" @click="showModal = false"></Button>
                        <Button v-if="role === 'qc'" type="button" size="small" icon="pi pi-plus" label="Create Judgement" @click="handleSetJudgment" :disabled="!confirmation"></Button>
                      </div>
                    </Dialog>
                   </main>
                 </div>
               </section>
             </Transition>

             <!-- JUDGEMENTS -->
             <Transition>
                <section v-if="pageIndication === 'Judgements'" class="pb-20 absolute w-full">
                  <div v-if="role == 'guest'">Prohibitted</div>
                  <ListDataJudgement v-else :department="role"/>
                </section>
             </Transition>

             <!-- PROFILE -->
              <Transition>
                <section v-if="pageIndication === 'Profile'" class="px-6 absolute w-full">
                  <div class="flex items-center justify-between">
                    <h1 class="text-md">Profile Role</h1>
                    <Button v-if="role == 'guest'" rounded severity="info" size="small" @click="handleSignOut">Sign In</Button>
                    <Button v-else rounded severity="danger" size="small" @click="handleSignOut">Sign Out</Button>
                  </div>
                    <div class="flex flex-col items-center justify-center gap-2">
                      <RoleInfo :role="role"/>
                    </div>
                </section>
              </Transition>
          </main>
      </template>
    </Card>
    <Toast/>
    <ConfirmPopup></ConfirmPopup>
  </main>
</template>

<style scoped>
.v-enter-active {
  transition: opacity .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>