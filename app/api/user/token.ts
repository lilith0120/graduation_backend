import * as Router from 'koa-router';
import { UserLoginValidator } from '../../../app/validators/loginValidator';
import { UserAddValidator } from '../../../app/validators/userAddValidator';
import { success } from '../../../lib/helper';
import User from '../../modules/user';
import { generateToken } from '../../../core/util';
const router = new Router({
    prefix: '/api/user',
});

router.post('/login', async (ctx) => {
    const user = await UserLoginValidator(ctx.request.body);
    const token = generateToken(user.id, user.user_type);

    success({
        token,
        uid: user.id,
    });
});

router.post('/add', async (ctx) => {
    const { data } = ctx.request.body;
    const body = await UserAddValidator(data);
    await User.bulkCreate(body);

    success();
});

module.exports = router;
