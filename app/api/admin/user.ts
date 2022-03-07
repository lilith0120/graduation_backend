import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    DeleteStudents, GetStudentMessage, UpdateStudentMessage, GetTeacherMessage, UpdateTeacherMessage
} from '../../validators/admin/userValidator';
const router = new Router({
    prefix: '/api/admin',
});

router.delete('/delete_student', new Auth().verify, async (ctx) => {
    const { students } = ctx.request.body;
    await DeleteStudents(students);

    success();
});

router.get('/show_student/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;
    const student = await GetStudentMessage(id);

    success({ ...student.toJSON() });
});

router.patch('/edit_student/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;
    const { form } = ctx.request.body;
    await UpdateStudentMessage(id, form);

    success();
});

router.get('/show_teacher/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;
    const teacher = await GetTeacherMessage(id);

    success({ ...teacher.toJSON() });
});

router.patch('/edit_teacher/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;
    const { form } = ctx.request.body;
    await UpdateTeacherMessage(id, form);

    success();
});

module.exports = router;