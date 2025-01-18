import { HttpService } from '@nestjs/axios';
import { Controller, Body, Inject, Post, HttpException, HttpStatus, Res, Get, UseGuards, Req, Request, Put, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { activeUserDto } from './dto/activeUser.dto';
import { ChangePasswordAuthDto } from './dto/change-password.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as FormData from 'form-data';


@Controller('auth')
export class AuthController {
    constructor(
        //@Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    // async onModuleInit() {
    //     this.authClient.subscribeToResponseOf('login');
    //     await this.authClient.connect();
    // }

    @Post('login')
    async login(@Body() loginDto: loginDto) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/login`, loginDto)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('register')
    async register(@Body() registerDto: registerDto) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/register`, registerDto)
            );
            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Get('google/login')
    googleLogin(@Res() res) {
        // Chuyển hướng tới Auth Service
        const authServiceUrl = 'http://localhost:8081/auth/google/login';
        res.redirect(authServiceUrl);
    }
    @Get('google/callback')
    async googleCallback(@Req() req, @Res() res) {
        try {
            // Forward callback tới Auth Service
            console.log('a')
            const authServiceUrl = 'http://auth-service:8081/auth/google/callback';
            const response = await lastValueFrom(this.httpService.get(
                authServiceUrl,
                { params: req.query },
            ))
            const data = response.data;
            const roles = data.user.roles.map((role: any) => role.name).join(',');
            const frontendUrl = `http://localhost:3000/auth/success`;
            const queryParams = `?access_token=${data.access_token}&refresh_token=${data.refresh_token}&name=${encodeURIComponent(
                data.user.name,
            )}&email=${encodeURIComponent(data.user.email)}&image=${encodeURIComponent(
                data.user.image,
            )}&roles=${encodeURIComponent(roles)}`

            res.redirect(`${frontendUrl}${queryParams}`);
        } catch (error) {
            res.redirect(
                `http://localhost:3000/auth/error?message=${encodeURIComponent(
                    error.response?.data?.message || 'Authentication failed',
                )}`,
            );
        }
    }

    @Get('facebook/login')
    facebookLogin(@Res() res) {
        // Chuyển hướng tới Auth Service
        const authServiceUrl = 'http://localhost:8081/auth/facebook/login';
        res.redirect(authServiceUrl);
    }

    @Get('facebook/callback')
    async facebookCallback(@Req() req, @Res() res) {
        try {
            // Forward callback tới Auth Service
            console.log('a')
            const authServiceUrl = 'http://auth-service:8081/auth/facebook/callback';
            const response = await lastValueFrom(this.httpService.get(
                authServiceUrl,
                { params: req.query },
            ))
            const data = response.data;
            const roles = data.user.roles.map((role: any) => role.name).join(',');
            const frontendUrl = `http://localhost:3000/auth/success`;
            const queryParams = `?access_token=${data.access_token}&refresh_token=${data.refresh_token}&name=${encodeURIComponent(
                data.user.name,
            )}&email=${encodeURIComponent(data.user.email)}&image=${encodeURIComponent(
                data.user.image,
            )}&roles=${encodeURIComponent(roles)}`

            res.redirect(`${frontendUrl}${queryParams}`);
        } catch (error) {
            res.redirect(
                `http://localhost:3000/auth/error?message=${encodeURIComponent(
                    error.response?.data?.message || 'Authentication failed',
                )}`,
            );
        }
    }

    @Post('refresh-token')
    async refreshToken(@Req() req) {
        try {
            const refresh_token = req.headers['refresh-token'];
            const access_token = req.headers.authorization
            if (!access_token || !refresh_token) {
                throw new HttpException('Tokens missing', HttpStatus.UNAUTHORIZED);
            }
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/refresh`, { access_token, refresh_token })
            );
            //const { newAccessToken, newRefreshToken } = response.data
            //res.cookie('refresh-token', newRefreshToken, { httpOnly: true })
            // const responseData = {
            //     statusCode: res.statusCode, // Bạn có thể định nghĩa mã status phù hợp
            //     message: 'Fetch refresh token', // Hoặc sử dụng message động
            //     data: response.data

            // };
            // res.send(responseData)
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );

        }
    }

    @Post('active-user')
    async activeUser(@Body() activeUserDto: activeUserDto) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/active-user`, activeUserDto)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    // @Post('verify-code')
    // async verifyCode(@Req() req) {
    //     try {
    //         const userId = req['user'].id
    //         const response = await lastValueFrom(
    //             this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/verify-code`, { userId })
    //         );
    //         return response.data
    //     } catch (error) {
    //         throw new HttpException(
    //             error.response?.data?.message || 'Internal Server Error',
    //             error.response?.status || 500,
    //         );
    //     }
    // }
    @Post('verify-code')
    async verifyCode(@Body() body: { email: string, code: string }) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/verify-code`, body)
            );
            console.log(body)
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('change-password')
    async changePassword(@Body() changePassword: ChangePasswordAuthDto) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/change-password`, changePassword)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('retry-password')
    async retryPassword(@Body() email: string) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/retry-password`, email)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('retry-active')
    async retryActive(@Body() email: string) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_AUTH_SERVICE')}/retry-active`, email)
            );
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }


    @Put('update-user')
    @UseInterceptors(FilesInterceptor('image'))
    async updateUser(
        @Req() req,
        @Body() updateAuthDto: UpdateAuthDto,
        @UploadedFiles() file?: Express.Multer.File
    ) {
        console.log(file)
        // Gán giá trị id từ req.user_id
        updateAuthDto.id = req['user'].id

        const formData = new FormData();
        //Append các trường trong DTO
        for (const key in updateAuthDto) {
            if (Array.isArray(updateAuthDto[key])) {
                updateAuthDto[key].forEach((value) => formData.append(key, value));
            } else {
                formData.append(key, updateAuthDto[key]);
            }
        }

        // // Append file upload vào form-data
        if (Array.isArray(file) && file.length > 0) {
            const uploadedFile = file[0]; // Lấy file đầu tiên từ mảng
            if (uploadedFile.buffer && uploadedFile.originalname && uploadedFile.mimetype) {
                formData.append('image', uploadedFile.buffer, {
                    filename: uploadedFile.originalname,
                    contentType: uploadedFile.mimetype,
                });
            } else {
                console.log('File is invalid or missing required properties.');
            }
        } else {
            console.log('No file uploaded. Proceeding without file.');
        }

        try {
            const response = await lastValueFrom(
                this.httpService.put(
                    `${this.configService.get<string>('URI_AUTH_SERVICE')}/update-user`,
                    formData,
                    {
                        headers: formData.getHeaders(),
                    }
                )
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Get('uploads/:userId/:userImage')
    async getImages(
        @Param('userId') userId: string,
        @Param('userImage') userImage: string,
        @Res() res: Response,
    ) {
        try {
            const userImageUrl = `http://auth-service:8081/uploads/${userId}/${userImage}`
            const response = await lastValueFrom(
                this.httpService.get(userImageUrl, { responseType: 'stream' },)
            );
            Object.entries(response.headers).forEach(([key, value]) => {
                res.setHeader(key, value); // Sử dụng setHeader thay vì set
            });
            response.data.pipe(res);
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Get('get-user')
    async getUserById(@Req() req) {
        try {
            const userId = req['user'].id
            const response = await lastValueFrom(
                this.httpService.get(
                    `${this.configService.get<string>('URI_AUTH_SERVICE')}/get-user/${userId}`
                )
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }
}
