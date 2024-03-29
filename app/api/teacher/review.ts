import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetReviewMessage, GetFileMessage, UpdateFileStatus, GetTeacherList,
    DownloadFile, DownloadReview, UpdateReviewStatus
} from "../../validators/teacher/reviewValidator";
const router = new Router({
    prefix: '/api/teacher/review',
});

router.post('/', new Auth(1).verify, async (ctx) => {
    const { teacher_id, student_id, is_group, pass, file_id } = ctx.request.body;
    await UpdateReviewStatus(teacher_id, student_id, file_id, is_group, pass);

    success();
});

router.post('/all', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const { size, current, status } = ctx.request.body;
    const reviews = await GetReviewMessage(size, current, status, id);

    success({ ...reviews });
});

router.get('/:fileId', new Auth(1).verify, async (ctx) => {
    const { fileId } = ctx.params;
    const file = await GetFileMessage(fileId);

    success({
        file,
    });
});

router.patch('/:fileId', new Auth(1).verify, async (ctx) => {
    const { fileId } = ctx.params;
    const { pass, comment } = ctx.request.body;
    await UpdateFileStatus(fileId, pass, comment);

    success();
});

router.patch('/download/file', new Auth(1).verify, async (ctx) => {
    const { fileIds } = ctx.request.body;
    await DownloadFile(fileIds);

    success();
});

router.post('/download', new Auth(1).verify, async (ctx) => {
    const { teacher_id, student_id, is_group } = ctx.request.body;
    await DownloadReview(teacher_id, student_id, is_group);

    success();
});

router.get('/teacher_list/:fileId', new Auth().verify, async (ctx) => {
    const { fileId } = ctx.params;
    const teacherList = await GetTeacherList(fileId);

    success({
        teacherList,
    });
});

module.exports = router;