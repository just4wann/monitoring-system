import type MewtocolClient from '@/lib/index.js';
import Oven from '@/model/oven.model.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';
import type { OvenType } from '@/types/index.js';

export default class OvenTemperatureService {
  constructor(private readonly plc: MewtocolClient) {}

   public async setTemperature(ovenType: OvenType): Promise<void> {
    const ovenIds = await Oven.findAll({
        attributes: ['id'],
        where: { ovenType }
    })

    switch (ovenType) {
        case 'mangan':
            try {
                await this.plc.ReadDataMemory(1, 'D', 200, 219);
            } catch (error) {
                console.error('Error Service Side: ', error)
                return;
            }
        break;
        case 'bobin':
            try {
                await this.plc.ReadDataMemory(1, 'D', 501, 508);
            } catch (error) {
                console.error('Error Service Side: ', error)
                return;
            }
        break;
        case 'bubuk':
            try {
                await this.plc.ReadDataMemory(1, 'D', 500, 513);
            } catch (error) {
                console.error('Error Service Side: ', error);
                return;
            }
        break;
    }
    const temperatureData: number[] = this.plc.getData();
    if (ovenIds.length !== temperatureData.length || temperatureData.length === 0) {
        console.error('data oven overflow');
        return;
    };

    for (let i = 0; i < temperatureData.length; i++) {
        await OvenTemperature.create({
            ovenId: ovenIds[i].id,
            temperature: temperatureData[i]
        })
    }
  }
}