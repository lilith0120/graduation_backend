import * as Koa from 'koa';
import * as parser from 'koa-bodyparser';
import InitManager from './core/init';
import catchError from './middlewares/exception';

import './app/modules/baseStage';
import './app/modules/file';
import './app/modules/profession';
import './app/modules/stage';
import './app/modules/student';
import './app/modules/teacher';
import './app/modules/user';

const app = new Koa();
app.use(catchError);
app.use(parser());
InitManager.initCore(app);

app.listen(8000);