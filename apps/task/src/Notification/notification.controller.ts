import { Controller, Get, Req, Res, Next, Body, Param, Query, Put, Post, Delete, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import {Request, Response, NextFunction} from 'express';
import { logger } from '../utils/logger';
import { NotificationService } from './notification.service';
import { readNotificationDto } from './dto/notification.dto';
import { errorMessageHandler } from '../utils/error';


@ApiTags('NOTIFICATION')
@Controller('user/:userId/notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get('fetch-all')
    async fetchNotifications(@Param('userId') userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.notificationService.getNotifications(userId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Get(':notificationId/fetch')
    async fetchNotification(@Param('userId') userId: string, @Param('notificationId') notificationId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.notificationService.getNotificationById(userId, notificationId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Put(':notificationId/update-status')
    @ApiQuery({
        description: "Update Notification Status",
        type: readNotificationDto
    })
    async updateNotificationStatus(@Param('userId') userId: string, @Param('notificationId') notificationId: string, @Query("read") read: boolean, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.notificationService.updateNotificationStatus(userId, notificationId, read)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Delete(':notificationId/delete')
    async deleteNotification(@Param('userId') userId: string, @Param('notificationId') notificationId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.notificationService.deleteNotification(userId, notificationId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Delete('delete-all')
    async deleteAllNotifications(@Param('userId') userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.notificationService.deleteNotifications(userId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }
}
