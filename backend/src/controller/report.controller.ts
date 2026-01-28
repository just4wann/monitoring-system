import ReportService from "@/service/report.service.js";
import { RequestBody, RequestBodyId } from "@/types/index.js";
import type { Request, Response, NextFunction } from "express";

export default class ReportController {
    constructor() {}

    static async createReport(req: Request<{}, {}, RequestBodyId, {}>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (req.roles === 'qc' || req.roles === 'prods') {
                const request = req.body as RequestBodyId;
                const result = await ReportService.createReport(request);
                res.set({
                    "Content-Type" : "application/pdf",
                    "Content-Disposition" : `attachment; filename=report-${Date.now()}.pdf`
                })
                res.send(result);
                return;
            }
            next('forbidden');
        } catch (error) {
            next(error)
        }
    }
}