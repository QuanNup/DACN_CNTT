import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './modules/redis/redis.module';
import { RedisService } from './state/service/redis.service';
import { UsersModule } from './modules/management/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/management/role/roles.module';
import { UserEntity } from './modules/management/users/entities/user.entities';
import { RoleEntity } from './modules/management/role/entity/roles.entity';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    AuthModule,
    RedisModule,
    RolesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //entities: ["dist/**/*.entity{.ts,.js}"],
      entities: [UserEntity, RoleEntity],
      synchronize: true,
      extra: {
        trustServerCertificate: true,
      }
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"QQ e-commerce" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/config/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Trỏ tới thư mục lưu file
      serveRoot: '/uploads', // Đường dẫn truy cập file
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard
    // }
  ],
  exports: [RedisService]
})
export class AppModule { }
