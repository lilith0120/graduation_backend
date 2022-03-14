import { Op } from "sequelize";
import Student from "../../modules/student";
import User from "../../modules/user";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import File from "../../modules/file";
import { vertifyId } from "..";
import { RoleException } from "../../../core/http-exception";

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
        ],
    });

    if (!student) {
        throw new RoleException(44001);
    }

    return student.toJSON();
};

const GetAllStudent = async (size = 10, current = 1, search: any) => {
    const students = await Student.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: {
            name: {
                [Op.substring]: search?.name ?? '',
            },
            sex: {
                [Op.substring]: search?.sex ?? '',
            },
            grade: {
                [Op.substring]: search?.grade ?? '',
            },
            ProfessionId: {
                [Op.substring]: search?.profession_id ?? '',
            },
            TeacherId: {
                [Op.substring]: search?.teacher_id ?? '',
            }
        },
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

    return students;
};

const PostFileMessage = async (userId: any, file: any) => {
    const { file_name, file_stage, file_detail, file_url } = file;
    const student = await GetStudentMessage(userId);

    await File.create({
        file_name,
        file_url,
        file_detail,
        stage: file_stage,
        StudentId: student.id,
        TeacherId: student.TeacherId,
    });
};

const GetAllFile = async (id: any, body: any) => {
    const { size = 10, current = 1, search } = body;
    const student = await GetStudentMessage(id);

    const files = await File.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: {
            file_name: {
                [Op.substring]: search?.file_name ?? '',
            },
            stage: {
                [Op.substring]: search?.process_id ?? '',
            },
            status: {
                [Op.substring]: search?.file_status ?? '',
            },
            StudentId: student.id,
        },
    });

    return files;
};

const GetFileMessage = async (fileId: any) => {
    const file = await File.findByPk(fileId, {
        include: [Teacher],
    });

    return file.toJSON();
};

export {
    GetStudentMessage,
    GetAllStudent,
    PostFileMessage,
    GetAllFile,
    GetFileMessage,
};