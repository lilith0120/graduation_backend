import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetAllStudent } from '../../validators/teacher/studentValidator';
const router = new Router({
    prefix: '/api/teacher',
});

router.get('/all_student', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const students = await GetAllStudent(id, ctx.request.body);

    success({
        totalNum: students.length,
        students,
    })
});

module.exports = router;