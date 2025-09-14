import { reactive } from "vue";
import type { OvenResponseType } from "../types";

interface Store {
    temperatureOvenMangan: OvenResponseType[] | [];
    temperatureOvenBobin: OvenResponseType[] | [];
    temperatureOvenBubuk: OvenResponseType[] | [];
}

export const store: Store = reactive({
    temperatureOvenMangan: [],
    temperatureOvenBobin: [],
    temperatureOvenBubuk: []
});