import {BeforeCreate, Column, DataType, Model, PrimaryKey, Table, Unique, } from 'sequelize-typescript';



@Table({timestamps: true})
export class Notification extends Model {

    @Unique
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    // @BeforeCreate
    // static addId(instance: Notification) {
    //     instance.id = nanoid();
    // }

    @Column({type: DataType.STRING})
    title: string;

    @Column({type: DataType.STRING})
    message: string;

    @Column({type: DataType.STRING})
    userId: string;

    @Column({type: DataType.STRING})
    type: string;

    @Column({type: DataType.STRING})
    typeId: string;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    read: boolean;

}
