import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetProcess, SaveProcess, EditProcess, DeleteProcess, UpdateProcess
} from '../../validators/admin/processValidator';
const router = new Router({
    prefix: '/api/admin/process',
});

router.get('/', new Auth().verify, async () => {
    const result = await GetProcess();

    success({
        baseStage: [...result],
    });
});

router.post('/add', new Auth().verify, async (ctx) => {
    const { title, pre_id } = ctx.request.body;
    const item = await SaveProcess(title, pre_id);

    success({ ...item.toJSON() });
});

router.patch('/edit/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;
    const { title } = ctx.request.body;
    await EditProcess(title, id);

    success();
});

router.delete('/delete/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;
    await DeleteProcess(id);

    success();
});

router.patch('/update', new Auth().verify, async (ctx) => {
    const { stage } = ctx.request.body;
    await UpdateProcess(stage);

    success();
});

module.exports = router;