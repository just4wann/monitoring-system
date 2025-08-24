interface TemperatureResponseType {
  temperature: string;
  createdAt: string;
}

export type OvenType = 'mangan' | 'bobin' | 'bubuk';

export interface OvenResponseType {
  id: number;
  ovenType: OvenType;
  ovenNo: number;
  temperatures: TemperatureResponseType[];
}

export interface ResponseType<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type SelectOvenType = { label: string, value: OvenType };
export type TemperatureListType = { temperature: string; createdAt: string };
