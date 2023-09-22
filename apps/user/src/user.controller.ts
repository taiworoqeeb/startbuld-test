import { Controller, Get, Post, Req, Res, Next, Param, UseGuards, Delete, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoginDto, UserDto, notificationDto } from './dto/user.dto';
import { logger } from 'apps/user/utils/logger';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {Ctx, EventPattern, Payload, RmqContext, MessagePattern} from "@nestjs/microservices";
import { CustomRequest } from './model/user.schema';
import { CacheService } from 'apps/user/utils';
import { errorMessageHandler } from '../utils/error';

@ApiTags('USER')
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cache: CacheService
    ) {}


  @Post('register')
  @ApiBody({
    description: "User Registration Data",
    type: UserDto
  })
  async registerUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.registerUser(req.body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Post('login')
  @ApiBody({
    description: "User Login Data",
    type: LoginDto
  })
  async loginUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.loginUser(req.body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @MessagePattern({cmd: 'fetch_user'})
  async fetchUser(@Payload() data: string): Promise<{}> {
      const user = await this.cache.getFromCache(data)
      if(!user){
        return {
          statusCode: 400,
          message: 'User not logged in',
          status: false,
          data: {}
        }
      }

      return {
        statusCode: 200,
        message: 'User found',
        status: true,
        data: user
      }

  }

  @MessagePattern({cmd: 'fetch_user_by_email'})
  async fetchUserByEmail(@Payload() data: string): Promise<{}> {
      const user = await this.userService.getUser(data)
      if(!user.status){
        return {
          statusCode: 400,
          message: 'User not found',
          status: false,
          data: {}
        }
      }
      return {
        statusCode: 200,
        message: 'User fecthed successfully',
        status: true,
        data: user.data
      }

  }

  @MessagePattern({cmd: 'notify_user'})
  async notifyUser(@Payload() data: string): Promise<void> {
    const notification: notificationDto = JSON.parse(data)
    console.log({
      title: notification.title,
      message: notification.message,
    })
    logger.info({
      title: notification.title,
      message: notification.message,
    })
    //here we can decide to push to firebase or use socker.IO or email to notify the user, i just decided to make this simple
  }

  @MessagePattern({cmd: 'task_due'})
  async taskDue(@Payload() data: string): Promise<void> {
    const notifications: notificationDto[] = JSON.parse(data)
    console.log(notifications)
    logger.info(notifications)
    //here we can decide to push to firebase or use socker.IO or email to notify the user, i just decided to make this simple
  }


  @Get(':userId/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  async getUserById(@Param('userId') userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.getUser(userId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
           const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Get('profiles')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  async getAllUsers(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.getUsers()
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Post(':userId/update')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    description: "User Update Data",
    type: UserDto.name
  })
  @ApiBearerAuth('Authorization')
  async updateUser(@Param('userId') userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.updateUser(userId, req.body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Delete(':userId/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  async deleteUser(@Param('userId') userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.deleteUser(userId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  async logoutUser(@Req() req: CustomRequest, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.userService.logoutUser(req.user.id)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }
  }
}
