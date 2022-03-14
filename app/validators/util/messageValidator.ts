import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import Stage from "../../modules/stage";
import { OAuthException } from "../../../core/http-exception";
import * as moment from "moment";

const GetGradeMessage = async () => {
    const grades = await Student.findAll({
        attributes: ["grade"],
        group: ["grade"],
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

const GetProcessMessage = async (teacherId: any) => {
    await hasTeacherIdVertify(teacherId);
    await teacherIdVertify(teacherId);

    const stage = await Stage.findAll({
        where: {
            TeacherId: teacherId,
        },
    });

    const result = [];
    let preId = -1;
    let parentId = 1;
    while (result.length < stage.length) {
        const value = stage.find((item) => {
            return item.pre_id === preId && item.parent_id === parentId;
        });

        if (!value) {
            parentId += 1;
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
    GetProcessMessage,
};