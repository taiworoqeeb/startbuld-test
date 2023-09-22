import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayload } from "../dto/user.dto";
import { UserService } from "../user.service";
import * as dotenv from "dotenv";
import { User } from "../model/user.schema";
dotenv.config();

@Injectable()
export class Passport extends PassportStrategy(Strategy){
    constructor( private service: UserService){
        super({
            secretOrKey: process.env.JWT_SECRET as string,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: UserPayload): Promise<User>{
        // console.log(payload.user)
    const user = await this.service.userModel.findOne({
        where:{
            id: payload.user.id
        }
    })
    // console.log(user)
    if(!user){
        return null
    }
    return user;
}
}

