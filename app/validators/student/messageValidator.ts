import { Op } from "sequelize";
import Student from "../../modules/student";
import User from "../../modules/user";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import File from "../../modules/file";
import Stage from "../../modules/stage";
import { vertifyId } from "..";
import { RoleException } from "../../../core/http-exception";
import { GetProcessMessage as getProcessList } from "../util/messageValidator";

const GetStudentMessage = async (userId: any) => {
    await vertifyId(userId);

    const student = await Student.findOne({
        where: {
            user_id: userId,
        },
        include: [
            {
                model: User,
                attributes: ["user_id", "email"],
            },
            {
                model: Teacher,
                include: [
                    {
                        model: User,
                        attributes: ["user_id", "email"],
                    },
                ],
            },
            {
                model: Profession,
                attributes: ["name"],
            },
        ],
    });

    if (!student) {
        throw new RoleException(44001);
    }

    return student.toJSON();
};

const GetAllStudent = async (size = 10, current = 1, search: any) => {
    let studentWhere: any = {
        name: {
            [Op.substring]: search?.name ?? '',
        },
        sex: {
            [Op.substring]: search?.sex ?? '',
        },
        grade: {
            [Op.substring]: search?.grade ?? '',
        },
    };
    if (search?.profession_id) {
        studentWhere = {
            ...studentWhere,
            ProfessionId: {
                [Op.substring]: search?.profession_id ?? '',
            },
        };
    }
    if (search?.teacher_id) {
        studentWhere = {
            ...studentWhere,
            TeacherId: {
                [Op.substring]: search?.teacher_id ?? '',
            },
        };
    }

    const studentCount = await Student.count();
    const students = await Student.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: studentWhere,
        include: [
            {
                model: User,
                attributes: ["user_id"],
                where: {
                    user_id: {
                        [Op.substring]: search?.student_id ?? '',
                    },
                },
            },
            Teacher,
            Profession,
        ],
    });

    const result = students.map((item) => {
        const student = item.toJSON();

        student.student_id = student.User.user_id;
        student.profession_name = student.Profession?.name;
        student.teacher_name = student.Teacher?.name;

        return student;
    });

    return {
        totalNum: studentCount,
        students: result,
    };
};

const PostFileMessage = async (userId: any, file: any) => {
    const { file_id, file_name, file_stage, file_detail, file_url, is_review } = file;
    const student = await GetStudentMessage(userId);

    let updateFile: any;
    if (file_id === -1) {
        updateFile = await File.create({
            file_name,
            file_url,
            file_detail,
            is_review,
            StageId: file_stage,
            StudentId: student.id,
            TeacherId: student.TeacherId,
        });
    } else {
        await File.update({
            file_name,
            file_url,
            file_detail,
            is_review,
            StageId: file_stage,
        }, {
            where: {
                id: file_id,
            },
        });

        updateFile = file;
    }

    await updateStudentStage(student, file_stage);

    return updateFile;
};

const GetAllFile = async (id: any, body: any) => {
    const { size = 10, current = 1, search } = body;
    const student = await GetStudentMessage(id);

    const fileCount = await File.count({
        where: {
            StudentId: student.id,
        },
    });
    const files = await File.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: {
            file_name: {
                [Op.substring]: search?.file_name ?? '',
            },
            status: {
                [Op.substring]: search?.file_status ?? '',
            },
            StageId: {
                [Op.substring]: search?.process_id ?? '',
            },
            StudentId: student.id,
        },
        include: [
            {
                model: Stage,
                attributes: ["name"],
            },
        ],
        order: [
            ["createdAt", "DESC"],
        ],
    });

    const result = files.map((item) => {
        const file = item.toJSON();
        file.stage_name = file.Stage.name;

        return file;
    });

    return {
        totalNum: fileCount,
        files: result,
    };
};

const GetFileMessage = async (fileId: any) => {
    const file = await File.findByPk(fileId, {
        include: [
            Teacher,
            {
                model: Stage,
                attributes: ["name"],
            },
        ],
    });

    return file.toJSON();
};

const GetProgressMessage = async (userId: any) => {
    const student = await GetStudentMessage(userId);

    const { id, TeacherId } = student;
    const stages = await getProcessList(TeacherId);

    const now = new Date();
    const result = Promise.all(stages.map(async (item, index) => {
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
            item.isDone = false;
            const file = await File.findOne({
                where: {
                    StudentId: id,
                    StageId: item.id,
                    status: 2, // 审核通过
                },
            });

            if (file) {
                item.isDone = true;
                const f = file.toJSON();
                item.file_id = f.id;
                item.file_name = f.file_name;
            }
        }

        return item;
    }));

    return result;
};

const updateStudentStage = async (body: any, stage: any) => {
    const { id, TeacherId, StageId } = body;
    const stages = await getProcessList(TeacherId);

    const nowPlace = stages.findIndex((item) => item.id === StageId);
    const updatePlace = stages.findIndex((item) => item.id === stage);

    if (nowPlace < updatePlace) {
        await Student.update({
            StageId: stage,
            BaseStageId: stages[updatePlace].parent_id,
        }, {
            where: {
                id,
            },
        });
    }
};

export {
    GetStudentMessage,
    GetAllStudent,
    PostFileMessage,
    GetAllFile,
    GetFileMessage,
    GetProgressMessage,
};