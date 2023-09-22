import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';


export class TaskDto {
    @ApiProperty({
        description: "Task Name",
        type: String,
        example: "Task 1"
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "Task Description",
        type: String,
        example: "Task 1 Description"
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Task assignee email",
        type: String,
        example: "johndoe2@email.com"

    })
    @IsEmail()
    @IsNotEmpty()
    assignedEmail: string;

    @ApiProperty({
        description: "Task Due Date",
        type: Date,
        example: "2023-11-28"
    })
    @IsString()
    @IsNotEmpty()
    dueDate: Date;

    @ApiProperty({
        description: "Task Start Date",
        type: Date,
        example: "2023-11-25"
    })
    @IsString()
    @IsNotEmpty()
    startDate: Date;

}


export class TaskUpdateDtoByAssignee {
    @ApiProperty({
        description: "Task Name",
        type: String,
        example: "Task 1"
    })
    name: string;

    @ApiProperty({
        description: "Task Description",
        type: String,
        example: "Task 1 Description"
    })
    description: string;

}

export class TaskDtoUpdateByOwner {
    @ApiProperty({
        description: "Task Name",
        type: String,
        example: "Task 1"
    })
    name: string;

    @ApiProperty({
        description: "Task Description",
        type: String,
        example: "Task 1 Description"
    })
    description: string;

    @ApiProperty({
        description: "Task assignee email",
        type: String,
        example: "johndoe2@email.com"
    })
    assignedEmail: string;

    @ApiProperty({
        description: "Task Due Date",
        type: Date,
        example: "2023-11-28"
    })
    dueDate: Date;

    @ApiProperty({
        description: "Task Start Date",
        type: Date,
        example: "2023-11-25"
    })
    startDate: Date;

}
