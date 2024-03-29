import * as Koa from 'koa';
import * as cors from 'koa2-cors';
import * as parser from 'koa-bodyparser';
import * as body from 'koa-body';
import InitManager from './core/init';
import catchError from './middlewares/exception';

const app = new Koa();
app.use(cors({
    origin: (ctx) => {
        return '*'
    }
}));
app.use(catchError);
app.use(body({
    multipart: true,
    strict: false,
}));
app.use(parser());
InitManager.initCore(app);

app.listen(8000);