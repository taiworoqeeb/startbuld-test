import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { User } from './model/user.schema';
import { UserDto } from './dto/user.dto';
import { CacheService, responseHandler } from 'apps/user/utils';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import * as jwt from 'jsonwebtoken';
import {Op, DataType} from 'sequelize';


@Injectable()
export class UserService {
    constructor(
      @InjectModel(User)
      public userModel: typeof User,
      @Inject(CacheService)
      public cache: CacheService
    ){}

    async registerUser(user: UserDto): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      const checkUser = await this.userModel.findOne({where: {email: user.email}});

      if(checkUser){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User already exists',
          status: false,
          data: {}
        })
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      let newUser = new this.userModel({
        name: user.name,
        email: user.email,
        password: hashedPassword
      })

      newUser =  await newUser.save();

      delete newUser.password;
      // newUser.password = null;

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'User created successfully',
        status: true,
        data: newUser
      })

    }

    async loginUser(user: UserDto): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      let checkUser = await this.userModel.findOne({where: {email: user.email}});

      if(!checkUser){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
          status: false,
          data: {}
        })
      }

      const validPassword = await bcrypt.compare(user.password, checkUser.password);

      if(!validPassword){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid password',
          status: false,
          data: {}
        })
      }
      const payload = {
          user:{
              id: checkUser.id,
              name: checkUser.name,
              email: checkUser.email,
              password: checkUser.password,
              createdAt: checkUser.createdAt,
              updatedAt: checkUser.updatedAt
          }
      }
      delete checkUser.password;
      const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});

      const userData ={
        id: checkUser.id,
        name: checkUser.name,
        email: checkUser.email,
        createdAt: checkUser.createdAt,
        updatedAt: checkUser.updatedAt,
        token
      }

      await this.cache.saveToCache(userData, checkUser.id)

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        status: true,
        data: userData
      })
    }

    async getUser(id: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
      let user: any;
      if(!regexExp.test(id)){
        user = await this.userModel.findOne({where: {
            email: id
        }, attributes: {exclude: ['password']}},);
      }else{
        user = await this.userModel.findOne({where: {
            id
        }, attributes: {exclude: ['password']}},);
      }

      if(!user){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
          status: false,
          data: {}
        })
      }

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'User found',
        status: true,
        data: user
      })
    }

    async getUsers(): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      const users = await this.userModel.findAll({attributes: {exclude: ['password']}});

      if(!users){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No users found',
          status: false,
          data: {}
        })
      }

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'Users found',
        status: true,
        data: users
      })
    }

    async updateUser(id: string, user: UserDto): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      const checkUser = await this.userModel.findOne({where: {id}});

      if(!checkUser){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
          status: false,
          data: {}
        })
      }

      if(user.password){
        delete user.password;
      }

      if(user.email){
        delete user.email;
      }


      const updatedUser = await this.userModel.update({
        name: user.name,
      }, {where: {id}});

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        status: true,
        data: updatedUser
      })
    }

    async deleteUser(id: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      const checkUser = await this.userModel.findOne({where: {id}});

      if(!checkUser){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
          status: false,
          data: {}
        })
      }

      const deletedUser = await this.userModel.destroy({where: {id}});

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        status: true,
        data: deletedUser
      })
    }

    async logoutUser(id: string): Promise<{statusCode: number, message: string, status: boolean, data: object}>{
      const checkUser = await this.userModel.findOne({where: {id: id}});

      if(!checkUser){
        return responseHandler({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
          status: false,
          data: {}
        })
      }

      await this.cache.deleteFromCache(id)

      return responseHandler({
        statusCode: HttpStatus.OK,
        message: 'User logged out successfully',
        status: true,
        data: {}
      })
    }


}

