interface IJudgementDownloadItem {
  id: number;
  downloadBy: string;
  createdAt: Date;
}

interface IOvenInformationType {
  ovenType: OvenType;
  ovenNo: number;
}

interface IDurationResponseType {
  runningDuration: string;
  peakDuration: string;
  severityStatus: string;
  labelStatus: string;
}

interface IConfig {
  count: number;
  domain: [number, number];
  maxTemperature: number;
}

export type OvenType = 'mangan' | 'bobin' | 'bubuk';

export type Parameter = [string, number[], string, string, string, string];

export interface UserCheckType {
  loggedIn: boolean;
  roles: string | null;
}

export interface ITemperatureData {
  temperature: string;
  timestamp: string;
}

export type TemperatureListType = { 
  temperature: string;
  createdAt: string;
};

export interface ITemperatureResponseType {
  temperature: string;
  createdAt: string;
  oven: IOvenInformationType;
}

export interface ITemperatureFTPResponseType {
  name: string,
  no: string,
  values: ITemperatureData[]
}

export interface IOvenTemperatureResponseType {
  id: number;
  ovenType: OvenType;
  ovenNo: number;
  ovenTargetTemperature: number;
  temperatures: ITemperatureResponseType[];
}

export interface IOvenDurationResponseType {
  id: number;
  ovenType: OvenType,
  ovenNo: number;
  timer: IDurationResponseType;
}

export interface IResponseType<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface IResultResponseType<T> {
  message: string;
  data: T;
}

export type BadgeType = "danger" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
export type OvenStateType = "Off" | "Cooling" | "Running" | "Abnormal" | "Normal";
export type FanStateType = "Active" | "Inactive";

export interface IJudgementDownload {
  judgementId: number;
  downloadBy: string;
}

export interface IOvenConfig {
  [key: string]: IConfig
}

export interface IOvenJudgement {
    createdAt: Date;
    id: number;
    ovenType: string;
    lot: string;
    channels: number[];
    periode: string;
    judgement: string[];
    judged: string;
    downloads: IJudgementDownloadItem[];
    updatedAt: Date;
}

export interface IOvenJudgementParameter {
    lot: string[];
    ovenType: string;
    channels: number[];
    periode: string;
    judgement: string[];
    judged: string;
    buffers: string[];
    tempTarget: number[];
    tempMaxStart: string[];
    tempMaxEnd: string[];
    tempMaxTime: string[];
}

export interface UserLoginResponse {
  accessToken: string;
  roles: string;
}

export interface IUpdateTemperature {
  ovenId: number;
  temperature: number
}