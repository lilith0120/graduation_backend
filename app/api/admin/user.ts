import * as Router from 'koa-router';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import { DeleteStudents } from '../../validators/admin/userValidator';
const router = new Router({
    prefix: '/api/admin',
});

router.delete('/delete_student', new Auth().verify, async (ctx) => {
    const { students } = ctx.request.body;
    await DeleteStudents(students);

    success();
});

module.exports = router;