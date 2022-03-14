import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import {
    EmailValidator, GetEmailCode, CheckEmailCode, ChangeEmail
} from '../../validators/user/emailValidator';
import Auth from '../../../middlewares/auth';
const router = new Router({
    prefix: '/api/user',
});

router.get('/email/:userId', async (ctx) => {
    const { userId } = ctx.params;
    const email = await EmailValidator(userId);

    success({
        email,
    });
});

router.patch('/email', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const { email } = ctx.request.body;
    await ChangeEmail(email, id);

    success();
});

router.post('/email_code', async (ctx) => {
    const { email } = ctx.request.body;
    await GetEmailCode(email);

    success("成功发送验证码");
});

router.post('/check_email_code', async (ctx) => {
    const { email, code } = ctx.request.body;
    await CheckEmailCode(email, code);

    success();
});

module.exports = router;