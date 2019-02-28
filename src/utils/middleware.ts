import DB from './db';
import Config from './config';
import * as Koa from 'koa';
import { HttpError, HttpStatusCode } from './httperror';
import {logger} from './logger'

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
            ctx.body = {
                type: err.type,
                message: err.message
            }
        } else {
            ctx.status = HttpStatusCode.InternalError
            logger.error("unexpected error: ", err)
        }
    }
}

export {
    configMiddleware,
    httpErrorMiddleware
}