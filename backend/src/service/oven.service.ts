import { EnumOvenType, ListFTPType, OvenType, ResponseBody } from '@/types/index.js';
import Oven from '@/model/oven.model.js';
import { Op } from 'sequelize';
import ResponseError from '@/error/index.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';
import OvenTime from '@/model/oven_time.model.js';
import FTPClient from '@/lib/ftp_client/index.js';
import { getDataFTPOven, getDataOven, getFilenames } from '@/utils/index.js';

export default class OvenService {
  constructor() {}

  public static async add(ovenType: OvenType, ovenNo: number): Promise<ResponseBody<Oven>> {
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
      ovenTargetTemperature: 0
    });

    return {
      statusCode: 200,
      message: 'OK',
      data: oven,
    };
  }

  public static async updateTargetTemperature(ovenId: number, temperature: number): Promise<ResponseBody<number>> {
    if (!ovenId || !temperature) throw new ResponseError(400, 'required data is missing');

    const isOvenNoExist = await Oven.findByPk(ovenId, {
      attributes: ['id']
    });

    if (!isOvenNoExist) {
      console.error('no oven exist');
      throw new ResponseError(404, 'oven no not found');
    }

    const oven: [number] = await Oven.update({
      ovenTargetTemperature: temperature
    }, {
      where: {
        id: isOvenNoExist.id
      }
    });

    return {
      statusCode: 200,
      message: 'OK',
      data: oven[0],
    };
  }

  public static async getTargetTemperature(name: OvenType, channels: string): Promise<ResponseBody<(number | undefined)[]>> {
    if (!channels || !name) throw new ResponseError(400, 'required data is missing')

    const toArray = channels.split(",").map((value) => Number(value))

    if (!toArray.every(val => Number.isInteger(val))) throw new ResponseError(404, 'Illegal Data')

    const ovens = await Oven.findAll({
      where: {
        [Op.and]: {
          ovenType: name,
          ovenNo: toArray
        }
      },
      attributes: ['ovenNo', 'ovenTargetTemperature'],
      raw: true
    })

    const map = new Map(ovens.map(o => [o.ovenNo, o.ovenTargetTemperature]))
    const ordered = toArray.map(ch => map.get(ch))
    return {
      statusCode: 200,
      message: 'OK',
      data: ordered
    }
  }

  public static async getTemperatureReport(ovenType?: OvenType, ovenNo?: string, startDay?: string, endDay?: string, startHour: string = '00', endHour: string = '23'): Promise<ResponseBody<OvenTemperature[][] | null>> {
    if (!ovenType || !ovenNo || !startDay || !endDay) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }
    const ovensNomor = ovenNo.split(',');
    let ovenIds: number[] = [];

    for (let i = 0; i < ovensNomor.length; i++) {
      const ovenId: Oven | null = await Oven.findOne({
        where: {
          [Op.and] : [{ ovenType }, { ovenNo: parseInt(ovensNomor[i]) }]
        },
        attributes: ['id']
      })

      if (!ovenId) throw new ResponseError(404, 'Oven not found');
      ovenIds.push(ovenId.id);
    }
    
    if (startDay == endDay) {
      if (parseInt(startHour) > parseInt(endHour)) throw new ResponseError(400, 'Start hour can`t be greater than end hour')
    }

    let start: string = `${startDay}T${startHour}:00:00`;
    let end: string = `${endDay}T${endHour}:59:59`;

    let ovenDatas: OvenTemperature[][] = [];

    for (let i = 0; i < ovenIds.length; i++) {
      const ovenData: OvenTemperature[] | null = await OvenTemperature.findAll({
        where: {
          ovenId: ovenIds[i],
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
      ovenDatas.push(ovenData)
    }

    return {
      statusCode: 200,
      message: 'OK',
      data: ovenDatas,
    };
  }

  public static async getTemperatureMonitoring(ovenType?: OvenType): Promise<ResponseBody<Oven[]>> {
    if (!ovenType) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }

    const ovenData: Oven[] = await Oven.findAll({
      where: {
        ovenType,
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
          limit: 1440
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

  public static async getLatestTemperature(ovenType?: OvenType): Promise<ResponseBody<Oven[]>> {
    if (!ovenType) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }

    const ovenData: Oven[] = await Oven.findAll({
      where: {
        ovenType,
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
          limit: 1
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

  public static async getOvenRunningDuration(ovenType?: OvenType): Promise<ResponseBody<Oven[]>> {
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
          attributes: ['runningDuration', 'peakDuration', 'severityStatus', 'labelStatus'],
          model: OvenTime,
          as: 'timer',
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

  public static async getTemperatureReportFtpJs(ovenType?: OvenType, ovenNo?: string, startDay?: string, endDay?: string, startHour: string =  '00', endHour: string = '23'): Promise<ResponseBody<ListFTPType[] | null>> {
    if (!ovenType || !ovenNo || !startDay || !endDay) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }
    
    if (startDay == endDay) {
      if (parseInt(startHour) > parseInt(endHour)) throw new ResponseError(400, 'Start hour can`t be greater than end hour')
    }

    let start: Date = new Date(`${startDay}T${startHour}:00:00`);
    let end: Date = new Date(`${endDay}T${endHour}:59:59`);

    const ovensNomor = ovenNo.split(',')

    const fileNames = getFilenames(start, end, ovenType);
    let FTP_CLIENT: FTPClient | null = null
    switch (ovenType) {
      case 'mangan':
        FTP_CLIENT = new FTPClient('192.168.137.99', 21)
      break;
      case 'bobin':
        FTP_CLIENT = new FTPClient('192.168.137.103', 21)
      break;
      case 'bubuk':
        FTP_CLIENT = new FTPClient('192.168.137.101', 21)
      break;
    }
    const result: ListFTPType[] = await getDataFTPOven(FTP_CLIENT, start, end, ovensNomor, ovenType)
    return {
      statusCode: 200,
      message: 'OK',
      data: result,
    };
  }

  public static async getTemperatureReportFtpPy(ovenType?: OvenType, ovenNo?: string, startDay?: string, endDay?: string, startHour: string =  '00', endHour: string = '23'): Promise<ResponseBody<ListFTPType[] | null>> {
    if (!ovenType || !ovenNo || !startDay || !endDay) throw new ResponseError(400, 'required data is missing');

    if (!Object.values(EnumOvenType).includes(ovenType as EnumOvenType)) {
      console.error('oven type does not exist');
      throw new ResponseError(400, 'Oven type invalid');
    }
    
    if (startDay == endDay) {
      if (parseInt(startHour) > parseInt(endHour)) throw new ResponseError(400, 'Start hour can`t be greater than end hour')
    }

    let start: Date = new Date(`${startDay}T${startHour}:00:00`);
    let end: Date = new Date(`${endDay}T${endHour}:59:59`);

    const ovensNomor = ovenNo.split(',')

    const fileNames = getFilenames(start, end, ovenType);
    const result = await getDataOven(fileNames, ovenType, ovensNomor);
    
    return {
      statusCode: 200,
      message: 'OK',
      data: result,
    };
  }
}