import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './model/notification.schema';
import { responseHandler } from '../utils';
import { ProjectService } from '../Project/project.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { addNotificationDto } from './dto/notification.dto';



@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification)
        private notificationModel: typeof Notification,
        @Inject(ProjectService)
        private projectService: ProjectService,
        @Inject('USER_SERVICE')
        private client: ClientProxy
    ){}

    async createNotification(body: addNotificationDto){
        let newNotification = new this.notificationModel({
            title: body.title,
            userId: body.userId,
            message: body.message,
            type: body.type,
            typeId: body.typeId
        })

        newNotification = await newNotification.save()

        await firstValueFrom(this.client.send({cmd: 'notify_user'}, JSON.stringify(newNotification)))

        return responseHandler({
            statusCode: HttpStatus.OK,
            message: 'Notification created successfully',
            status: true,
            data: newNotification
        })
    }

    async getNotifications(userId: string){
        const user: any = await this.projectService.getUser(userId)
        if(user.status === true){
            const notifications = await this.notificationModel.findAll({where: {userId: userId}})

            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Notifications fetched successfully',
                status: true,
                data: notifications
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async getNotificationById(userId: string, id: string){
        const user: any = await this.projectService.getUser(userId)
        if(user.status === true){
            const notification = await this.notificationModel.findOne({where: {id: id, userId: userId}})

            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Notification fetched successfully',
                status: true,
                data: notification
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async updateNotificationStatus(userId: string, id: string, read: boolean){
        const user: any = await this.projectService.getUser(userId)
        if(user.status === true){
            const notification = await this.notificationModel.findOne({where: {id: id, userId: userId}})
            if(notification){
                notification.read = read
                await notification.save()
                return responseHandler({
                    statusCode: HttpStatus.OK,
                    message: 'Notification updated successfully',
                    status: true,
                    data: notification
                })
            }else{
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Notification does not exist',
                    status: false,
                    data: {}
                })
            }
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async deleteNotification(userId: string, id: string){
        const user: any = await this.projectService.getUser(userId)
        if(user.status === true){
            const notification = await this.notificationModel.findOne({where: {id: id, userId: userId}})
            if(notification){
                await notification.destroy()
                return responseHandler({
                    statusCode: HttpStatus.OK,
                    message: 'Notification deleted successfully',
                    status: true,
                    data: {}
                })
            }else{
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Notification does not exist',
                    status: false,
                    data: {}
                })
            }
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async deleteNotifications(userId: string){
        const user: any = await this.projectService.getUser(userId)
        if(user.status === true){
            await this.notificationModel.destroy({where: {userId: userId}})
            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Notifications deleted successfully',
                status: true,
                data: {}
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }


}

