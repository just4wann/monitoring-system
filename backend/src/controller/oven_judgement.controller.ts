import OvenJudgementService from "@/service/oven_judgement.service.js";
import { RequestBodyJudgement } from "@/types/index.js";
import type { Response, Request, NextFunction } from "express";

export default class OvenJudgementController {
    constructor() {}

    public static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles !== 'qc') return next('forbidden');
            const result = await OvenJudgementService.add(req.body as RequestBodyJudgement);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }

    public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles === 'qc' || req.roles === 'prods') {
                const result = await OvenJudgementService.getAll();
                res.status(result.statusCode).json(result);
                return;
            }
            next('forbidden');
        } catch (error) {
            next(error)
        }
    }

    public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles !== 'qc') return next('forbidden');
            const result = await OvenJudgementService.delete(req.body.id.id);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }
}