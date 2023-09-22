import {BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique, } from 'sequelize-typescript';
import { Project, Status } from '../../Project/model/project.schema';



@Table({timestamps: true})
export class Task extends Model {

    @Unique
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    // @BeforeCreate
    // static addId(instance: Task) {
    //     instance.id = nanoid();
    // }

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.STRING})
    description: string;

    @Column({type: DataType.STRING, defaultValue: Status.PENDING})
    status: Status;

    @Column({type: DataType.STRING})
    assignedId: string;

    @Column({type: DataType.STRING})
    assignedName: string;

    @Column({type: DataType.STRING})
    assignedEmail: string;

    @ForeignKey(() => Project)
    @Column({type: DataType.UUID, allowNull: false})
    projectId: string;

    @BelongsTo(() => Project, {
        foreignKey: {name: 'projectId', allowNull: false},
    })
    project: Project;

    @Column({type: DataType.DATE})
    startDate: Date;

    @Column({type: DataType.DATE})
    dueDate: Date;

}
