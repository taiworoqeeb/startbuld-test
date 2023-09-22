import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Task } from './Task/model/task.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './Notification/model/notification.schema';
import { Op } from 'sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AppService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject('USER_SERVICE') private readonly client: ClientProxy
  ){}

  @Cron('0 0 10 * * *')
  async checkDueDate() {
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    const today = new Date();
    const tasks = await this.taskModel.findAll({
      where: {
          [Op.or]: [
            {dueDate: {[Op.eq]: tomorrow}},
            {dueDate: {[Op.eq]: today}}
          ]
      },
    });

    if(tasks.length > 0) {

      const notifications = tasks.map(task => ({
        title: 'Task Due Date',
        message: `Task ${task.name} is due soon by ${task.dueDate.toUTCString()}`,
        userId: task.assignedId,
        type: 'task',
        typeId: task.id,
      }));

      await this.notificationModel.bulkCreate(notifications);

      await firstValueFrom(this.client.send({cmd: 'task_due'}, JSON.stringify(notifications)));

    }

  }

}
