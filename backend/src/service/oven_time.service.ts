import Oven from "@/model/oven.model.js";
import OvenTemperature from "@/model/oven_temperatures.model.js";
import OvenTime from "@/model/oven_time.model.js";
import { OvenType } from "@/types/index.js";
import OvenStatus from "@/utils/oven_status.js";
import OvenTimerClass from "@/utils/oven_timer.js";

export default class OvenTimeService {
    private ovenTimer: OvenTimerClass;
    private ovenStatus: OvenStatus;
    constructor(private readonly ovenType: OvenType) {
        this.ovenTimer = new OvenTimerClass()
        this.ovenStatus = new OvenStatus()
    }
 
    public async calculateOvenTimer(): Promise<void> {
        const ovenData = await Oven.findAll({
            where: { 
                ovenType: this.ovenType 
            },
            attributes: ['id', 'ovenType', 'ovenNo', 'ovenTargetTemperature'],
            include: [
                {
                    attributes: ['temperature', 'createdAt'],
                    model: OvenTemperature,
                    as: 'temperatures',
                    separate: true,
                    order: [[
                        'createdAt', 'DESC'
                    ]],
                    limit: 5
                },
            ],
            order: ['id']
        })
        for (let i = 0; i < ovenData.length; i++) {
            const runningDuration = await this.ovenTimer.calculateRunningDuration(ovenData[i].id, ovenData[i], ovenData[i].ovenTargetTemperature);
            const peakDuration = await this.ovenTimer.calculatePeakDuration(ovenData[i].id, ovenData[i], ovenData[i].ovenTargetTemperature);

            const [ label, severity ] = this.ovenStatus.setStatus(peakDuration, runningDuration);

            await OvenTime.update({ 
                runningDuration, 
                peakDuration,
                severityStatus: severity,
                labelStatus: label
            }, {
                where: {
                    ovenId: ovenData[i].id
                }
            })
        }
    }
}