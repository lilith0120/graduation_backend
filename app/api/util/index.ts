import * as Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { success } from '../../../lib/helper';
import Auth from '../../../middlewares/auth';
import {
    GetGradeMessage, GetProfessionMessage, GetTeacherMessage, GetProcessList
} from '../../validators/util/messageValidator';
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

router.get('/get_process', new Auth().verify, async (ctx: any) => {
    const { id, userType } = ctx.auth;
    const process = await GetProcessList(id, userType);

    success({
        process,
    });
});

router.post('/upload_file', new Auth().verify, async (ctx) => {
    const file: any = ctx.request.files.file;

    const readStream = fs.createReadStream(file.path);
    const timestamp = new Date().getTime();
    const filePath = path.join(__dirname, '../../../assets/') + `${timestamp}-${file.name}`;
    const remotePath = `http://81.71.128.138/assets/${timestamp}-${file.name}`;

    const upStream = fs.createWriteStream(filePath);
    readStream.pipe(upStream);

    success({
        url: remotePath,
    });
});

module.exports = router;
