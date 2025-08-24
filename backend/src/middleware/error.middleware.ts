import ResponseError from "@/error/index.js";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "sequelize";

export default function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        console.log(err)
        res.status(400).json({
            statusCode: 400,
            message: err.message
        })
    }
    else if (err instanceof ResponseError) {
        res.status(err.code).json({
            statusCode: err.code,
            message: err.message
        })
    } else {
        res.status(500).json({
            statusCode: 500,
            message: err.message
        })
    }
}