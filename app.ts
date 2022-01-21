import * as Koa from 'koa';
import * as parser from 'koa-bodyparser';
import InitManager from './core/init';
import catchError from './middlewares/exception';

const app = new Koa();
app.use(catchError);
app.use(parser());
InitManager.initCore(app);

app.listen(8000);