import OvenService from "@/service/oven.service.js";
import { ExtendedRequestBody, SearchQuery } from "@/types/index.js";
import type { NextFunction, Request, Response } from "express";

export default class OvenController {
    constructor() {}

    static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType, ovenNo } = req.body as ExtendedRequestBody;
            const result = await OvenService.add(ovenType, ovenNo!);
            res.status(result.statusCode).json(result.data);
        } catch (error) {
            next(error)
        }
    }

    static async getTemperatureReport(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType, ovenNo, startDay, endDay, startHour, endHour } = req.query as SearchQuery;
            const result = await OvenService.getTemperatureReport(ovenType, ovenNo, startDay, endDay, startHour, endHour);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }

    static async getTemperatureMonitoring(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType } = req.query as SearchQuery;
            const result = await OvenService.getTemperatureMonitoring(ovenType);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }
}