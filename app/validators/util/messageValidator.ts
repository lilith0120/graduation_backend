import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import Stage from "../../modules/stage";
import { OAuthException } from "../../../core/http-exception";
import { vertifyId } from "..";
import { GetProcess as GetBaseProcess } from "../admin/processValidator";

const GetGradeMessage = async () => {
    const grades = await Student.findAll({
        attributes: ["grade"],
        group: ["grade"],
        order: [
            ["grade", "DESC"],
        ],
    });

    const result = [];
    for (let g of grades) {
        result.push(g.grade);
    };

    return result;
};

const GetProfessionMessage = async () => {
    const professions = await Profession.findAll({
        attributes: ["id", "name"],
    });

    return professions;
};

const GetTeacherMessage = async () => {
    const teachers = await Teacher.findAll({
        attributes: ["id", "name"],
    });

    return teachers;
};

const GetProcessList = async (userId: any, userType: any) => {
    await vertifyId(userId);

    let teacherId: number;
    if (userType === 0) {
        const student = await Student.findOne({
            where: {
                UserId: userId,
            },
        });
        const stu = student.toJSON();
        teacherId = stu.TeacherId;
    } else if (userType === 1) {
        const teacher = await Teacher.findOne({
            where: {
                UserId: userId,
            },
        })
        const thr = teacher.toJSON();
        teacherId = thr.id;
    }

    return await GetProcessMessage(teacherId);
};

const GetProcessMessage = async (teacherId: any) => {
    await hasTeacherIdVertify(teacherId);
    await teacherIdVertify(teacherId);

    const baseStage = await GetBaseProcess();
    const stage = await Stage.findAll({
        where: {
            TeacherId: teacherId,
        },
    });

    const result = [];
    let preId = -1;
    let current = 0;
    let parentId = baseStage[current].id;
    while (result.length < stage.length) {
        const value = stage.find((item) => {
            return item.pre_id === preId && item.parent_id === parentId;
        });

        if (!value) {
            current += 1;
            if (current === baseStage.length) {
                break;
            }

            parentId = baseStage[current].id;
            preId = -1;
            continue;
        }

        const v = value.toJSON();
        v.disabled = false;
        const now = new Date();
        const begin = new Date(v.begin_at);
        const end = new Date(v.end_at);

        if (now < begin || now > end || !v.begin_at) {
            v.disabled = true;
        }

        result.push(v);
        preId = v.id;
    }

    return result;
};

const hasTeacherIdVertify = async (teacherId: any) => {
    if (!teacherId) {
        throw new OAuthException(40023);
    }
};

const teacherIdVertify = async (teacherId: any) => {
    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
        throw new OAuthException(40024);
    }
};

export {
    GetGradeMessage,
    GetProfessionMessage,
    GetTeacherMessage,
    GetProcessList,
    GetProcessMessage,
};