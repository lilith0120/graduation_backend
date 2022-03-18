import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetTeacherMessage, GetAllTeacher,
    GetProcessMessage, GetStudentNum, GetProgressDetail
} from '../../validators/teacher/messageValidator';
const router = new Router({
    prefix: '/api/teacher',
});

router.get('/', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const teacher = await GetTeacherMessage(id);

    success({ ...teacher.toJSON() });
});

router.post('/all', new Auth(1).verify, async (ctx) => {
    const { size, current, search } = ctx.request.body;
    const teachers = await GetAllTeacher(size, current, search);

    success({
        totalNum: teachers.length,
        teachers,
    });
});

router.get('/progress', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const progress = await GetProcessMessage(id);
    const studentNum = await GetStudentNum(id);

    success({
        studentNum,
        progress,
    });
});

router.get('/progress_detail/:stageId', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const { stageId } = ctx.params;
    const progressDetail = await GetProgressDetail(id, stageId);

    success({
        progressDetail,
    });
});

module.exports = router;