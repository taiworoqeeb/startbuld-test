import {BeforeCreate, Column, DataType, HasMany, Model, PrimaryKey, Table, Unique, } from 'sequelize-typescript';
import { Task } from '../../Task/model/task.schema';

export enum Status {
    PENDING = 'pending',
    INPROGRESS = 'inprogress',
    COMPLETED = 'completed'
}

@Table({timestamps: true})
export class Project extends Model {

    @Unique
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    // @BeforeCreate
    // static addId(instance: Project) {
    //     instance.id = nanoid();
    // }

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.STRING, defaultValue: Status.PENDING})
    status: Status;

    @Column({type: DataType.STRING, allowNull: false})
    ownerId: string;

    @Column({type: DataType.STRING, allowNull: false})
    ownerName: string;

    @Column({type: DataType.STRING, allowNull: false})
    ownerEmail: string;

    @HasMany(() => Task, {
        foreignKey: 'projectId',
    })
    tasks: Task[];

}
