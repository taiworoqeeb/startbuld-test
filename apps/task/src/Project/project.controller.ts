import { Controller, Get, Post, Put, Req, Res, Next, Delete, Body, Query, Param, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectDto, ProjectUpdateStatusDto } from './dto/project.dto';
import {Request, Response, NextFunction} from 'express';
import { logger } from '../utils/logger';
import { Status } from './model/project.schema';
import { errorMessageHandler } from '../utils/error';

@ApiTags('PROJECT')
@Controller('user/:userId/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

    @Post('create')
    @ApiBody({
        description: "Create Project Data",
        type: ProjectDto
    })
    async createProject(@Param('userId') id: string, @Body() body: ProjectDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.createProject(body, id)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Get('fetch-all')
    async fetchProject(@Param('userId') id: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.getProjects(id)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Get(':projectId/fetch-owner')
    async getProjectByOwner(@Param('userId') userId: string, @Param('projectId') projectId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.getProjectByOwner(userId, projectId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Get(':projectId/fetch')
    async getProject(@Param('projectId') projectId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.getProjectById(projectId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Put(':projectId/update')
    @ApiBody({
        description: "Update User Project Data",
        type: ProjectDto
    })
    async updateProject(@Param('userId') userId: string, @Param('projectId') projectId: string, @Body() body: ProjectDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.updateProject(userId, projectId, body)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Put(':projectId/update-status')
    @ApiQuery({
        description: "Update User Project Status",
        type: ProjectUpdateStatusDto
    })
    async updateProjectStatus(@Param('userId') userId: string, @Param('projectId') projectId: string, @Query() status: Status, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.updateProjectStatus(userId, projectId, status)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    @Delete(':projectId/delete')
    async deleteProject(@Param('userId') userId: string, @Param('projectId') projectId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
        try {
            const result = await this.projectService.deleteProject(userId, projectId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            const message = errorMessageHandler(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
            logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
            next(error)
        }
    }

    // @Delete('delete-all/:ownerId')
    // async deleteAllProject(@Param('ownerId') id: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    //     try {
    //         const result = await this.projectService.deleteProjects(id)
    //         return res.status(result.statusCode).json(result)
    //     } catch (error) {
    //         const message = errorMessageHandler(error)
    //   res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: message, data: error})
    //         logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
    //         next(error)
    //     }
    // }



}
