
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CodeAuthDto } from './dto/active-auth.dto';
import { comparePasswordHelper } from 'src/config/helpers/util';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/state/service/redis.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password.dto';
import { randomInt } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../management/users/users.service';
import refreshJwtConfig from 'src/config/config-jwt/refresh.jwt.config';
import jwtConfig from 'src/config/config-jwt/jwt.config';
import { AuthJwtPayload } from 'src/config/types/auth-jwtPayload';
import { CreateUserDto } from '../management/users/dto/create-user-request.dto';
import { use } from 'passport';
import path from 'path';


@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    @Inject(refreshJwtConfig.KEY) private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(jwtConfig.KEY) private readonly jwtTokenConfig: ConfigType<typeof jwtConfig>
  ) { }

  async retryPassword(email: string) {
    const userEmail = await this.usersService.findOneByEmail(email)
    if (!userEmail)
      throw new NotFoundException("Email không tồn tại !");
    if (userEmail.isActive === false)
      throw new BadRequestException('Tài khoản chưa được kích hoạt !')
    const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');
    await this.redisService.set(`user:${email}:verifyCode`, verificationCode, 60 * 5)
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Verify your account', // Subject line
      template: 'verify-code',
      context: {
        name: userEmail.name ?? email,
        activationCode: verificationCode,
      },
      attachments: [
        {
          filename: 'logo.png', // Tên file đính kèm
          path: path.resolve(__dirname, '../config/mail/logo/logo.png'), // Đường dẫn tới hình ảnh trên máy chủ
          cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
        },
      ],
    })
    return {
      email: userEmail.email,
      id: userEmail.id
    }
  }
  async retryActive(email: string) {
    const userEmail = await this.usersService.findOneByEmail(email)
    if (!userEmail)
      throw new NotFoundException("Email không tồn tại !");
    if (userEmail.isActive === true) {
      throw new BadRequestException("Tài khoản đã kích hoạt, không cần kích hoạt nữa!")
    }
    const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');
    await this.redisService.set(`user:${email}:verifyCode`, verificationCode, 60 * 5)
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Verify your account', // Subject line
      template: 'verify-code',
      context: {
        name: userEmail.name ?? email,
        activationCode: verificationCode,
      },
      attachments: [
        {
          filename: 'logo.png', // Tên file đính kèm
          path: '../../config/mail/logo.png', // Đường dẫn tới hình ảnh trên máy chủ
          cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
        },
      ],
    })

    return {
      email: userEmail.email,
      id: userEmail.id
    }
  }

  async verifyCode(email: string, code: string) {
    const verifyCode = await this.redisService.get(`user:${email}:verifyCode`)
    console.log(verifyCode)
    if (!verifyCode) {
      throw new BadRequestException('Mã xác thực đã hết hạn hoặc không tồn tại.');
    }

    // So sánh mã xác thực
    if (verifyCode !== code) {
      throw new BadRequestException('Mã xác thực không đúng.');
    }
    await this.redisService.delete(`user:${email}:verifyCode`);
    return {
      message: 'Xác thực thành công. Bạn có thể tiếp tục bước tiếp theo.',
    };
  }

  async validateUser(email: string, pass: string) {
    try {
      // Tìm kiếm người dùng theo email
      const user = await this.usersService.findOneByEmail(email);

      // Nếu không tìm thấy người dùng
      if (!user) {
        throw new NotFoundException('Email không tồn tại!');
      }

      // Nếu tài khoản chưa được kích hoạt
      if (!user.isActive) {
        throw new BadRequestException('Tài khoản chưa được kích hoạt!');
      }

      // So sánh mật khẩu với mật khẩu đã mã hóa
      const isValidPassword = await comparePasswordHelper(pass, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedException('Password không hợp lệ!');
      }

      // Loại bỏ các thông tin nhạy cảm
      delete user.password;

      // Trả về thông tin người dùng
      return user;
    } catch (error) {
      // Ghi log lỗi để hỗ trợ debug
      console.error(`Xác thực thất bại cho email: ${email}`, error);

      // Ném lại lỗi để controller xử lý
      throw error;
    }
  }


  async validateStoreOwner(id: string, pass: string) {
    try {
      // Tìm tài khoản Store Owner theo ID
      const storeOwner = await this.usersService.findByUserId(id);

      // Kiểm tra nếu tài khoản không tồn tại
      if (!storeOwner) {
        throw new NotFoundException('Tài khoản không tồn tại trên hệ thống!');
      }

      // Kiểm tra nếu tài khoản chưa kích hoạt
      if (!storeOwner.isActive) {
        throw new BadRequestException('Tài khoản chưa được kích hoạt!');
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await comparePasswordHelper(pass, storeOwner.passwordStore);
      if (!isValidPassword) {
        throw new UnauthorizedException('Thông tin đăng nhập không chính xác!');
      }

      // Loại bỏ thông tin nhạy cảm trước khi trả về
      delete storeOwner.passwordStore;

      return storeOwner;
    } catch (error) {
      // Ghi log lỗi
      console.error(`Xác thực thất bại cho Store Owner ID: ${id}`, error);

      // Ném lại lỗi để controller xử lý
      throw error;
    }
  }


  async loginStoreOwner(userId: string, pass: string): Promise<string> {
    try {
      // Xác thực Store Owner
      const storeOwner = await this.validateStoreOwner(userId, pass);

      // Nếu xác thực thành công, gửi mã xác minh qua email
      await this.sendEmailVerification(storeOwner.id);

      // Trả về ID của Store Owner (hoặc token nếu cần)
      return storeOwner.id;
    } catch (error) {
      // Ghi log lỗi
      console.error(`Login failed for Store Owner ID: ${userId}`, error);

      // Ném lỗi cho client với thông báo thân thiện
      throw new UnauthorizedException('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    }
  }

  async registerStoreOwner() {
    return
  }

  async login(user: any) {
    const role = await this.usersService.findUserRoleById(user.id)
    const payload: AuthJwtPayload = { sub: user.id, scope: role }
    const access_token = await this.jwtService.signAsync(payload)
    const refresh_token = await this.jwtService.signAsync(payload, this.refreshTokenConfig)
    await this.backlistToken(user.id, access_token, refresh_token)
    return {
      access_token,
      refresh_token,
      user: user
    };
  }

  async sendEmailVerification(userId: string) {
    if (!userId) {
      throw new BadRequestException('Người dùng không tồn tại trong hệ thống!')
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại trong hệ thống!');
    }

    const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');
    await this.redisService.set(`user:${userId}:verifyCode`, JSON.stringify(verificationCode), 60 * 5)
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Verify your account', // Subject line
      template: 'verify-user',
      context: {
        name: user.name ?? user.email,
        activationCode: verificationCode,
      },
      attachments: [
        {
          filename: 'logo.png', // Tên file đính kèm
          path: path.resolve(__dirname, '../config/mail/logo/logo.png'), // Đường dẫn tới hình ảnh trên máy chủ
          cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
        },
      ],
    })
    return { message: 'Mã xác thực đã được gửi tới email của bạn.' };
  }

  async sendVerifyCodeStoreOwner(userId: string) {
    if (!userId) {
      throw new BadRequestException('Người dùng không tồn tại trong hệ thống!')
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại trong hệ thống!');
    }

    const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');
    await this.redisService.set(`user:${userId}:verifyCode`, JSON.stringify(verificationCode), 60 * 5)
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Verify your account', // Subject line
      template: 'registerStore',
      context: {
        name: user.name ?? user.email,
        activationCode: verificationCode,
      },
      attachments: [
        {
          filename: 'logo.png', // Tên file đính kèm
          path: path.resolve(__dirname, '../config/mail/logo/logo.png'), // Đường dẫn tới hình ảnh trên máy chủ
          cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
        },
      ],
    })
    return { message: 'Mã xác thực đã được gửi tới email của bạn.' };
  }

  async sendVerificationCodeToEmail(userId: string) {
    if (!userId) {
      throw new BadRequestException('Người dùng không tồn tại trong hệ thống!')
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại trong hệ thống!');
    }

    const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');
    await this.redisService.set(`user:${userId}:verifyCode`, JSON.stringify(verificationCode), 60 * 5)
    console.log(path.resolve(__dirname, '../config/mail/logo/logo.png'))
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Verify your account', // Subject line
      template: 'verify-code',
      context: {
        name: user.name ?? user.email,
        activationCode: verificationCode,
      },
      attachments: [
        {
          filename: 'logo.png', // Tên file đính kèm
          path: path.resolve(__dirname, '../config/mail/logo/logo.png'), // Đường dẫn tới hình ảnh trên máy chủ
          cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
        },
      ],
    })
    return { message: 'Mã xác thực đã được gửi tới email của bạn.' };
  }

  handleGetUserById = async (userId: string) => {
    return await this.usersService.findById(userId)
  }

  handleRegisterStoreOwner = async (user_id: string, passwordStore: string) => {
    return await this.usersService.hanldeRegisterStoreOwner(user_id, passwordStore)
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto)
  }

  handleActive = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data)
  }

  handleUpdateUser = async (data: UpdateAuthDto, file: Express.Multer.File) => {
    return await this.usersService.updateById(data.id, data, file)
  }

  handleChangePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.handleChangePassword(data)
  }

  async refreshToken(access_token: string, refresh_token: string) {
    try {
      if (!access_token) {
        throw new UnauthorizedException("Token không hợp lệ !");
      }

      const accessToken = await this.extractToken(access_token)
      const checkAccessToken = await this.redisService.isTokenBlacklisted(accessToken)
      if (checkAccessToken) {
        throw new UnauthorizedException("Token không hợp lệ !")
      }

      const checkRefreshToken = await this.redisService.isTokenBlacklisted(refresh_token)
      if (checkRefreshToken) {
        throw new UnauthorizedException("Refresh Token không hợp lệ !")
      }

      const accessTokenPayload = await this.jwtService.verify(accessToken, {
        secret: this.jwtTokenConfig.secret
        , ignoreExpiration: true
      })

      const refreshToken = refresh_token
      const refreshTokenPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.refreshTokenConfig.secret
      })

      if (refreshTokenPayload.sub != accessTokenPayload.sub) {
        throw new UnauthorizedException("access token and refresh token not the same")
      }

      const payload = { sub: refreshTokenPayload.sub }
      const newToken = await this.jwtService.signAsync(payload)
      const newRefreshToken = await this.jwtService.signAsync(payload, this.refreshTokenConfig)
      await this.backlistToken(refreshTokenPayload.sub, newToken, newRefreshToken)

      return {
        newAccessToken: newToken,
        newRefreshToken: newRefreshToken
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError' && error.message === 'invalid signature') {
        throw new UnauthorizedException('Chữ ký của JWT không hợp lệ!');
      }
      throw new UnauthorizedException(error.message || 'Xác thực thất bại!');
    }
  }

  async backlistToken(userId: string, access_token: string, refresh_token: string) {
    const tokenExpiryTime = 60 * 60 * 24 * 365;
    const refreshtokenExpiryTime = 60 * 60 * 24 * 365;
    const oldAccessToken = await this.redisService.get(`user:${userId}:access_token`);
    const oldRefreshToken = await this.redisService.get(`user:${userId}:refresh_token`)
    if (oldAccessToken) {
      await this.redisService.addToBlacklist(oldAccessToken, tokenExpiryTime);
    }
    if (oldRefreshToken) {
      await this.redisService.addToBlacklist(oldRefreshToken, refreshtokenExpiryTime)
    }
    await this.redisService.set(`user:${userId}:access_token`, JSON.stringify(access_token), tokenExpiryTime);
    await this.redisService.set(`user:${userId}:refresh_token`, JSON.stringify(refresh_token), refreshtokenExpiryTime)
  }

  async extractToken(jwt: string) {
    const [type, token] = jwt.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!googleUser.email || !googleUser.accountType) {
        throw new BadRequestException('Thông tin người dùng Facebook không hợp lệ.');
      }
      // Tìm kiếm người dùng dựa trên email và accountType
      const user = await this.usersService.findOneByEmailWithAccountType(googleUser.email, googleUser.accountType)

      if (user) {
        return user; // Trả về người dùng nếu đã tồn tại
      }
      return await this.usersService.create(googleUser)
    } catch (error) {
      // Ghi log lỗi chi tiết
      console.error('Lỗi khi xác thực người dùng Facebook:', error);

      // Phân biệt lỗi
      if (error instanceof NotFoundException) {
        // Nếu không tìm thấy người dùng, thử tạo mới
        try {
          return await this.usersService.create(googleUser);
        } catch (createError) {
          console.error('Lỗi khi tạo người dùng Facebook:', createError);
          throw new InternalServerErrorException(
            'Không thể tạo tài khoản Facebook. Vui lòng thử lại sau.'
          );
        }
      }

      // Xử lý lỗi khác
      throw error;
    }
  }

  async validateFacebookUser(facebookUser: CreateUserDto) {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!facebookUser.email || !facebookUser.accountType) {
        throw new BadRequestException('Thông tin người dùng Facebook không hợp lệ.');
      }
      // Tìm kiếm người dùng dựa trên email và accountType
      const user = await this.usersService.findOneByEmailWithAccountType(facebookUser.email, facebookUser.accountType)
      console.log(user)
      if (user) {
        return user; // Trả về người dùng nếu đã tồn tại
      }
      return await this.usersService.create(facebookUser)
    } catch (error) {
      // Ghi log lỗi chi tiết
      console.error('Lỗi khi xác thực người dùng Facebook:', error);

      // Phân biệt lỗi
      if (error instanceof NotFoundException) {
        // Nếu không tìm thấy người dùng, thử tạo mới
        try {
          return await this.usersService.create(facebookUser);
        } catch (createError) {
          console.error('Lỗi khi tạo người dùng Facebook:', createError);
          throw new InternalServerErrorException(
            'Không thể tạo tài khoản Facebook. Vui lòng thử lại sau.'
          );
        }
      }

      // Xử lý lỗi khác
      throw error;
    }
  }
}