import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';

export function middleware(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader || "";

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        
        if(decoded){
            //@ts-ignore
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Unauthorized"
            })
        }
    } catch(error) {
        res.status(403).json({
            message: "Invalid or expired token"
        })
    }
}