import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetTeacherMessage, GetAllTeacher } from '../../validators/teacher/messageValidator';
const router = new Router({
    prefix: '/api/teacher',
});

router.get('/', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const teacher = await GetTeacherMessage(id);

    success({ ...teacher.toJSON() });
});

router.get('/all', new Auth().verify, async (ctx) => {
    const { size, current, search } = ctx.request.body;
    const teachers = await GetAllTeacher(size, current, search);

    success({
        totalNum: teachers.length,
        teachers,
    });
});

module.exports = router;