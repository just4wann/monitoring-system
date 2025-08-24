import OvenController from "@/controller/oven.controller.js";
import type { Express } from "express";

export default class Router {
    constructor(private readonly app: Express) {}

    public setupRouter() {
        this.app.get('/', (req, res) => {
            res.send('server running')
        })
        this.app.post('/add', OvenController.add)
        this.app.get('/get', OvenController.get);
        this.app.get('/get_all', OvenController.getAll);
    }
}