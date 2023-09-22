import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Task } from './model/task.schema';
import { Project } from '../Project/model/project.schema';
import { ProjectModule } from '../Project/project.module';
import { NotificationModule } from '../Notification/notification.module';

dotenv.config();

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL as string,
    }), ConfigModule.forRoot(), SequelizeModule.forFeature([Task, Project]), ProjectModule, NotificationModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
