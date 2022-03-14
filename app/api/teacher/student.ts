import { GetStudentMessage } from '../../validators/teacher/studentValidator';
import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetAllStudent } from '../../validators/teacher/studentValidator';
const router = new Router({
    prefix: '/api/teacher',
});

router.post('/all_student', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const students = await GetAllStudent(id, ctx.request.body);

    success({
        totalNum: students.length,
        students,
    })
});

router.get('/show_student/:studentId', new Auth().verify, async (ctx) => {
    const { studentId } = ctx.params;
    const student = await GetStudentMessage(studentId);

    success({ ...student.toJSON() });
});

module.exports = router;