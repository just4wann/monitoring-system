import OvenController from "@/controller/oven.controller.js";
import ReportController from "@/controller/report.controller.js";
// import SSEController from "@/controller/sse.controller.js";
import type { Express, Request, Response } from "express";

export default class Router {
    // private sseController: SSEController;
    constructor(private readonly app: Express) {
        // this.sseController = new SSEController();
    }

    public setupRouter() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('server running')
        })
        this.app.post('/add', OvenController.add)
        this.app.get('/get', OvenController.getTemperatureReport);
        this.app.get('/get_all', OvenController.getTemperatureMonitoring);

        this.app.post('/report', ReportController.createReport);
    }

    // public setupRouterSSE() {
    //     this.app.get('/status', this.sseController.emit);
    // }
}