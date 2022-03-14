import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetStudentMessage, GetAllStudent,
    PostFileMessage, GetAllFile, GetFileMessage,
    GetProgressMessage
} from '../../validators/student/messageValidator';
const router = new Router({
    prefix: '/api/student',
});

router.get('/', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const student = await GetStudentMessage(id);

    success({ ...student });
});

router.post('/all', new Auth().verify, async (ctx) => {
    const { size, current, search } = ctx.request.body;
    const students = await GetAllStudent(size, current, search);

    success({
        totalNum: students.length,
        students,
    });
});

router.post('/file', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const { file } = ctx.request.body;
    await PostFileMessage(id, file);

    success();
});

router.post('/all_file', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const files = await GetAllFile(id, ctx.request.body);

    success({
        totalNum: files.length,
        files,
    });
});

router.get('/file/:fileId', new Auth().verify, async (ctx) => {
    const { fileId } = ctx.params;
    const file = await GetFileMessage(fileId);

    success({ ...file });
});

router.get('/progress', new Auth().verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const progress = await GetProgressMessage(id);

    success({
        progress,
    });
});

module.exports = router;