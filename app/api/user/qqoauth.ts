// import * as Router from 'koa-router';
// import { OAuthValidator } from '../../validators';
// import { success } from '../../../lib/helper';
// import User from '../../modules/user';
// import { generateToken } from '../../../core/util';
// import QQManager from '../../services/qq';
// const router = new Router({
//     prefix: '/api/user',
// });

// router.post('/qqlogin', async (ctx) => {
//     const { code = '' } = ctx.request.query
//     const { token, userMessage } = await QQManager.getOpenId(code);

//     success({
//         token,
//         userMessage,
//     });
// });

// router.post('/qqoauth', async (ctx) => {
//     const user = await OAuthValidator(ctx.request.body);
//     const token = generateToken(user.id, user.user_type);

//     success({
//         token
//     });
// });

// module.exports = router;
