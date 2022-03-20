import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetProcess, SaveProcess, EditProcess, DeleteProcess, UpdateProcess,
    EditProcessTime,
} from '../../validators/teacher/processValidator';
const router = new Router({
    prefix: '/api/teacher/process',
});

router.get('/', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const result = await GetProcess(id);

    success({
        stages: [...result],
    });
});

router.post('/add', new Auth(1).verify, async (ctx: any) => {
    const { id } = ctx.auth;
    const { newStage } = ctx.request.body;
    const item = await SaveProcess(newStage, id);

    success({
        ...item,
        key: item.id,
        title: item.name,
    });
});

router.patch('/edit/:id', new Auth(1).verify, async (ctx) => {
    const { id } = ctx.params;
    const { title } = ctx.request.body;
    await EditProcess(title, id);

    success();
});

router.delete('/delete/:id', new Auth(1).verify, async (ctx) => {
    const { id } = ctx.params;
    const { stage } = ctx.request.body;
    await DeleteProcess(id, stage);

    success();
});

router.patch('/update', new Auth(1).verify, async (ctx) => {
    const { stage } = ctx.request.body;
    await UpdateProcess(stage);

    success();
});

router.patch('/edit_time/:id', new Auth(1).verify, async (ctx) => {
    const { id } = ctx.params;
    const { time } = ctx.request.body;
    await EditProcessTime(id, time);

    success();
});

module.exports = router;