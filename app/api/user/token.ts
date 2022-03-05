import * as Router from 'koa-router';
import {
    UserLoginValidator, UserMessageValidator, RewritePassword
} from '../../validators/user/loginValidator';
import { UserAddValidator } from '../../validators/user/userAddValidator';
import { success } from '../../../lib/helper';
import User from '../../modules/user';
import { generateToken } from '../../../core/util';
const router = new Router({
    prefix: '/api/user',
});

router.post('/login', async (ctx) => {
    const user = await UserLoginValidator(ctx.request.body);
    const token = generateToken(user.id, user.user_type);

    const userMessage = await UserMessageValidator(user.id, user.user_type);

    success({
        token,
        uid: user.id,
        role: user.user_type,
        userName: userMessage.name,
    });
});

router.patch('/rewrite_password', async (ctx) => {
    const { userId, userPswd } = ctx.request.body;
    await RewritePassword(userId, userPswd);

    success();
});

router.post('/add', async (ctx) => {
    const { data } = ctx.request.body;
    const body = await UserAddValidator(data);
    await User.bulkCreate(body);

    success();
});

module.exports = router;
