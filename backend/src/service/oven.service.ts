import type { Express } from 'express';
import { EnumOvenType, OvenType, ResponseBody } from '@/types/index.js';

import Oven from '@/model/oven.model.js';
import { Op } from 'sequelize';

export default class OvenService {
  constructor(private readonly app: Express) {}

  async add(ovenType: OvenType, ovenNo: number): Promise<ResponseBody<Oven> | undefined> {
    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      return;
    }

    const isOvenNoExist = await Oven.findOne({
      where: {
        [Op.and]: [ { ovenNo }, { ovenType } ],
      },
    });

    if (isOvenNoExist) {
        console.error('no oven exist');
        return;
    }

    const oven: Oven = await Oven.create({
        ovenType: ovenType,
        ovenNo: ovenNo
    })

    return {
        statusCode: 200,
        message: 'OK',
        data: oven
    }

  }
}
