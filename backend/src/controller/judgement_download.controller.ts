import JudgementDownloadService from "@/service/judgement_download.service.js";
import { RequestBodyCreateJudgementDownload } from "@/types/index.js";
import type { Response, Request, NextFunction } from "express";

export default class JudgementDownloadController {
    constructor() {}

    public static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await JudgementDownloadService.add(req.body as RequestBodyCreateJudgementDownload);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }
}