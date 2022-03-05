import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetStudentMessage } from '../../validators/student/messageValidator';
const router = new Router({
    prefix: '/api/student',
});

router.get('/', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const student = await GetStudentMessage(id);

    success({ ...student.toJSON() });
});

module.exports = router;