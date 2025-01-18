import { HttpService } from "@nestjs/axios";
import { ExecutionContext, HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { NextFunction, Request } from "express";
import { lastValueFrom } from "rxjs";
import { IS_PUBLIC_KEY } from "src/config/decorator/customize";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private reflector: Reflector
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.method === 'GET' && req.path.startsWith('/api/v1/categories')) {
                return next();
            }
            if (req.method === 'GET' && req.path.startsWith('/api/v1/products')) {
                return next();
            }
            if (req.method === 'GET' && req.path.startsWith('/api/v1/search')) {
                return next();
            }
            const accessToken = req.headers['authorization']?.split(' ')[1];
            if (!accessToken) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
            const authServiceUrl = `${this.configService.get<string>('URI_AUTH_SERVICE')}/validate-token`
            let userData;
            try {
                const response = await lastValueFrom(
                    this.httpService.post(
                        authServiceUrl,
                        {}, // Body (nếu cần)
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                            withCredentials: true,
                        }
                    )
                );
                userData = response.data;
            } catch (error) {
                // Log lỗi chi tiết khi gọi tới auth-service
                console.error('Error while validating token:', {
                    url: authServiceUrl,
                    status: error.response?.status || 'Unknown',
                    data: error.response?.data || 'No response body',
                });

                // Xử lý lỗi cụ thể từ auth-service
                if (error.response?.status === 401) {
                    throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
                }
                if (error.response?.status === 403) {
                    throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
                }

                // Lỗi không xác định
                throw new HttpException(
                    'Failed to validate token with auth-service',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            // Gắn thông tin user vào request
            req['user'] = userData;
            console.log('Authenticated User:', req['user']);

            next();
        }
        catch (error) {
            console.error('Authentication Middleware Error:', {
                method: req.method,
                path: req.path,
                message: error.message,
            });

            // Trả về lỗi chi tiết cho client
            throw new HttpException(
                error.message || 'Unauthorized',
                error.status || HttpStatus.UNAUTHORIZED
            );
        }
    }
}