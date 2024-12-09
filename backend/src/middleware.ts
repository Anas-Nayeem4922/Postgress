import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers.token;
    if(token) {
        const decoded = jwt.verify(token as string, JWT_SECRET as string);
        if(decoded) {
            req.userId = (decoded as JwtPayload).id;
            next();
        }else{
            res.json({
                msg : "Invalid token"
            })
        }
    }else{
        res.json({
            msg : "Token not provided"
        })
    }
}