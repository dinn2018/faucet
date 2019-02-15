import DB from './db';
import Config from './config';
import * as Koa from 'koa';
import { HttpError } from './httperror';

let config = new Config()
let db = new DB().init()

let configMiddleware = async (ctx: Koa.ParameterizedContext<any, {}>, next: () => Promise<any>) => {
    ctx.db = await db
    ctx.config = config
    await next()
}

let httpErrorMiddleware = async (ctx: Koa.ParameterizedContext<any, {}>, next: () => Promise<any>) => {
    try {
        await next()
    } catch (err) {
        if (err instanceof HttpError) {
            ctx.status = err.statusCode
        }
        console.log(err)
    }
}

export {
    configMiddleware,
    httpErrorMiddleware
}