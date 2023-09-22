import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Task } from './Task/model/task.schema';
import { ProjectModule } from './Project/project.module';
import { Project } from './Project/model/project.schema';
import { TaskModule } from './Task/task.module';
import { NotificationModule } from './Notification/notification.module';
import { Notification } from './Notification/model/notification.schema';
import { ScheduleModule } from '@nestjs/schedule';
dotenv.config();
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri: `postgres://${username}:${password}@${host}/starbuldProject`,
      logging: false,
      synchronize: true,
      autoLoadModels: true,
      models: [Task, Project, Notification],
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL as string],
            queue: 'user_queue',
            queueOptions: {
              durable: false
            },
          },
        }),
      }
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        url: process.env.REDIS_URL as string,
      })

    }), ConfigModule.forRoot(), ProjectModule, TaskModule, NotificationModule, ScheduleModule.forRoot(), SequelizeModule.forFeature([Notification, Task, Project]),
  ],

})
export class AppModule {}
