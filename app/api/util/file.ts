import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
const router = new Router({
    prefix: '/api/file',
});

router.post('/upload', new Auth().verify, async (ctx) => {
    // 上传文件接口
});

module.exports = router;
