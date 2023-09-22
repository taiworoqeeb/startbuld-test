import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';


export class UserDto {
    @ApiProperty({
        type: String,
        description: 'The name of the user',
        default: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        description: 'The email of the user',
        default: 'johndoe@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: String,
        description: 'The password of the user',
        default: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'The email of the user',
        default: 'johndoe@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: String,
        description: 'The password of the user',
        default: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}


export interface UserPayload{
    user: {
        id: string
        name: string
        email: string
        password: string
        createdAt: Date
        updatedAt: Date
    }

}

export class notificationDto {
    id: string;
    title: string;
    message: string;
    userId: string;
    type: string;
    typeId: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
