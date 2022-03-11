import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetProcess, SaveProcess, EditProcess, DeleteProcess, UpdateProcess
} from '../../validators/teacher/processValidator';
const router = new Router({
    prefix: '/api/teacher/process',
});

router.get('/', new Auth().verify, async () => {
    const result = await GetProcess();

    success({
        stages: [...result],
    });
});

router.post('/add', new Auth().verify, async (ctx: any) => {
    const { newStage, teacherId } = ctx.request.body;
    const item = await SaveProcess(newStage, teacherId);

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

router.patch('/edit_time/:id', new Auth().verify, async (ctx) => {
    const { id } = ctx.params;

    success();
});

module.exports = router;