import ResponseError from "@/error/index.js";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new ResponseError(401, 'Unauthorized');
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, 'ov_25') as JwtPayload;
        req.roles = decoded.roles;
        next();
    } catch (error) {
        next(error)
    }
}