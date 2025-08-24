import type { OvenType, ResponseType, OvenResponseType } from '../types';

export class OvenAPI {
  constructor() {}

  public static async getOvenByType(ovenType: OvenType): Promise<OvenResponseType[] | []> {
    try {
      const res = await fetch(`http://localhost:8001/get_all?ovenType=${ovenType}`, {
        method: 'GET',
      });
      const result: ResponseType<OvenResponseType[]> = await res.json();
      console.log(result)
      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
