import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { GetGradeMessage, GetProfessionMessage, GetTeacherMessage } from '../../validators/util/messageValidator';
const router = new Router({
    prefix: '/api/util',
});

router.get('/get_grade', new Auth().verify, async () => {
    const grades = await GetGradeMessage();

    success({
        grades,
    });
});

router.get('/get_profession', new Auth().verify, async () => {
    const professions = await GetProfessionMessage();

    success({
        professions,
    });
});

router.get('/get_teacher', new Auth().verify, async () => {
    const teachers = await GetTeacherMessage();

    success({
        teachers,
    })
});

router.post('/upload_file', new Auth().verify, async (ctx) => {
    // 上传文件接口
});

module.exports = router;
