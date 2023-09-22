import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { Status } from '../model/project.schema';

export class ProjectDto{
    @ApiProperty({
        type: String,
        description: 'The name of the project',
        default: 'Project Name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        description: 'The description of the project',
        default: 'Project Description',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    // @ApiProperty({
    //     type: String,
    //     description: 'Owner Id of the project',
    // })
    // @IsString()
    // @IsNotEmpty()
    // ownerId: string;

    // @ApiProperty({
    //     type: String,
    //     description: 'Owner Name of the project',
    // })
    // @IsString()
    // @IsNotEmpty()
    // ownerName: string;

    // @ApiProperty({
    //     type: String,
    //     description: 'Owner Email of the project',
    // })
    // @IsString()
    // @IsNotEmpty()
    // ownerEmail: string;



}

export class ProjectUpdateStatusDto{
    @ApiProperty({
        type: String,
        description: 'The status of the project',
        enum: Status,
        default: 'PENDING',
    })
    @IsString()
    @IsNotEmpty()
    status: Status;
}
