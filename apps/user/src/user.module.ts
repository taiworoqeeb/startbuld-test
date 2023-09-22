import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './model/user.schema';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { Passport } from './middleware/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from 'apps/user/utils';

dotenv.config();
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri: `postgres://${username}:${password}@${host}/starbuldUser`,
      logging: false,
      synchronize: true,
      autoLoadModels: true,
      models: [User],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        url: process.env.REDIS_URL as string,
      })

    }),

    ConfigModule.forRoot(), SequelizeModule.forFeature([User]), PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [UserController],
  providers: [UserService, Passport, CacheService]
})
export class UserModule {}
