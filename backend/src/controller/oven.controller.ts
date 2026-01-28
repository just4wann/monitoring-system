import OvenService from "@/service/oven.service.js";
import { ExtendedRequestBody, GetTemperatureRequestQuery, SearchQuery, UpdateTemperatureRequestBody } from "@/types/index.js";
import type { NextFunction, Request, Response } from "express";

export default class OvenController {
    constructor() {}

    public static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles !== 'admin') return next('forbidden');
            const { ovenType, ovenNo } = req.body as ExtendedRequestBody;
            const result = await OvenService.add(ovenType, ovenNo);
            res.status(result.statusCode).json(result.data);
        } catch (error) {
            next(error)
        }
    }

    public static async updateTemperatureTarget(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles === 'qc' || req.roles === 'prods') {
                const { ovenId, temperature } = req.body as UpdateTemperatureRequestBody;
                const result = await OvenService.updateTargetTemperature(ovenId, temperature);
                res.status(result.statusCode).json(result.data);
                return;
            }
            next('forbidden');
        } catch (error) {
            next(error)
        }
    }

    public static async getTargetTemperature(req: Request<{}, {}, {}, GetTemperatureRequestQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType, ovenNo } = req.query as GetTemperatureRequestQuery;
            const result = await OvenService.getTargetTemperature(ovenType, ovenNo);
            res.status(result.statusCode).json(result);
        }
        catch (error) {
            next(error)
        }
    }

    public static async getTemperatureReport(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles === 'qc' || req.roles === 'prods') {
                const { ovenType, ovenNo, startDay, endDay, startHour, endHour } = req.query as SearchQuery;
                const result = await OvenService.getTemperatureReport(ovenType, ovenNo, startDay, endDay, startHour, endHour);
                res.status(result.statusCode).json(result);
                return;
            } 
            next('forbidden');
        } catch (error) {
            next(error);
        }
    }

    public static async getTemperatureReportFtpJs(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles === 'qc' || req.roles === 'prods') {
               const { ovenType, ovenNo, startDay, endDay, startHour, endHour } = req.query as SearchQuery;
                const result = await OvenService.getTemperatureReportFtpJs(ovenType, ovenNo, startDay, endDay, startHour, endHour);
                res.status(result.statusCode).json(result);
                return;
            }
            next('forbidden');
        } catch (error) {
            next(error);
        }
    }

    public static async getTemperatureReportFtpPy(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles === 'qc' || req.roles === 'prods') {
               const { ovenType, ovenNo, startDay, endDay, startHour, endHour } = req.query as SearchQuery;
                const result = await OvenService.getTemperatureReportFtpPy(ovenType, ovenNo, startDay, endDay, startHour, endHour);
                res.status(result.statusCode).json(result);
                return;
            }
            next('forbidden');
        } catch (error) {
            next(error);
        }
    }

    public static async getTemperatureMonitoring(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType } = req.query as SearchQuery;
            const result = await OvenService.getTemperatureMonitoring(ovenType);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async getLatestTemperature(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType } = req.query as SearchQuery;
            const result = await OvenService.getLatestTemperature(ovenType);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async getOvenRunningDuration(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType } = req.query as SearchQuery;
            const result = await OvenService.getOvenRunningDuration(ovenType);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }
}