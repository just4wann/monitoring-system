import { EnumOvenType, OvenType, ResponseBody } from '@/types/index.js';

import Oven from '@/model/oven.model.js';
import { Op } from 'sequelize';
import ResponseError from '@/error/index.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';

export default class OvenService {
  constructor() {}

  static async add(ovenType: OvenType, ovenNo: number): Promise<ResponseBody<Oven>> {
    if (!ovenType || !ovenNo) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }

    const isOvenNoExist = await Oven.findOne({
      where: {
        [Op.and]: [{ ovenNo }, { ovenType }],
      },
    });

    if (isOvenNoExist) {
      console.error('no oven exist');
      throw new ResponseError(404, 'oven no not found');
    }

    const oven: Oven = await Oven.create({
      ovenType: ovenType,
      ovenNo: ovenNo,
    });

    return {
      statusCode: 200,
      message: 'OK',
      data: oven,
    };
  }

  static async getTemperatureReport(ovenType?: OvenType, ovenNo?: string, startDay?: string, endDay?: string, startHour: string = '00', endHour: string = '23', conditional?: string): Promise<ResponseBody<OvenTemperature[] | null>> {
    if (!ovenType || !ovenNo || !startDay || !endDay) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }

    const ovenId: Oven | null = await Oven.findOne({
      where: {
        [Op.and] : [{ ovenType }, { ovenNo }]
      },
      attributes: ['id']
    })

    if (!ovenId) throw new ResponseError(404, 'Oven not found')
    
    if (startDay == endDay) {
      if (parseInt(startHour) > parseInt(endHour)) throw new ResponseError(400, 'Start hour can`t be greater than end hour')
    }

    let start: string = `${startDay}T${startHour}:00:00`;
    let end: string = `${endDay}T${endHour}:59:59`;

    const ovenData: OvenTemperature[] | null = await OvenTemperature.findAll({
      where: {
        ovenId: ovenId.id,
        createdAt: {
          [Op.between]: [
            new Date(start),
            new Date(end)
          ]
        }
      },
      attributes: ['temperature', 'createdAt'],
      include: {
        model: Oven,
        as: 'oven',
        attributes: ['ovenType', 'ovenNo']
      },
      order: [
        ['createdAt', 'ASC']
      ]
    });

    if (!ovenData) throw new ResponseError(404, 'oven not found');

    return {
      statusCode: 200,
      message: 'OK',
      data: ovenData,
    };
  }

  static async getTemperatureMonitoring(ovenType?: OvenType): Promise<ResponseBody<Oven[]>> {
    if (!ovenType) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }

    const ovenData: Oven[] = await Oven.findAll({
      where: {
        ovenType,
      },
      attributes: ['id', 'ovenType', 'ovenNo'],
      include: [
        {
          attributes: ['temperature', 'createdAt'],
          model: OvenTemperature,
          as: 'temperatures',
          separate: true,
          order: [[
            'createdAt', 'DESC'
          ]],
          limit: 20
        },
      ],
      order: ['id']
    });

    return {
      statusCode: 200,
      message: 'OK',
      data: ovenData,
    };
  }
}