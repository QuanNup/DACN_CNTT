
import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { RedisService } from "src/config/service/redis.service";

@Injectable()
export class IdempotencyMiddleWare implements NestMiddleware {
    constructor(
        private readonly redisService: RedisService
    ) { }
    async use(req: Request, res: Response, next: (error?: Error | any) => void) {
        const requestId = req.headers['x-request-id'];
        if (req.method === 'POST') {
            const data = await this.redisService.get(requestId as string);
            if (data) {
                res.setHeader('x-request-id', randomUUID())
                res.send(data)
            } else {
                next()
            }
        } else {
            next()
        }

    }
}