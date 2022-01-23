import * as Router from 'koa-router';
import { UserAddValidator, OAuthValidator } from '../../../app/validators';
import { success } from '../../../lib/helper';
import User from '../../modules/user';
import { generateToken } from '../../../core/util';
import QQManager from '../../../app/services/qq';
const router = new Router({
    prefix: '/api/user',
});

router.post('/login', async (ctx) => {
    const { code = '' } = ctx.request.query
    const { token, userMessage } = await QQManager.getOpenId(code);

    success({
        token,
        userMessage,
    });
});

router.post('/add', async (ctx) => {
    const { data } = ctx.request.body;
    const body = await UserAddValidator(data);
    await User.bulkCreate(body);

    success();
});

router.post('/oauth', async (ctx) => {
    const user = await OAuthValidator(ctx.request.body);
    const token = generateToken(user.id, user.user_type);

    success({
        token
    });
});

module.exports = router;
