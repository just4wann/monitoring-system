import { EnumOvenType, OvenType, ResponseBody } from '@/types/index.js';

import Oven from '@/model/oven.model.js';
import { Op } from 'sequelize';
import ResponseError from '@/error/index.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';

export default class OvenService {
  constructor() {}

  static async add(ovenType: OvenType, ovenNo: number): Promise<ResponseBody<Oven> | undefined> {
    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid')
    }

    const isOvenNoExist = await Oven.findOne({
      where: {
        [Op.and]: [ { ovenNo }, { ovenType } ],
      },
    });

    if (isOvenNoExist) {
        console.error('no oven exist');
        throw new ResponseError(404, 'oven no not found')
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

  static async get(ovenType: OvenType, ovenNo: number): Promise<ResponseBody<Oven | null>> {
    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid')
    }

    const ovenData: Oven | null = await Oven.findOne({
      where: {
        [Op.and]: [
          { ovenType },
          { ovenNo }
        ]
      },
      include: [
        {
          attributes: ['temperature', 'createdAt'],
          model: OvenTemperature
        }
      ],
      order: ["createdAt"]
    });

    if (!ovenData) throw new ResponseError(404, 'oven not found');

    return {
      statusCode: 200,
      message: 'OK',
      data: ovenData
    }
  }

  static async getAll(ovenType: OvenType): Promise<ResponseBody<Oven[]>> {
    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid')
    }

    const ovenData: Oven[] = await Oven.findAll({
      where: {
        ovenType
      },
      include: [
        {
          attributes: ['temperature', 'createdAt'],
          model: OvenTemperature
        }
      ],
      order: ["createdAt"]
    });

    return {
      statusCode: 200,
      message: 'OK',
      data: ovenData
    }
  }
}
