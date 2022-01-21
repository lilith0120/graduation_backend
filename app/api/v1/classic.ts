import * as Router from 'koa-router';
import Auth from '../../../middlewares/auth';
const router = new Router();

router.get('/v1/classic/latest', new Auth().verify, (ctx: any) => {
    ctx.body = ctx.auth.userId;
});

module.exports = router;