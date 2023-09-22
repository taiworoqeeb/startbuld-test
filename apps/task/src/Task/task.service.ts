import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './model/task.schema';
import { TaskDto, TaskDtoUpdateByOwner, TaskUpdateDtoByAssignee } from './dto/task.dto';
import { responseHandler } from '../utils';
import { ProjectService } from '../Project/project.service';
import { NotificationService } from '../Notification/notification.service';
import { Project, Status } from '../Project/model/project.schema';


@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    @InjectModel(Project)
    private projectModel: typeof Project,
    @Inject(ProjectService)
    private projectService: ProjectService,
    @Inject(NotificationService)
    private notificationService: NotificationService,

  ){}

  async createTask(body: TaskDto, ownerId: string, projectId: string){
    const user: any = await this.projectService.getUser(ownerId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectByOwner(ownerId, projectId)
      if(project.status === true){
        const assignee: any = await this.projectService.getUserByEmail(body.assignedEmail)
        if(assignee.status === true){
          let newTask = new this.taskModel({
            name: body.name,
            description: body.description,
            assignedId: assignee.data.id,
            assignedName: assignee.data.name,
            assignedEmail: assignee.data.email,
            projectId: project.data.id,
            project: project.data,
            startDate: body.startDate,
            dueDate: body.dueDate
          })

          newTask = await newTask.save()

          await this.projectModel.update({tasks: [...project.data.tasks, newTask]}, {where: {id: project.data.id}})

          await this.notificationService.createNotification({
            title: 'New Task',
            userId: assignee.data.id,
            message: `You have been assigned to a new task: ${body.name}`,
            type: 'task',
            typeId: newTask.id
          })

          return responseHandler({
            statusCode: HttpStatus.OK,
            message: 'Task created successfully',
            status: true,
            data: newTask
          })
        }else{
          return responseHandler({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Assigned user does not exist',
            status: false,
            data: {}
          })
        }
      }else{
        return responseHandler({
          ...project
        })
      }
    }else{
      return responseHandler({
        ...user
      })
    }

  }

  async getTasksByProjectOwner(ownerId: string, projectId: string){
    const user: any = await this.projectService.getUser(ownerId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectByOwner(ownerId, projectId)
      if(project.status === true){
        const tasks = await this.taskModel.findAll({where: {projectId: project.data.id}, include: [{model: Project, as: 'project'}]})
        return responseHandler({
          statusCode: HttpStatus.OK,
          message: 'Tasks fetched successfully',
          status: true,
          data: tasks
        })
      }else{
        return responseHandler({
          ...project
        })
      }
    }else{
      return responseHandler({
        ...user
      })
    }
  }

  async getTasksByProjectAssignee(userId: string, projectId: string){
    const user: any = await this.projectService.getUser(userId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectById(projectId)
      if(project.status === true){
        const checkAssigned = project.data.tasks.filter((task: any) => task.assignedId === user.data.id)
        if(checkAssigned.length === 0){
          return responseHandler({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'You are not assigned to this project',
            status: false,
            data: {}
          })
        }
        const tasks = await this.taskModel.findAll({where: {assignedId: user.data.id}, include: [{model: Project, as: 'project'}]})
        return responseHandler({
          statusCode: HttpStatus.OK,
          message: 'Tasks fetched successfully',
          status: true,
          data: tasks
        })
      }else{
        return responseHandler({
          ...project
        })
      }
    }else{
      return responseHandler({
        ...user
      })
    }
  }

  async getTaskById(taskId: string, userId: string, projectId: string){
    const user: any = await this.projectService.getUser(userId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectById(projectId)
      if(project.status === true){
        const task = await this.taskModel.findOne({where: {id: taskId, projectId: project.data.id}, include: [{model: Project, as: 'project'}]})
        if(!task){
          return responseHandler({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Task not found',
            status: false,
            data: {}
          })
        }
        return responseHandler({
          statusCode: HttpStatus.OK,
          message: 'Task fetched successfully',
          status: true,
          data: task
        })
      }else{
        return responseHandler({
          ...project
        })
      }
    }else{
      return responseHandler({
        ...user
      })
    }
  }

  async updateTask(userId: string, projectId: string, taskId: string, body: TaskUpdateDtoByAssignee){
    const user: any = await this.projectService.getUser(userId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectById(projectId)
      if(project.status === true){
        const task = await this.taskModel.findOne({where: {id: taskId, assignedId: user.data.id, projectId: project.data.id}})
        if(!task){
          return responseHandler({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Task not found/asigned to you',
            status: false,
            data: {}
          })
        }

        await task.update({...body}, {where: {id: taskId}})

        return responseHandler({
          statusCode: HttpStatus.OK,
          message: 'Task updated successfully',
          status: true,
          data: task
        })
      }else{
        return responseHandler({
          ...project
        })
      }
  }else{
    return responseHandler({
      ...user
    })
  }
}

  async updateTaskByOwner(taskId: string, projectId: string, ownerId: string, body: TaskDtoUpdateByOwner){
    const user: any = await this.projectService.getUser(ownerId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectByOwner(ownerId, projectId)
      if(!project.status){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Project not found',
          status: false,
          data: {}
        })
      }
      const task = await this.taskModel.findOne({where: {id: taskId, projectId: project.data.id}})
      if(!task){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Task not found',
          status: false,
          data: {}
        })
      }

      if(body.assignedEmail){
        const assignee: any = await this.projectService.getUserByEmail(body.assignedEmail)
        if(assignee.status === true){
          task.assignedId = assignee.data.id
          task.assignedName = assignee.data.name
          task.assignedEmail = assignee.data.email
          await task.save()
          delete body.assignedEmail
        }else{
          return responseHandler({
            ...assignee
          })
        }
      }

      await task.update({...body}, {where: {id: taskId}})

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'Task updated successfully',
        status: true,
        data: task
      })
    }else{
      return responseHandler({
        ...user
      })
    }
  }

    async updateTaskStatus(userId: string, projectId: string, taskId: string, status: Status){
      const user: any = await this.projectService.getUser(userId)
      if(user.status === true){
        const project: any = await this.projectService.getProjectById(projectId)
        if(project.status === true){
          const task = await this.taskModel.findOne({where: {id: taskId, assignedId: user.data.id, projectId: project.data.id}})
          if(!task){
            return responseHandler({
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Task not found/asigned to you',
              status: false,
              data: {}
            })
          }

          task.status = status
          await task.save()

          await this.notificationService.createNotification({
            title: 'Task Updated',
            userId: project.data.ownerId,
            message: `Task: ${task.name} has been updated to ${status}`,
            type: 'task',
            typeId: task.id
          })

          return responseHandler({
            statusCode: HttpStatus.OK,
            message: 'Task updated successfully',
            status: true,
            data: task
          })
        }else{
          return responseHandler({
            ...project
          })
        }
    }else{
      return responseHandler({
        ...user
      })
    }
  }

  async deleteTask(userId: string, taskId: string, projectId: string){
    const user: any = await this.projectService.getUser(userId)
    if(user.status === true){
      const project: any = await this.projectService.getProjectByOwner(userId, projectId)
      if(project.status === true){
        const task = await this.taskModel.findOne({where: {id: taskId, projectId: project.data.id}})
        if(!task){
          return responseHandler({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Task not found',
            status: false,
            data: {}
          })
        }

        await task.destroy()

        return responseHandler({
          statusCode: HttpStatus.OK,
          message: 'Task deleted successfully',
          status: true,
          data: {}
        })
      }else{
        return responseHandler({
          ...project
        })
      }
    }else{
      return responseHandler({
        ...user
      })
    }
  }


}
