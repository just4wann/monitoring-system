import { reactive } from "vue";
import type { IOvenDurationResponseType, IOvenJudgement, IOvenTemperatureResponseType } from "../types";

interface Store {
    temperatureOvenMangan: IOvenTemperatureResponseType[] | [];
    temperatureOvenBobin: IOvenTemperatureResponseType[] | [];
    temperatureOvenBubuk: IOvenTemperatureResponseType[] | [];
    ovenManganDuration: IOvenDurationResponseType[] | [];
    ovenBobinDuration: IOvenDurationResponseType[] | [];
    ovenBubukDuration: IOvenDurationResponseType[] | [];
    ovenJudgements: IOvenJudgement[] | [];
    ovenStatus: [string, string][] | []
    notifications: string[];
}

export const store: Store = reactive({
    temperatureOvenMangan: [],
    temperatureOvenBobin: [],
    temperatureOvenBubuk: [],
    ovenManganDuration: [],
    ovenBobinDuration: [],
    ovenBubukDuration: [],
    ovenJudgements: [],
    ovenStatus: [],
    notifications: []
});

export const clearNotification = () => {
    store.notifications = []
}