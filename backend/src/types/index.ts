declare global {
    namespace Express {
        interface Request {
            roles: Roles
        }
    }
}

export type Roles =  'admin' | 'qc' | 'prods' | null

export enum EnumOvenType {
    MANGAN = "mangan",
    BOBIN = "bobin",
    BUBUK = "bubuk"
}

export type OvenType = "mangan" | "bobin" | "bubuk";

export interface ResponseBody<T> {
    statusCode: number,
    message: string,
    data?: T
}

export interface ExtendedRequestBody {
    ovenType: OvenType;
    ovenNo: number;
}

export interface UpdateTemperatureRequestBody {
    ovenId: number;
    temperature: number;
}

export interface GetTemperatureRequestQuery {
    ovenType: OvenType;
    ovenNo: string
}

export interface SearchQuery {
    ovenType?: OvenType;
    ovenNo?: string;
    startDay?: string;
    endDay?: string;
    startHour?: string;
    endHour: string
}

export interface RequestBody {
    buffer: string[];
    ovenType: string;
    ovenNo: string[];
    temperatureTarget: string;
    lot: string;
    temperatureMaxStart: string[];
    temperatureMaxEnd: string[];
    temperatureMaxTime: string[];
    judgement: 'OK' | 'NG'[];
    checkDate: string;
    qcMember: string;
    productionMember: string;
}

export interface RequestBodyId {
    id: number;
    prods: string;
}

export interface IConnectionError {
    errno: number;
    code: string;
    syscall: string;
    address: string;
    port: number;
}

export interface IReportParameter {
    buffer: string;
    ovenType: string;
    ovenNo: string;
    temperatureTarget: string;
    lot: string;
    temperatureMaxStart: string;
    temperatureMaxEnd: string;
    temperatureMaxTime: string;
    judgement: 'OK' | 'NG';
    checkDate: string;
    qcMember: string;
    productionMember: string;
}

interface OvenInformationType {
  ovenType: OvenType;
  ovenNo: number;
}

interface TemperatureResponseType {
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

export interface ListFTPType {
    name: string,
    no: string,
    values: {temperature: string, timestamp: string}[],
}

export interface IPublishTopicPayload {
    files: string[],
    ovenType: string
}

export interface ISubscribeTopicPayload {
    timestamp: string,
    "Oven 1": number,
    "Oven 2": number,
    "Oven 3": number,
    "Oven 4": number,
    "Oven 5": number,
    "Oven 6": number,
    "Oven 7": number,
    "Oven 8": number,
    "Oven 9": number,
    "Oven 10": number,
    "Oven 11": number,
    "Oven 12": number,
    "Oven 13": number,
    "Oven 14": number,
    "Oven 15": number,
    "Oven 16": number,
    "Oven 17": number,
    "Oven 18": number,
    "Oven 19": number,
    "Oven 20": number,
}

export interface RequestBodyJudgement {
    lot: string[];
    ovenType: string;
    channels: string[];
    periode: string;
    judgement: string[];
    judged: string;
    buffers: string[];
    tempTarget: number[];
    tempMaxStart: string[];
    tempMaxEnd: string[];
    tempMaxTime: string[];
}

export interface RequestBodyCreateJudgementDownload {
    judgementId: number;
    downloadBy: string;
}

export interface AccessTokenResponse {
    roles: 'admin' | 'prods' | 'qc';
    accessToken: string;
}

export interface RequestBodyUserLogin {
    password: string;
    roles: 'admin' | 'prods' | 'qc'
}

export interface RequestBodyUserRegist {
    password: string;
    roles: 'admin' | 'prods' | 'qc'
}