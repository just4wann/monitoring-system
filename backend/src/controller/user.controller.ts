import UserService from "@/service/user.service.js";
import { RequestBodyUserLogin, RequestBodyUserRegist } from "@/types/index.js";
import { Request, Response, NextFunction } from "express";

export default class UserController {
    constructor() {}

    public static async userRegist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await UserService.userRegist(req.body as RequestBodyUserRegist);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await UserService.userLogin(req.body as RequestBodyUserLogin);
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static userCheck(req: Request, res: Response, next: NextFunction): void {
        const result = UserService.userCheck(req.roles);
        res.status(result.statusCode).json(result);
    }
}