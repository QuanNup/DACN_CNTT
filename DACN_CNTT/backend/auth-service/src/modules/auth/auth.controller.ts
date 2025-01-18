import { Controller, Post, UseGuards, Body, HttpException, HttpCode, HttpStatus, Get, UnauthorizedException, Res, Req, Query, Catch, Patch, Put, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CodeAuthDto } from './dto/active-auth.dto';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AuthDto } from './dto/auth.dto';
import { RedisService } from 'src/state/service/redis.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/config/guards/local-auth/local-auth.guard';
import { GoogleAuthGuard } from 'src/config/guards/google-auth/google-auth.guard';
import { FacebookAuthGuard } from 'src/config/guards/facebook-auth/facebook-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private redisService: RedisService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  async validatetoken(@Req() req) {
    return req.user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Req() req) {
    return await this.authService.login(req.user)
  }

  @Post('register')
  register(@Body() registerDto: CreateAuthDto) {
    try {
      return this.authService.handleRegister(registerDto)
    }
    catch (error) {
      if (error instanceof HttpException) {
        return { statusCode: error.getStatus(), message: error.message };
      }
      return { statusCode: 500, message: 'Internal server error' };
    }
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req) {
    return await this.authService.login(req.user)
  }

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/login')
  facebookLogin() { }

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/callback')
  async facebookRedirect(@Req() req) {
    return await this.authService.login(req.user)
  }

  @Post('active-user')
  activeUser(@Body() activeDto: CodeAuthDto) {
    try {
      return this.authService.handleActive(activeDto)
    } catch (error) {
      if (error instanceof HttpException) {
        return { statusCode: error.getStatus(), message: error.message };
      }
      return { statusCode: 500, message: 'Internal server error' };
    }
  }

  @Put('update-user')
  @UseInterceptors(FilesInterceptor('image'))
  async updateUser(
    @Body() updateAuthDto: UpdateAuthDto,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    return await this.authService.handleUpdateUser(updateAuthDto, file)
  }

  @Post('refresh')
  async refreshToken(@Req() req) {
    try {
      return await this.authService.refreshToken(req.body.access_token, req.body.refresh_token);
    } catch (error) {
      if (error instanceof HttpException) {
        return { statusCode: error.getStatus(), message: error.message };
      }
      return { statusCode: 500, message: 'Internal server error' };
    }
  }

  @Post('change-password')
  changePassword(@Body() changePassword: ChangePasswordAuthDto) {
    return this.authService.handleChangePassword(changePassword)
  }

  // @Post('verify-code')
  // async verifyCode(@Req() req) {
  //   return await this.authService.sendVerificationCodeToEmail(req.body.userId)
  // }
  @Post('verify-code')
  async verifyCode(@Req() req) {
    console.log(req.body.email)
    console.log(req.body.code)
    return await this.authService.verifyCode(req.body.email, req.body.code)
  }


  @Post('retry-password')
  async retryPassword(@Req() req) {
    return await this.authService.retryPassword(req.body.email)
  }

  @Post('retry-active')
  async retryActive(@Req() req) {
    return await this.authService.retryActive(req.body.email)
  }

  @Get('get-user/:id')
  async getUser(@Param('id') id: string) {
    return await this.authService.handleGetUserById(id)
  }
}


