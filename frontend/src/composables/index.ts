import type { OvenType, ResponseType, OvenResponseType, TemperatureResponseType, Parameter, ResultResponseType, IReportParameter } from '../types';
import { downloadPDF } from '../utils';

export class OvenAPI {
  constructor() {}

  public static async getOvenByType(ovenType: OvenType): Promise<ResultResponseType<OvenResponseType[] | []>> {
    try {
      const res = await fetch(`http://localhost:8001/get_all?ovenType=${ovenType}`, {
        method: 'GET',
      });
      const result: ResponseType<OvenResponseType[]> = await res.json();
      return {
        message: result.message,
        data: result.data
      };
    } catch (error) {
      console.error(error);
      return {
        message: error as string,
        data: []
      };
    }
  }

  public static async getTemperatureByPeriode(...args: Parameter): Promise<ResultResponseType<TemperatureResponseType[] | []>> {
    const ovenType = args[0];
    const ovenNo = args[1];
    const startDay = args[2];
    const endDay = args[3];
    const startHour = args[4];
    const endHour = args[5];
    try {
      const res = await fetch(`http://localhost:8001/get?ovenType=${ovenType}&ovenNo=${ovenNo}&startDay=${startDay}&endDay=${endDay}&startHour=${startHour}&endHour=${endHour}`, {
        method: 'GET'
      });
      const result: ResponseType<TemperatureResponseType[]> = await res.json();
      return {
        message: result.message,
        data: result.data
      }
    } catch (error) {
      console.error(error);
      return {
        message: error as string,
        data: []
      }
    }
  }

  public static async getReport(report: IReportParameter): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:8001/report', {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(report)
      })

      const blob = await res.blob();
      downloadPDF(blob, report.ovenType, report.ovenNo);
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  }
}