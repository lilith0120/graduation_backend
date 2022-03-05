import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { SaveProcess } from '../../validators/admin/processValidator';
const router = new Router({
    prefix: '/api/admin/process',
});

router.post('/add', new Auth().verify, async (ctx) => {
    const { title, pre_id } = ctx.request.body;
    const item = await SaveProcess(title, pre_id);

    success({ ...item.toJSON() });
});

module.exports = router;