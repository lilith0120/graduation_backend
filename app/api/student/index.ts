import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetStudentMessage, GetAllStudent } from '../../validators/student/messageValidator';
const router = new Router({
    prefix: '/api/student',
});

router.get('/', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const student = await GetStudentMessage(id);

    success({ ...student.toJSON() });
});

router.get('/all', new Auth().verify, async (ctx) => {
    const { size, current, search } = ctx.request.body;
    const students = await GetAllStudent(size, current, search);

    success({
        totalNum: students.length,
        students,
    });
});

// 先不做这个接口
// router.post('/add_all', new Auth().verify, async (ctx) => {
//     const { studens } = ctx.request.body;
// });

module.exports = router;