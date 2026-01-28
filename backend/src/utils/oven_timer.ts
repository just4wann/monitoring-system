import OvenTime from "@/model/oven_time.model.js";

export default class OvenTimerClass {
    private finishRunning: number = Date.now();
    private finishPeak: number = Date.now();
    private ovenRunningDataUpdate!: OvenTime | null;
    private ovenPeakDataUpdate!: OvenTime | null;
    constructor() {}

    public async calculateRunningDuration(ovenId: number, valData: any, target: number): Promise<number> {
        const targetTemperature = Math.round(target * (97/100))
        const values = [
            valData.temperatures[0].temperature,
            valData.temperatures[1].temperature,
            valData.temperatures[2].temperature,
            valData.temperatures[3].temperature,
            valData.temperatures[4].temperature,
        ] as string[];

        this.ovenRunningDataUpdate = await OvenTime.findOne({
            where: { ovenId }
        })

        if (!this.ovenRunningDataUpdate) {
            console.error('no oven time')
            return -1;
        }

        const diffs = [
            parseInt(values[3]) - parseInt(values[4]),
            parseInt(values[2]) - parseInt(values[3]),
            parseInt(values[1]) - parseInt(values[2]),
            parseInt(values[0]) - parseInt(values[1])
        ];

        const isIncrease: boolean = diffs.every(d => d > 0);
        const isDecrease: boolean = diffs.every(d => d < 0);
        const stable: boolean = diffs.every(d => Math.abs(d) <= 3);

        if (parseInt(values[0]) >= targetTemperature) {
            const [_count, updated] = await OvenTime.update({
                isAlreadyPeak: true
            }, {
                where: {
                    ovenId: this.ovenRunningDataUpdate.id
                },
                returning: true
            })
            this.ovenRunningDataUpdate = updated[0]
        }

        if (isIncrease && !this.ovenRunningDataUpdate.startRunning) {
            const [_count, updated] = await OvenTime.update({
                startRunning: new Date().toISOString()
            }, {
                where: {
                    ovenId: this.ovenRunningDataUpdate.id
                },
                returning: true
            })
            this.ovenRunningDataUpdate = updated[0]
        };

        if (isDecrease && parseInt(values[0]) <= (targetTemperature * (65/100))) {
            await OvenTime.update({
                isAlreadyPeak: false,
                startRunning: null
            }, {
                where: {
                    ovenId: this.ovenRunningDataUpdate.id
                },
            })
            return -1;
        }

        if (stable && !isIncrease) {
            const avg = values.reduce((a, b) => a + parseInt(b), 0) / 5;
            if (avg >= targetTemperature && !this.ovenRunningDataUpdate.startRunning) {
                const [_count, updated] = await OvenTime.update({
                    startRunning: new Date().toISOString()
                }, {
                    where: {
                        ovenId: this.ovenRunningDataUpdate.id
                    },
                    returning: true
                })
                this.ovenRunningDataUpdate = updated[0]
            } else if (
                avg < targetTemperature &&  
                this.ovenRunningDataUpdate.startRunning && 
                parseInt(values[0]) <= (targetTemperature * (65/100))
            ) {
                await OvenTime.update({
                    startRunning: null,
                    isAlreadyPeak: false
                }, {
                    where: {
                        ovenId: this.ovenRunningDataUpdate.id
                    }
                })

                return -1;
            }
        }
        
        if (!this.ovenRunningDataUpdate.startRunning) return -1;

        const startRunningMs: number = new Date(this.ovenRunningDataUpdate.startRunning).getTime();
        this.finishRunning = Date.now();
        const diffMs = this.finishRunning - startRunningMs;
        return diffMs
    }

    public async calculatePeakDuration(ovenId: number, valData: any, target: number): Promise<number> {
        const targetTemperature = Math.round(target * (97/100))
        const values = [
            valData.temperatures[0].temperature,
            valData.temperatures[1].temperature,
            valData.temperatures[2].temperature,
            valData.temperatures[3].temperature,
            valData.temperatures[4].temperature,
        ] as string[];

        this.ovenPeakDataUpdate = await OvenTime.findOne({
            where: { ovenId }
        })

        if (!this.ovenPeakDataUpdate) {
            console.error('no oven time')
            return -1;
        }

        const diffs = [
            parseInt(values[3]) - parseInt(values[4]),
            parseInt(values[2]) - parseInt(values[3]),
            parseInt(values[1]) - parseInt(values[2]),
            parseInt(values[0]) - parseInt(values[1])
        ];

        const isDecrease: boolean = diffs.every(d => d < 0);
        const stable: boolean = diffs.every(d => Math.abs(d) <= 3);

        if (parseInt(values[0]) >= targetTemperature && !this.ovenPeakDataUpdate.startPeak) {
            const [_count, updated] = await OvenTime.update({
                startPeak: new Date().toISOString(),
                isStartingPeak: true
            }, {
                where: {
                    ovenId: this.ovenPeakDataUpdate.id
                },
                returning: true
            })

            this.ovenPeakDataUpdate = updated[0]
        }

        if (isDecrease) {
            await OvenTime.update({
                isStartingPeak: false,
                startPeak: null
            }, {
                where: {
                    ovenId: this.ovenPeakDataUpdate.id
                }
            })
            return -1;
        }

        if (stable) {
            const avg = values.reduce((a, b) => a + parseInt(b), 0) / 5;
            if (avg >= targetTemperature && !this.ovenPeakDataUpdate.startPeak) {
                const [_count, updated] = await OvenTime.update({
                    startPeak: new Date().toISOString(),
                }, {
                    where: {
                        ovenId: this.ovenPeakDataUpdate.id
                    },
                    returning: true
                })

                this.ovenPeakDataUpdate = updated[0]

            } else if (avg < targetTemperature && this.ovenPeakDataUpdate.startPeak) {
                await OvenTime.update({
                    startPeak: null,
                    isStartingPeak: false
                }, {
                    where: {
                        ovenId: this.ovenPeakDataUpdate.id
                    }
                })
                return -1;
            }
        }

        if (!this.ovenPeakDataUpdate.startPeak) return -1;

        const startPeakMs: number = new Date(this.ovenPeakDataUpdate.startPeak).getTime()
        this.finishPeak = Date.now();
        const diffMs = this.finishPeak - startPeakMs;
        return diffMs
    }
}