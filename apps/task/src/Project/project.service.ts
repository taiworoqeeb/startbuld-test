import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { Project, Status } from './model/project.schema';
import { InjectModel } from '@nestjs/sequelize';
import { responseHandler } from '../utils';
import { ProjectDto } from './dto/project.dto';
import {ClientProxy} from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs';
import { Task } from '../Task/model/task.schema';

@Injectable()
export class ProjectService {
        constructor(
            @InjectModel(Project)
            public projectModel: typeof Project,
            @Inject('USER_SERVICE')
            private client: ClientProxy,
            @InjectModel(Task)
            private taskModel: typeof Task

        ){}

    async getUser(id: string): Promise<any>{
        const result: any = await firstValueFrom(this.client.send({cmd: 'fetch_user'}, id))
        return {
            statusCode: result.statusCode,
            message: result.message,
            status: result.status,
            data: result.data
        }
    }

    async getUserByEmail(email: string): Promise<any>{
        const result: any = await firstValueFrom(this.client.send({cmd: 'fetch_user_by_email'}, email))
        return {
            statusCode: result.statusCode,
            message: result.message,
            status: result.status,
            data: result.data
        }
    }

    async createProject(project: ProjectDto, id: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        let user: any = await this.getUser(id);
        if(user.status === true){
            user = user.data;
            const checkProject = await this.projectModel.findOne({where: {name: project.name, ownerId: user.id}});
            if(checkProject){
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Project already exists',
                    status: false,
                    data: {}
                })
            }

            let newProject = new this.projectModel({
                name: project.name,
                description: project.description,
                ownerId: user.id,
                ownerName: user.name,
                ownerEmail: user.email
            })

            newProject = await newProject.save();

            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Project created successfully',
                status: true,
                data: newProject
            })
        }else{
            return responseHandler({
                ...user
            })
        }

    }

    async getProjects(id: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        let user: any = await this.getUser(id);
        if(user.status === true){
            user = user.data;
            const projects = await this.projectModel.findAll({where: {ownerId: user.id}, include:[{model: this.taskModel, as: 'tasks'}]});
            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Projects fetched successfully',
                status: true,
                data: projects
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async getProjectByOwner(id: string, projectId: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        let user: any = await this.getUser(id);
        if(user.status === true){
            user = user.data;
            const project = await this.projectModel.findOne({where: {id: projectId, ownerId: user.id}, include:[{model: this.taskModel, as: 'tasks'}]});
            if(!project){
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Project not found',
                    status: false,
                    data: {}
                })
            }
            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Project fetched successfully',
                status: true,
                data: project
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async getProjectById(projectId: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        const project = await this.projectModel.findOne({where: {id: projectId},
            include:[
            {model: this.taskModel, as: 'tasks'}
        ]
        },);
        if(!project){
            return responseHandler({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Project not found',
                status: false,
                data: {}
            })
        }
        return responseHandler({
            statusCode: HttpStatus.OK,
            message: 'Project fetched successfully',
            status: true,
            data: project
        })
    }

    async updateProject(id: string, projectId: string, project: ProjectDto): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        let user: any = await this.getUser(id);
        if(user.status === true){
            user = user.data;
            const checkProject = await this.projectModel.findOne({where: {id: projectId, ownerId: user.id}});
            if(!checkProject){
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Project not found',
                    status: false,
                    data: {}
                })
            }

            checkProject.name = project.name;
            checkProject.description = project.description;

            await checkProject.save();

            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Project updated successfully',
                status: true,
                data: checkProject
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    async deleteProject(id: string, projectId: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        let user: any = await this.getUser(id);
        if(user.status === true){
            user = user.data;
            const checkProject = await this.projectModel.findOne({where: {id: projectId, ownerId: user.id}});
            if(!checkProject){
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Project not found',
                    status: false,
                    data: {}
                })
            }

            await this.taskModel.destroy({where: {projectId: checkProject.id}});
            await checkProject.destroy();


            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Project deleted successfully',
                status: true,
                data: {}
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }

    // async deleteProjects(id: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
    //     let user: any = await this.getUser(id);
    //     if(user.status === true){
    //         user = user.data;
    //         await this.projectModel.destroy({where: {ownerId: user.id}});

    //         return responseHandler({
    //             statusCode: HttpStatus.OK,
    //             message: 'Projects deleted successfully',
    //             status: true,
    //             data: {}
    //         })
    //     }else{
    //         return responseHandler({
    //             ...user
    //         })
    //     }
    // }

    async updateProjectStatus(id: string, projectId: string, status: Status): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
        let user: any = await this.getUser(id);
        if(user.status === true){
            user = user.data;
            const checkProject = await this.projectModel.findOne({where: {id: projectId, ownerId: user.id}});
            if(!checkProject){
                return responseHandler({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Project not found',
                    status: false,
                    data: {}
                })
            }

            checkProject.status = status;

            await checkProject.save();

            return responseHandler({
                statusCode: HttpStatus.OK,
                message: 'Project status updated successfully',
                status: true,
                data: checkProject
            })
        }else{
            return responseHandler({
                ...user
            })
        }
    }
}
