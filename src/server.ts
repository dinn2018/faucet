import * as Koa from 'koa';
import * as bodyParser from "koa-bodyparser";
import * as cors from 'koa-cors'
import router from './controllers/router';
import { configMiddleware, httpErrorMiddleware } from './utils/middleware';

const convert = require('koa-convert');

const app = new Koa();
app.use(convert(bodyParser()))
    .use(convert(cors({
        origin: "*"
    })))
    .use(configMiddleware)
    .use(httpErrorMiddleware)
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);

console.log('Server running on port 3000');