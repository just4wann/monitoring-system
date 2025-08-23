import type MewtocolClient from '@/lib/index.js';
import Oven from '@/model/oven.model.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';
import type { OvenType } from '@/types/index.js';

export default class OvenTemperatureService {
  constructor() {}

  static async add(plcOven: MewtocolClient, ovenType: OvenType): Promise<void> {
    const ovenIds = await Oven.findAll({
        attributes: ['id'],
        where: { ovenType }
    })

    switch (ovenType) {
        case 'mangan':
            await plcOven.ReadDataMemory(1, 'D', 200, 219);
        case 'bobin':
            await plcOven.ReadDataMemory(1, 'D', 200, 219);
        case 'bubuk':
            await plcOven.ReadDataMemory(1, 'D', 200, 219);
    }
    const temperatureData: number[] = plcOven.getData();
    if (ovenIds.length !== temperatureData.length || temperatureData.length === 0) return;

    for (let i = 0; i < temperatureData.length; i++) {
        await OvenTemperature.create({
            ovenId: ovenIds[i].id,
            temperature: temperatureData[i]
        })
    }
  }
}
