import OvenService from "@/service/oven.service.js";
import { ExtendedRequestBody } from "@/types/index.js";
import type { NextFunction, Request, Response } from "express";

export default class OvenController {
    constructor() {}

    static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType, ovenNo } = req.body as ExtendedRequestBody;
            const result = await OvenService.get(ovenType, ovenNo!);
            res.status(result.statusCode).json(result.data);
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenType } = req.body as ExtendedRequestBody;
            const result = await OvenService.getAll(ovenType);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }
}