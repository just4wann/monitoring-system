import ReportService from "@/service/report.service.js";
import { RequestBody } from "@/types/index.js";
import type { Request, Response, NextFunction } from "express";

export default class ReportController {
    constructor() {}

    static async createReport(req: Request<{}, {}, RequestBody, {}>, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.body as RequestBody;
            const result = await ReportService.createReport(request);
            res.set({
                "Content-Type" : "application/pdf",
                "Content-Disposition" : `attachment; filename=report-${Date.now()}.pdf`
            })
            res.send(result);
        } catch (error) {
            next(error)
        }
    }
}