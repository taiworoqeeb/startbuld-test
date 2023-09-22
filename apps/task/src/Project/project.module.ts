import { Module} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Project } from './model/project.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Task } from '../Task/model/task.schema';
import { TaskModule } from '../Task/task.module';
dotenv.config();

@Module({
    imports: [
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
        ConfigModule.forRoot(), SequelizeModule.forFeature([Project, Task])
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService] // this is for injecting the service in other modules
})

export class ProjectModule {}
