import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetTeacherMessage } from '../../validators/teacher/messageValidator';
const router = new Router({
    prefix: '/api/teacher',
});

router.get('/', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const teacher = await GetTeacherMessage(id);

    success({ ...teacher.toJSON() });
});

module.exports = router;