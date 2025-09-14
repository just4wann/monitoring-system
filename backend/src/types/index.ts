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
    ovenNo?: number;
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