import { generateDuration } from "./index.js";

export default class OvenStatus {
    private hasDone: boolean = false;
    constructor() {}

    public setStatus(peakTime: number, runTime: number): [string, string] {
        const pTime = generateDuration({ ms: peakTime })
        const rTime = generateDuration({ ms: runTime })
        const takeHourPeak: string = pTime.split(" ")[0];
        const takeHourRun: string = rTime.split(" ")[0];

        if (parseInt(takeHourRun) == 0 && this.hasDone) this.hasDone = false
        
        if (takeHourPeak == '---' && !this.hasDone) return ['Process', 'warn'];

        if (takeHourPeak == '---' && this.hasDone) return ['Ready', 'success'];

        if (parseInt(takeHourPeak) >= 0) {
            this.hasDone = true;
            return ['Ongoing', 'info'];
        }

        return ['Process', 'warn'];
    }
}
    