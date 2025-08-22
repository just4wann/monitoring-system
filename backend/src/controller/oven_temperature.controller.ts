import OvenTemperatureService from "@/service/oven_temperature.service.js";
import { ExtendedRequestBody } from "@/types/index.js";
import type { NextFunction, Request, Response } from "express";

export default class OvenController {
    constructor() {}

    static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ovenId, value } = req.body as { ovenId: number, value: number };
            await OvenTemperatureService.add(ovenId, value);
        } catch (error) {
            next(error)
        }
    }
}