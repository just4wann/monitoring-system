import { hostnameProtect, hostnamePublic } from '../constant/config';
import type { OvenType, IResponseType, IOvenTemperatureResponseType, ITemperatureResponseType, Parameter, IResultResponseType, IOvenDurationResponseType, ITemperatureFTPResponseType, IOvenJudgement, IOvenJudgementParameter, UserLoginResponse, IJudgementDownload, UserCheckType, IUpdateTemperature } from '../types';
import { UtilityClass } from '../utils';

export class UserAPI {
  constructor() {}

  public static async userLogin(roles: string, password: string): Promise<IResponseType<UserLoginResponse | null>> {
    try {
      const res = await fetch(`http://${hostnamePublic}/login`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ roles, password })
      });
      const result: IResponseType<UserLoginResponse> = await res.json();
      return result
    } catch (error) {
      console.error(error)
      return {
        message: error as string,
        statusCode: 500,
        data: null
      }
    }
  }

  public static async userCheck(): Promise<IResponseType<UserCheckType>> {
    const token = localStorage.getItem('token');
    if (token == 'guest') return {
        statusCode: 401,
        message: 'no token',
        data: {
          loggedIn: false,
          roles: 'guest'
        }
    };
    if (!token) return {
        statusCode: 401,
        message: 'no token',
        data: {
          loggedIn: false,
          roles: null
        }
    }
    try {
      const res  = await fetch(`http://${hostnameProtect}/user_check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result: IResponseType<UserCheckType> = await res.json();
      return result
    } catch (error) {
       return {
        statusCode: 500,
        message: error as string,
        data: {
          loggedIn: false,
          roles: null
        }
       }
    }
  }
}

export class OvenAPI {
  constructor() {}

  public static async getOvenByType(ovenType: OvenType): Promise<IResultResponseType<IOvenTemperatureResponseType[] | []>> {
    try {
      const res = await fetch(`http://${hostnamePublic}/get_temperature_all?ovenType=${ovenType}`, {
        method: 'GET',
      });
      const result: IResponseType<IOvenTemperatureResponseType[]> = await res.json();
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

  public static async getLatestTemperature(ovenType: OvenType, ovenStore: IOvenTemperatureResponseType[]): Promise<boolean> {
    try {
      const res = await fetch(`http://${hostnamePublic}/get_temperature_latest?ovenType=${ovenType}`, {
        method: 'GET',
      });
      const result: IResponseType<IOvenTemperatureResponseType[]> = await res.json();
      if (result.data.length !== ovenStore.length) {
        console.error('data overflow');
        return false;
      }
      for (let i = 0; i < result.data.length; i++) {
        ovenStore[i].temperatures.pop();
        ovenStore[i].temperatures.unshift(result.data[i].temperatures[0]);
      }
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  public static async getTemperatureByPeriode(...args: Parameter): Promise<IResultResponseType<ITemperatureResponseType[][] | []>> {
    const ovenType = args[0];
    const ovenNo = args[1];
    const startDay = args[2];
    const endDay = args[3];
    const startHour = args[4];
    const endHour = args[5];

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/get_temperature_report?ovenType=${ovenType}&ovenNo=${ovenNo}&startDay=${startDay}&endDay=${endDay}&startHour=${startHour}&endHour=${endHour}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result: IResponseType<ITemperatureResponseType[][]> = await res.json();
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

  public static async getReport(param: { id: number, prods: string }, ovenType: string, ovenNo: number[]): Promise<boolean> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/report`, {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })

      const blob = await res.blob();
      UtilityClass.downloadPDF(blob, ovenType, ovenNo);
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  public static async getOvenDuration(ovenType: OvenType): Promise<IResultResponseType<IOvenDurationResponseType[] | []>> {
    try {
      const res = await fetch(`http://${hostnamePublic}/get_oven_duration?ovenType=${ovenType}`, {
        method: 'GET',
      });
      const result: IResponseType<IOvenDurationResponseType[]> = await res.json();
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

  public static async getTemperatureByPeriodeFTP(...args: Parameter): Promise<IResultResponseType<ITemperatureFTPResponseType[] | []>> {
    const ovenType = args[0];
    const ovenNo = args[1];
    const startDay = args[2];
    const endDay = args[3];
    const startHour = args[4];
    const endHour = args[5];

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/get_temperature_report_ftp_js?ovenType=${ovenType}&ovenNo=${ovenNo}&startDay=${startDay}&endDay=${endDay}&startHour=${startHour}&endHour=${endHour}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result: IResponseType<ITemperatureFTPResponseType[]> = await res.json();
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

  public static async getTemperatureByPeriodeDB(...args: Parameter): Promise<IResultResponseType<ITemperatureFTPResponseType[] | []>> {
    const ovenType = args[0];
    const ovenNo = args[1];
    const startDay = args[2];
    const endDay = args[3];
    const startHour = args[4];
    const endHour = args[5];

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/get?ovenType=${ovenType}&ovenNo=${ovenNo}&startDay=${startDay}&endDay=${endDay}&startHour=${startHour}&endHour=${endHour}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result: IResponseType<ITemperatureFTPResponseType[]> = await res.json();
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

  public static async getJudgements(): Promise<IResponseType<IOvenJudgement[] | []>> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/get_all_oven_judgement`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result: IResponseType<IOvenJudgement[]> = await res.json();
      return {
        statusCode: 200,
        message: result.message,
        data: result.data
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: error as string,
        data: []
      }
    }
  }

  public static async setJudgement(body: IOvenJudgementParameter): Promise<IResponseType<IOvenJudgement | null>> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/add_oven_judgement`, {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const result: IResponseType<IOvenJudgement> = await res.json();
      return {
        statusCode: 200,
        message: result.message,
        data: result.data
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: error as string,
        data: null
      }
    }
  }

  public static async deleteJudgement(body: { id: number }): Promise<IResponseType<boolean>> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/delete_oven_judgement`, {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const result: IResponseType<boolean> = await res.json();
      return {
        statusCode: 200,
        message: result.message,
        data: result.data
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: error as string,
        data: false
      }
    }
  }

  public static async judgementDownload(body: IJudgementDownload): Promise<IResponseType<boolean>> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/judgement_download`, {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const result: IResponseType<boolean> = await res.json();
      return {
        statusCode: 200,
        message: result.message,
        data: result.data
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error as string,
        data: false
      }
    }
  }

  public static async updateTemperatureTarget(body: IUpdateTemperature): Promise<IResponseType<number>> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://${hostnameProtect}/update_temperature`, {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const result: IResponseType<number> = await res.json()
      return result
    } catch (error) {
      return {
        statusCode: 500,
        message: error as string,
        data: 0
      }
    }
  }

  public static async getTemperatureTarget(type: string, channels: number[]): Promise<IResponseType<number[]>> {
    try {
      const res = await fetch(`http://${hostnamePublic}/get_target_temperature?ovenType=${type}&ovenNo=${channels}`, {
        method: 'GET'
      })
      const result: IResponseType<number[]> = await res.json()
      return result
    } catch (error) {
      return {
        statusCode: 500,
        message: error as string,
        data: []
      }
    }
  }
}