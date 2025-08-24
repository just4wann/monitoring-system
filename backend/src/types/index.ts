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
    ovenNo?: number; 
}