import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetProcess, SaveProcess, EditProcess, DeleteProcess, UpdateProcess,
    CountProcessData
} from '../../validators/admin/processValidator';
const router = new Router({
    prefix: '/api/admin/process',
});

router.get('/', new Auth(2).verify, async () => {
    const result = await GetProcess();

    success({
        baseStage: [...result],
    });
});

router.post('/add', new Auth(2).verify, async (ctx) => {
    const { title, pre_id } = ctx.request.body;
    const item = await SaveProcess(title, pre_id);

    success({
        ...item,
        key: item.id,
        title: item.name,
    });
});

router.patch('/edit/:id', new Auth(2).verify, async (ctx) => {
    const { id } = ctx.params;
    const { title } = ctx.request.body;
    await EditProcess(title, id);

    success();
});

router.delete('/delete/:id', new Auth(2).verify, async (ctx) => {
    const { id } = ctx.params;
    const { stage } = ctx.request.body;
    await DeleteProcess(id, stage);

    success();
});

router.patch('/update', new Auth(2).verify, async (ctx) => {
    const { stage } = ctx.request.body;
    await UpdateProcess(stage);

    success();
});

router.get('/count/:grade', new Auth(2).verify, async (ctx) => {
    const { grade } = ctx.params;
    const count = await CountProcessData(grade);

    success({
        count,
    });
});

module.exports = router;