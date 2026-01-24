

import { RateLimiterRedis } from 'rate-limiter-flexible';
import type { Request, Response, NextFunction } from "express";
import { Alert } from '../utils/logger';
import { redisClient } from "../config/db"; 
const rateLimiter= async  (req: Request, res: Response, next: NextFunction)=> {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = (typeof forwardedFor === 'string' ? forwardedFor : '').split(',')[0] ||""
   
    const ratelimit = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl',
        points:1,
        duration: 10
    });
    try{
        const res = await ratelimit.consume(ip);
         return next();
    }catch(rejRes:any){
        Alert(`the ip ${ip} has done too many requests`)
        console.log(rejRes)
        return res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: rejRes.msBeforeNext,
    });
    }
}
export default rateLimiter