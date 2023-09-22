import {config} from 'dotenv'
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Inject, Injectable } from '@nestjs/common';
config()

const responseHandler = ({status, statusCode, message, data}) => {
    return {
        status,
        statusCode,
        message,
        data
    }
}

@Injectable()
class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    saveToCache = async (body: any, id: any) => {
        await this.cacheManager.set(id.toString(), body, 86400)
    }

    getFromCache = async (id: any): Promise<any> => {
        return await this.cacheManager.get<{name: string}>(id.toString())
    }

    deleteFromCache = async (id: any) => {
        await this.cacheManager.del(id.toString())
    }

}




export{
    responseHandler,
    CacheService
}
