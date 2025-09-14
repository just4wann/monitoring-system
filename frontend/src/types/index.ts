import type { CalendarDate } from "@internationalized/date";

export type OvenType = 'mangan' | 'bobin' | 'bubuk';

export type Parameter = [string, string, string, string, string, string];

export interface OvenInformationType {
  ovenType: OvenType;
  ovenNo: number;
}

export interface TemperatureResponseType {
  temperature: string;
  createdAt: string;
  oven: OvenInformationType;
}

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

export interface ResultResponseType<T> {
  message: string;
  data: T;
}

export type BadgeType = "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral" | undefined;
export type DateRangeType = {
    start: CalendarDate,
    end: CalendarDate
}

export interface IReportParameter {
    buffer: string;
    ovenType: string;
    ovenNo: string;
    temperatureTarget: number;
    lot: string;
    temperatureMaxStart: string;
    temperatureMaxEnd: string;
    temperatureMaxTime: string;
    judgement: string;
    checkDate: string;
    qcMember: string;
    productionMember: string;
}