import {BeforeCreate, Column, DataType, Model, PrimaryKey, Table, Unique, } from 'sequelize-typescript';
import { Request } from 'express';

export interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface CustomRequest extends Request {
    user?: UserInterface;
}

@Table({timestamps: true})
export class User extends Model {

    @Unique
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    // @BeforeCreate
    // static addId(instance: User) {
    //     instance.id = nanoid();
    // }

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

}

