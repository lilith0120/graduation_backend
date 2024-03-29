import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetAllStudent, GetStudentMessage, GetFileList
} from '../../validators/teacher/studentValidator';
const router = new Router({
    prefix: '/api/teacher',
});

router.post('/all_student', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const students = await GetAllStudent(id, ctx.request.body);

    success({ ...students })
});

router.get('/show_student/:studentId', new Auth(1).verify, async (ctx) => {
    const { studentId } = ctx.params;
    const student = await GetStudentMessage(studentId);

    success({ ...student.toJSON() });
});

router.get('/file_list/:studentId', new Auth(1).verify, async (ctx) => {
    const { studentId } = ctx.params;
    const fileList = await GetFileList(studentId);

    success({
        fileList,
    });
});

module.exports = router;