import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetReviewMessage, GetFileMessage, UpdateFileStatus, DownloadFile
} from "../../validators/teacher/reviewValidator";
const router = new Router({
    prefix: '/api/teacher/review',
});

router.post('/all', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const { size, current, status } = ctx.request.body;
    const reviews = await GetReviewMessage(size, current, status, id);

    success({
        totalNums: reviews.length,
        reviews,
    });
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

module.exports = router;