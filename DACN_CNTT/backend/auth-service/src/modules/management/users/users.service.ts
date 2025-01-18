import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-request.dto';
import { UpdateUserDto } from './dto/update-user-request.dto';
import aqp from 'api-query-params';
import { MailerService } from '@nestjs-modules/mailer';
import { comparePasswordHelper, hashPasswordHelper } from 'src/config/helpers/util';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { randomInt } from 'crypto';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ChangePasswordAuthDto } from 'src/modules/auth/dto/change-password.dto';
import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';
import { CodeAuthDto } from 'src/modules/auth/dto/active-auth.dto';
import { AccountType, UserEntity } from './entities/user.entities';
import { RolesService } from '../role/roles.service';
import { UserDTO } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { updateUserRoleRequest } from './dto/update-user-role-request.dto';
import { use } from 'passport';
import { RedisService } from 'src/state/service/redis.service';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import path, { join } from 'path';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { isUUID } from 'class-validator';


dayjs.extend(utc)
dayjs.extend(timezone)
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private roleService: RolesService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) { }


  async isEmailExist(email: string, accountType: AccountType): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { email, accountType },
      });

      return !!user; // Trả về true nếu tìm thấy user, ngược lại trả về false
    } catch (error) {
      console.error('Lỗi khi kiểm tra email tồn tại:', error);
      throw new Error('Đã xảy ra lỗi khi kiểm tra email trong cơ sở dữ liệu.');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, image, password, phone, address, isActive, accountType } = createUserDto;
    //checkEmail
    const isEmail = await this.isEmailExist(email, accountType);
    if (isEmail) {
      throw new BadRequestException(
        `Email ${email} đã được sử dụng với loại tài khoản ${accountType}.`,
      );
    }
    const userCount = await this.userRepository.count();
    const roleName = userCount === 0 ? 'ADMIN_GLOBAL' : 'CUSTOMER';
    const role = await this.roleService.findOneByName(roleName);
    if (!role) {
      throw new Error(`Vai trò ${roleName} không tồn tại. Vui lòng tạo vai trò này trong hệ thống.`);
    }
    try {
      // Xác định vai trò của người dùng mới
      const userCount = await this.userRepository.count();
      const roleName = userCount === 0 ? 'ADMIN_GLOBAL' : 'CUSTOMER';

      // Kiểm tra vai trò có tồn tại hay không
      const role = await this.roleService.findOneByName(roleName);
      if (!role) {
        throw new InternalServerErrorException(
          `Vai trò "${roleName}" không tồn tại. Vui lòng tạo vai trò này trong hệ thống.`,
        );
      }

      // Tạo người dùng mới
      const user = this.userRepository.create({
        email,
        name,
        image,
        password,
        phone: phone || '', // Giá trị mặc định nếu phone là null/undefined
        roles: [role], // Gán vai trò cho người dùng
        address: address || '', // Giá trị mặc định nếu address là null/undefined
        isActive: isActive ?? true, // Giá trị mặc định nếu isActive là null/undefined
        accountType,
      });

      // Lưu người dùng vào cơ sở dữ liệu
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);

      // Ném lỗi nếu xảy ra vấn đề không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi tạo người dùng. Vui lòng thử lại.');
    }

  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query)
    if (filter.current) delete filter.current
    if (filter.pageSize) delete filter.pageSize
    if (!current) current = 1
    if (!pageSize) pageSize = 10

    const totalItems = (await this.userRepository.find(filter)).length
    const totalPages = Math.ceil(totalItems / pageSize)

    const results = await this.userRepository.findAndCount({
      where: filter,
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: sort,
    });
    return { results, totalPages }
  }

  async findByUserId(id: string): Promise<UserEntity> {

    if (!isUUID(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    try {
      // Tìm kiếm người dùng theo ID
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'], // Liên kết với bảng 'roles'
        select: ['id', 'email', 'passwordStore'], // Chỉ lấy các trường cần thiết
      });

      // Nếu không tìm thấy người dùng
      if (!user) {
        throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
      }

      return user; // Trả về người dùng nếu tìm thấy
    } catch (error) {
      // Ghi log lỗi để tiện theo dõi
      console.error('Lỗi khi tìm kiếm người dùng theo ID:', error);

      // Ném lỗi nếu xảy ra vấn đề không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi truy xuất thông tin người dùng');
    }
  }

  async findById(id: string): Promise<UserEntity> {

    if (!isUUID(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    try {
      // Tìm kiếm người dùng theo ID
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'], // Liên kết với bảng 'roles'
        select: ['id', 'email', 'name', 'isActive', 'phone', 'address', 'image', 'accountType'], // Chỉ lấy các trường cần thiết
      });

      // Nếu không tìm thấy người dùng
      if (!user) {
        throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
      }

      return user; // Trả về người dùng nếu tìm thấy
    } catch (error) {
      // Ghi log lỗi để tiện theo dõi
      console.error('Lỗi khi tìm kiếm người dùng theo ID:', error);

      // Ném lỗi nếu xảy ra vấn đề không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi truy xuất thông tin người dùng');
    }
  }

  async findDtoById(id: string): Promise<UserDTO> {
    try {
      // Tìm kiếm người dùng trong cơ sở dữ liệu
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      // Nếu không tìm thấy người dùng
      if (!user) {
        throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
      }

      // Chuyển đổi entity thành DTO
      return plainToClass(UserDTO, user);
    } catch (error) {
      // Ghi log lỗi (nếu cần)
      console.error('Lỗi khi tìm kiếm hoặc chuyển đổi DTO:', error);

      // Xử lý lỗi không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi tìm kiếm thông tin người dùng.');
    }
  }

  async findOneByEmail(email: string) {
    try {
      // Tìm kiếm người dùng dựa trên email
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['roles'], // Liên kết với bảng 'roles'
      });

      // Nếu không tìm thấy người dùng
      if (!user) {
        throw new NotFoundException(`Không tìm thấy người dùng với email: ${email}`);
      }

      return user; // Trả về người dùng nếu tìm thấy
    } catch (error) {
      // Log lỗi để tiện theo dõi
      console.error('Lỗi khi tìm kiếm người dùng qua email:', error);

      // Xử lý lỗi không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi tìm kiếm thông tin người dùng.');
    }
  }

  async findOneByEmailWithAccountType(email: string, accountType: AccountType) {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!email || !accountType) {
        throw new BadRequestException('Email hoặc loại tài khoản không hợp lệ.');
      }

      // Tìm kiếm người dùng dựa trên email và accountType
      const user = await this.userRepository.findOne({
        where: { email, accountType },
        relations: ['roles'], // Liên kết với bảng 'roles'
      });
      // Nếu không tìm thấy người dùng
      if (!user) {
        throw new NotFoundException(
          `Không tìm thấy người dùng với email: ${email} và loại tài khoản: ${accountType}.`
        );
      }

      return user; // Trả về người dùng nếu tìm thấy
    } catch (error) {
      // Ghi log lỗi chi tiết
      console.error('Lỗi khi tìm kiếm người dùng qua email và accountType:', error);

      // Phân biệt lỗi
      if (error instanceof NotFoundException) {
        throw error; // Ném lại lỗi nếu người dùng không tồn tại
      }

      // Xử lý lỗi không mong muốn
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi khi tìm kiếm thông tin người dùng. Vui lòng thử lại sau.'
      );
    }
  }

  async updateById(id: string, request: UpdateUserDto, file: Express.Multer.File,) {
    // Kiểm tra xem người dùng có tồn tại không
    const validate = await this.findById(id);
    if (!validate) {
      throw new HttpException('Người dùng không tồn tại!', HttpStatus.NOT_FOUND);
    }
    // Cập nhật thông tin người dùng
    try {
      // Xử lý file upload (nếu có)
      let imageUrl: string | undefined;
      if (file[0]) {
        if (!file[0].buffer || !file[0].originalname || !file[0].mimetype) {
          throw new HttpException('File upload không hợp lệ!', HttpStatus.BAD_REQUEST);
        }
        imageUrl = await this.handleFileUpload(file, validate);
      }
      // Nếu có file, thêm URL file vào request
      if (imageUrl) {
        request.image = imageUrl; // Giả định `image` là trường trong `UpdateUserDto`
      }
      // Cập nhật thông tin người dùng
      await this.userRepository.update(id, request);

      // Lấy lại thông tin người dùng sau khi cập nhật
      const updatedUser = await this.findById(id);

      return updatedUser // Trả về thông tin người dùng sau khi cập nhật

    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);

      // Xử lý lỗi không mong muốn
      throw new HttpException(
        error.message || 'Có lỗi xảy ra khi cập nhật người dùng!',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async handleFileUpload(files: Express.Multer.File, user: any) {
    const file = files[0]
    if (!file || !file.buffer || !file.originalname) {
      throw new HttpException('File upload không hợp lệ!', HttpStatus.BAD_REQUEST);
    }
    try {
      const uploadPath = join(process.cwd(), 'uploads', `${user.id}`);

      // Tạo thư mục nếu chưa tồn tại
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      const existingFiles = readdirSync(uploadPath);
      for (const existingFile of existingFiles) {
        unlinkSync(join(uploadPath, existingFile)); // Xóa file
      }

      const fileExtension = file.originalname.split('.').pop(); // Lấy phần mở rộng
      const finalFileName = `${user.id}.${fileExtension}`;
      const filePath = join(uploadPath, finalFileName);

      // Ghi file vào hệ thống
      writeFileSync(filePath, file.buffer);

      const fileUrl = `http://localhost:8080/api/v1/auth/uploads/${user.id}/${finalFileName}`;
      return fileUrl;
    } catch (error) {
      console.error('Lỗi khi xử lý upload file:', error);
      throw new HttpException(
        'Đã xảy ra lỗi khi xử lý file upload!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }

  async findUserRoleById(id: string): Promise<string[]> {
    try {
      // Lấy thông tin người dùng và vai trò từ cơ sở dữ liệu
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'], // Liên kết với bảng 'roles'
        select: ['id', 'email', 'name', 'isActive', 'image', 'accountType'], // Chỉ lấy các trường cần thiết
      });

      if (!user) {
        throw new HttpException(`Người dùng với ID "${id}" không tồn tại trong hệ thống!`, HttpStatus.NOT_FOUND);
      }

      // Gọi HTTP tới service store để lấy vai trò của nhân viên
      const response = await lastValueFrom(
        this.httpService.get(`http://store-service:8083/store/get-employee/${id}`)
      );

      const roleEmployee = response?.data?.role;

      // Lấy danh sách vai trò từ cơ sở dữ liệu
      const roles = Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];

      // Kết hợp các vai trò và loại bỏ vai trò trùng lặp
      const combinedRoles = [...new Set([...roles, roleEmployee])];

      return combinedRoles;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm vai trò của người dùng:', error);

      // Xử lý lỗi HTTP không thành công từ service khác
      if (error.response?.status) {
        throw new HttpException(
          `Không thể lấy vai trò từ service store: ${error.response?.data?.message || 'Lỗi không xác định.'}`,
          error.response?.status
        );
      }

      // Xử lý lỗi không mong muốn
      throw new HttpException(
        'Đã xảy ra lỗi khi tìm kiếm vai trò của người dùng.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteById(id: string) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await this.userRepository.findOne({ where: { id } });

      // Kiểm tra xem người dùng có tồn tại không
      if (!user) {
        throw new BadRequestException(`Người dùng với ID "${id}" không tồn tại!`);
      }

      // Xóa người dùng
      await this.userRepository.remove(user);

      return {
        message: `Người dùng với ID "${id}" đã được xóa thành công!`,
      };
    } catch (error) {
      // Ghi log lỗi chi tiết để dễ gỡ lỗi
      console.error('Lỗi khi xóa người dùng:', error);

      // Ném lỗi nếu có vấn đề xảy ra
      throw new InternalServerErrorException('Đã xảy ra lỗi khi xóa người dùng.');
    }
  }

  async handleChangePassword(changePassword: ChangePasswordAuthDto) {
    const { email, old_password, new_password } = changePassword;

    try {
      // Tìm người dùng theo email
      const user = await this.userRepository.findOne({ where: { email } });

      // Kiểm tra người dùng có tồn tại
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại!');
      }

      // Xác minh mật khẩu cũ
      const isValidPassword = await comparePasswordHelper(old_password, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Mật khẩu cũ không hợp lệ!');
      }

      // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
      const isExistPassword = await comparePasswordHelper(new_password, user.password);
      if (isExistPassword) {
        throw new BadRequestException('Mật khẩu mới không có sự thay đổi, vui lòng thay mới!');
      }

      // Băm mật khẩu mới và cập nhật
      const hashPassword = await hashPasswordHelper(new_password);
      user.password = hashPassword;

      await this.userRepository.save(user);

      return {
        message: 'Thay đổi mật khẩu thành công!',
      };
    } catch (error) {
      // Ghi log lỗi để dễ dàng gỡ lỗi
      console.error('Lỗi khi thay đổi mật khẩu:', error);

      // Ném lỗi chung nếu xảy ra vấn đề không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại!');
    }
  }

  async hanldeRegisterStoreOwner(user_id: string, passwordStore: string) {

    try {
      // Kiểm tra email đã tồn tại chưa 
      const storeOwner = await this.findByUserId(user_id);
      if (!storeOwner) {
        throw new NotFoundException('Tài khoản không tồn tại trên hệ thống!');
      }

      const isCustomer = storeOwner.roles.some((role) => role.name === 'CUSTOMER');
      if (!isCustomer) {
        throw new BadRequestException('Chỉ khách hàng mới có thể đăng ký làm chủ cửa hàng.');
      }

      // Băm mật khẩu
      const hashedPassword = await hashPasswordHelper(passwordStore);

      // Tạo mã kích hoạt
      const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');

      await this.redisService.set(`user:${user_id}:verifyCode`, JSON.stringify(verificationCode), 60 * 5)
      // Tạo người dùng mới
      await this.userRepository.update(user_id, {
        passwordStore: hashedPassword
      });


      // Gửi email kích hoạt
      try {
        await this.mailerService.sendMail({
          to: storeOwner.email,
          subject: 'Kích hoạt tài khoản của bạn',
          template: 'registerStore',
          context: {
            name: storeOwner.name || storeOwner.email,
            verificationCode,
          },
          attachments: [
            {
              filename: 'logo.png', // Tên file đính kèm
              path: path.resolve(__dirname, '../config/mail/logo/logo.png'), // Đường dẫn tới hình ảnh trên máy chủ
              cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
            },
          ],
        });
      } catch (emailError) {
        console.error('Lỗi khi gửi email kích hoạt:', emailError);
        throw new InternalServerErrorException('Đăng ký thành công nhưng không thể gửi email kích hoạt. Vui lòng thử lại sau.');
      }

      // Trả phản hồi
      return {
        id: storeOwner.id,
        message: 'Tài khoản cửa hàng đã được tạo thành công! Kiểm tra email của bạn để kích hoạt tài khoản.',
      };
    } catch (error) {
      console.error('Lỗi khi đăng ký tài khoản Store Owner:', error);

      // Xử lý lỗi không mong muốn
      throw error instanceof BadRequestException || error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký tài khoản. Vui lòng thử lại sau.');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password, accountType } = registerDto;

    try {
      // Kiểm tra email đã tồn tại chưa
      const isEmailExist = await this.isEmailExist(email, accountType);
      if (isEmailExist) {
        throw new BadRequestException(`Email ${email} đã tồn tại! Vui lòng sử dụng email khác.`);
      }

      // Băm mật khẩu
      const hashedPassword = await hashPasswordHelper(password);

      // Tạo mã kích hoạt
      const activationCode = randomInt(0, 1000000).toString().padStart(6, '0');

      // Xác định vai trò và trạng thái kích hoạt dựa trên số lượng người dùng hiện tại
      const userCount = await this.userRepository.count();
      const roleName = userCount === 0 ? 'ADMIN_GLOBAL' : 'CUSTOMER';
      const isActive = userCount === 0;

      // Tìm vai trò trong cơ sở dữ liệu
      const role = await this.roleService.findOneByName(roleName);
      if (!role) {
        throw new InternalServerErrorException(`Vai trò ${roleName} không tồn tại. Vui lòng tạo vai trò này trong hệ thống.`);
      }

      // Tạo người dùng mới
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        isActive,
        roles: [role],
        accountType: AccountType.LOCAL,
      });

      await this.userRepository.save(user);

      await this.redisService.set(`user:${user.id}:verifyCode`, JSON.stringify(activationCode), 60 * 5)
      // Gửi email kích hoạt
      try {
        this.mailerService.sendMail({
          to: user.email,
          subject: 'Kích hoạt tài khoản của bạn',
          template: 'register',
          context: {
            name: user.name || user.email,
            activationCode,
          },
          attachments: [
            {
              filename: 'logo.png', // Tên file đính kèm
              path: path.resolve(__dirname, '../config/mail/logo/logo.png'), // Đường dẫn tới hình ảnh trên máy chủ
              cid: 'uniqueLogoCid', // Content-ID, dùng để tham chiếu trong email
            },
          ],
        });
      } catch (emailError) {
        console.error('Lỗi khi gửi email kích hoạt:', emailError);
        throw new InternalServerErrorException('Đăng ký thành công nhưng không thể gửi email kích hoạt. Vui lòng thử lại sau.');
      }

      // Trả phản hồi
      return {
        id: user.id,
        message: 'Tài khoản đã được tạo thành công! Kiểm tra email của bạn để kích hoạt tài khoản.',
      };
    } catch (error) {
      console.error('Lỗi khi đăng ký tài khoản:', error);

      // Xử lý lỗi không mong muốn
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký tài khoản. Vui lòng thử lại.');
    }
  }

  // async sendVerificationCodeToEmail(_id: string){
  //   const user = await this.userRepository.findOne({ where: { _id } });
  //   if (!user) {
  //     throw new BadRequestException('Người dùng không tồn tại trong hệ thống!');
  // }
  // const verificationCode = randomInt(0, 1000000).toString().padStart(6, '0');

  // }

  async handleActive(data: CodeAuthDto) {
    try {
      // Tìm người dùng theo ID
      const user = await this.userRepository.findOne({
        where: { id: data.id },
      });

      if (!user) {
        throw new BadRequestException('Code không hợp lệ hoặc người dùng không tồn tại!');
      }

      // Nếu code không khớp, kiểm tra Redis
      const verifyCode = await this.redisService.get(`user:${user.email}:verifyCode`);
      if (!verifyCode) {
        throw new BadRequestException('Mã xác thực đã hết hạn hoặc không tồn tại.');
      }

      if (verifyCode !== data.code) {
        throw new BadRequestException('Mã xác thực không đúng.');
      }

      // Kích hoạt tài khoản nếu code từ Redis đúng
      user.isActive = true;
      await this.userRepository.save(user);

      // Xóa code trong Redis sau khi sử dụng
      await this.redisService.delete(`user:${user.email}:verifyCode`);

      return { message: 'Tài khoản đã được kích hoạt thành công!', isCodeExpired: false };
    } catch (error) {
      console.error('Lỗi khi kích hoạt tài khoản:', error);
      throw new BadRequestException('Đã xảy ra lỗi khi kích hoạt tài khoản. Vui lòng thử lại!');
    }
  }

  async updateRoleEmployee(request: updateUserRoleRequest) {
    try {
      // Kiểm tra xem vai trò có tồn tại không
      const roles = await Promise.all(
        request.roleId.map(async (id) => {
          const role = await this.roleService.findOneById(id);
          if (!role) {
            throw new BadRequestException(`Vai trò với ID "${id}" không tồn tại.`);
          }
          return role;
        })
      );

      // Tìm nhân viên dựa trên ID
      const employee = await this.findById(request.id);
      if (!employee) {
        throw new BadRequestException(`Nhân viên với ID "${request.id}" không tồn tại.`);
      }

      // Gán vai trò mới
      employee.roles = roles;

      // Lưu thay đổi
      const updatedEmployee = await this.userRepository.save(employee);

      // Trả về thông tin nhân viên đã cập nhật
      return plainToClass(UserDTO, updatedEmployee);
    } catch (error) {
      console.error('Lỗi khi cập nhật vai trò nhân viên:', error);

      // Xử lý lỗi không mong muốn
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi khi cập nhật vai trò nhân viên. Vui lòng thử lại!'
      );
    }
  }
}

