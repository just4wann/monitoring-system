import type MewtocolClient from '@/lib/mewtocol_client/index.js';
import Oven from '@/model/oven.model.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';
import type { OvenType } from '@/types/index.js';
import { websocketGateway } from '@/index.js';

export default class OvenTemperatureService {
  constructor(private readonly plc: MewtocolClient) {}

   public async setTemperature(ovenType: OvenType): Promise<void> {
    const ovenIds = await Oven.findAll({
        attributes: ['id'],
        where: { ovenType },
        order: ['id']
    })

    switch (ovenType) {
        case 'mangan':
            try {
                await this.plc.ReadDataMemory(1, 'D', 200, 219);
            } catch (error) {
                websocketGateway.emitPayload<unknown>('plc_mangan/error', error)
                console.error('Error Service Side: ', error)
                return;
            }
        break;
        case 'bobin':
            try {
                await this.plc.ReadDataMemory(1, 'D', 501, 508);
            } catch (error) {
                websocketGateway.emitPayload<unknown>('plc_bobin/error', error)
                console.error('Error Service Side: ', error)
                return;
            }
        break;
        case 'bubuk':
            try {
                await this.plc.ReadDataMemory(1, 'D', 500, 513);
            } catch (error) {
                websocketGateway.emitPayload<unknown>('plc_bubuk/error', error)
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
    const listTemperatureData = temperatureData.map((val, i) => ({
        ovenId: ovenIds[i].id,
        temperature: val
    }))

    await OvenTemperature.bulkCreate(listTemperatureData, {
        validate: true
    })
  }
}