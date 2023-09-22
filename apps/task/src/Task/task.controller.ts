import { Controller, Get, Req, Res, Next, Body, Param, Query, Put, Post, Delete, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TaskDto, TaskDtoUpdateByOwner, TaskUpdateDtoByAssignee } from './dto/task.dto';
import {Request, Response, NextFunction} from 'express';
import { logger } from '../utils/logger';
import { Status } from '../Project/model/project.schema';
import { errorMessageHandler } from '../utils/error';

@ApiTags('TASK')
@Controller('user/:userId/project/:projectId/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @ApiBody({
    description: "Create Task Data",
    type: TaskDto
  })
  async createTask(@Param("userId") userId: string, @Param("projectId") projectId: string, @Body() body: TaskDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.createTask(body, userId, projectId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Get('fetch-all-by-project-owner')
  async fetchTaskByProjectOwner(@Param("userId") userId: string, @Param("projectId") projectId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.getTasksByProjectOwner(userId, projectId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Get('fetch-all-by-project-assignee')
  async fetchTaskByProjectAssignee(@Param("userId") userId: string, @Param("projectId") projectId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.getTasksByProjectAssignee(userId, projectId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Get(':taskId/fetch')
  async fetchTask(@Param("userId") userId: string, @Param("projectId") projectId: string, @Param("taskId") taskId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.getTaskById(taskId, userId, projectId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Put(':taskId/update-by-project-assignee')
  @ApiBody({
    description: "Update Task Data",
    type: TaskUpdateDtoByAssignee
  })
  async updateTask(@Param("userId") userId: string, @Param("projectId") projectId: string, @Param("taskId") taskId: string, @Body() body: TaskUpdateDtoByAssignee, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.updateTask(userId, projectId, taskId, body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Put(':taskId/update-by-project-owner')
  @ApiBody({
    description: "Update Task Data",
    type: TaskDtoUpdateByOwner
  })
  async updateTaskByOwner(@Param("userId") userId: string, @Param("projectId") projectId: string, @Param("taskId") taskId: string, @Body() body: TaskDtoUpdateByOwner, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.updateTaskByOwner(taskId, projectId, userId, body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Put(':taskId/update-task-status')
  @ApiQuery({
    name: 'status',
    description: 'Task Status',
    enum: Status
  })
  async updateTaskStatus(@Param("userId") userId: string, @Param("projectId") projectId: string, @Param("taskId") taskId: string, @Query('status') status: Status, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.updateTaskStatus(userId, projectId, taskId, status)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }

  @Delete(':taskId/delete')
  async deleteTask(@Param("userId") userId: string, @Param("projectId") projectId: string, @Param("taskId") taskId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.taskService.deleteTask(userId, projectId, taskId)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error)
    }

  }
}
