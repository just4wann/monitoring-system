import JudgementDownloadController from "@/controller/judgement_download.controller.js";
import OvenController from "@/controller/oven.controller.js";
import OvenJudgementController from "@/controller/oven_judgement.controller.js";
import ReportController from "@/controller/report.controller.js";
import UserController from "@/controller/user.controller.js";
import type { Request, Response, Router } from "express";

export default class Routes {
    constructor(private protectedRouter: Router, private publicRouter: Router) {}

    public setupPublicRouter() {
        this.publicRouter.get('/', (_req: Request, res: Response) => {
            res.send('server running')
        })
        this.publicRouter.post('/regist', UserController.userRegist);
        this.publicRouter.post('/login', UserController.userLogin);
        this.publicRouter.get('/get_temperature_all', OvenController.getTemperatureMonitoring);
        this.publicRouter.get('/get_temperature_latest', OvenController.getLatestTemperature);
        this.publicRouter.get('/get_oven_duration', OvenController.getOvenRunningDuration);
        this.publicRouter.get('/get_target_temperature', OvenController.getTargetTemperature);
    }

    public setupProtectedRouter() {
        this.protectedRouter.post('/user_check', UserController.userCheck);
        this.protectedRouter.post('/add_oven', OvenController.add);
        this.protectedRouter.post('/update_temperature', OvenController.updateTemperatureTarget);
        this.protectedRouter.post('/add_oven_judgement', OvenJudgementController.add);
        this.protectedRouter.post('/delete_oven_judgement', OvenJudgementController.delete);
        this.protectedRouter.get('/get_temperature_report', OvenController.getTemperatureReport);
        this.protectedRouter.get('/get_temperature_report_ftp_py', OvenController.getTemperatureReportFtpPy);
        this.protectedRouter.get('/get_temperature_report_ftp_js', OvenController.getTemperatureReportFtpJs);
        this.protectedRouter.get('/get_all_oven_judgement', OvenJudgementController.getAll);
        this.protectedRouter.post('/judgement_download', JudgementDownloadController.add);
        this.protectedRouter.post('/report', ReportController.createReport);
    }
}