import { Op } from "sequelize";
import User from "../../modules/user";
import Teacher from "../../modules/teacher";
import File from "../../modules/file";
import Student from "../../modules/student";
import { vertifyId } from "..";
import { RoleException } from "../../../core/http-exception";
import { GetProcessMessage as getProcessMessage } from "../util/messageValidator";
import { getTeacherId } from "../teacher/processValidator";
import reviewConfig from "../../../config/review-config";

const GetTeacherMessage = async (userId: any) => {
    await vertifyId(userId);

    const teacher = await Teacher.findOne({
        where: {
            user_id: userId,
        },
        include: [
            {
                model: User,
                attributes: ["user_id", "email"],
            }
        ],
    });

    if (!teacher) {
        throw new RoleException(44001);
    }

    return teacher;
};

const GetAllTeacher = async (size = 10, current = 1, search: any) => {
    const teacherCount = await Teacher.count({
        where: {
            name: {
                [Op.substring]: search?.name ?? '',
            },
            sex: {
                [Op.substring]: search?.sex ?? '',
            },
        },
    });
    const teachers = await Teacher.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: {
            name: {
                [Op.substring]: search?.name ?? '',
            },
            sex: {
                [Op.substring]: search?.sex ?? '',
            },
        },
        include: [
            {
                model: User,
                attributes: ["user_id", "email"],
                where: {
                    user_id: {
                        [Op.substring]: search?.teacher_id ?? '',
                    },
                },
            },
        ],
    });

    const result = teachers.map((item) => {
        const teacher = item.toJSON();

        teacher.email = teacher.User.email;
        teacher.teacher_id = teacher.User.user_id;

        return teacher;
    });

    return {
        totalNum: teacherCount,
        teachers: result,
    };
};

const GetProcessMessage = async (userId: any) => {
    const teacherId = await getTeacherId(userId);
    const stages = await getProcessMessage(teacherId);

    const now = new Date();
    const result = Promise.all(stages.map(async (item) => {
        const begin = new Date(item.begin_at);
        const end = new Date(item.end_at);
        if (!item.begin_at || begin > now) {
            item.status = "wait";
        } else if (end < now) {
            item.status = "finish";
        } else {
            item.status = "process";
        }

        if (item.status !== "wait") {
            const pushNumber = await File.count({
                where: {
                    TeacherId: teacherId,
                    StageId: item.id,
                },
                group: ["StudentId"],
            })
            item.pushNumber = pushNumber.length;

            const finishNumber = await File.count({
                where: {
                    TeacherId: teacherId,
                    StageId: item.id,
                    status: 2, // 审核通过
                },
                group: ["StudentId"],
            });
            item.finishNumber = finishNumber.length;
        }

        return item;
    }));

    return result;
};

const GetStudentNum = async (id: any) => {
    const teacherId = await getTeacherId(id);
    const studentNum = await Student.count({
        where: {
            TeacherId: teacherId,
        },
    });

    return studentNum;
};

const GetProgressDetail = async (userId: any, stageId: any) => {
    const teacherId = await getTeacherId(userId);
    const students = await Student.findAll({
        where: {
            TeacherId: teacherId,
        },
        include: [
            {
                model: User,
                attributes: ["user_id"],
            },
        ],
    });

    const result = Promise.all(students.map(async (student: any) => {
        const item = student.toJSON();
        item.isPush = false;
        item.isFinish = false;
        const file = await File.findOne({
            where: {
                StudentId: item.id,
                StageId: stageId,
            },
            order: [
                ["createdAt", "DESC"],
            ],
        });

        if (file) {
            const f = file.toJSON();
            item.isPush = true;
            item.push_status = reviewConfig[f.status];
            item.file_id = f.id;
            item.file_url = f.file_url;
            item.file_name = f.file_name;
            item.is_review = f.is_review;

            if (f.status === 2) {
                item.isFinish = true;
            }
        }

        return item;
    }));

    return result;
};

export {
    GetTeacherMessage,
    GetAllTeacher,
    GetProcessMessage,
    GetStudentNum,
    GetProgressDetail,
};