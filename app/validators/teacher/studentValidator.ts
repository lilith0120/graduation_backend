import Teacher from "../../modules/teacher";
import Student from "../../modules/student";
import User from "../../modules/user";
import Profession from "../../modules/profession";
import Stage from "../../modules/stage";
import File from "../../modules/file";
import { OAuthException } from "../../../core/http-exception";
import { Op } from "sequelize";

const GetAllStudent = async (userId: any, body: any) => {
    const { size = 10, current = 1, search } = body;
    const teacherId = await getTeacherId(userId);

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
        TeacherId: teacherId,
    };
    if (search?.stage_id) {
        studentWhere = {
            ...studentWhere,
            StageId: {
                [Op.substring]: search?.stage_id,
            },
        };
    }

    const students = await Student.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: studentWhere,
        include: [
            {
                model: User,
                attributes: ["user_id", "email"],
                where: {
                    user_id: {
                        [Op.substring]: search?.student_id ?? '',
                    },
                },
            },
            Profession,
            Stage,
        ],
    });

    return students;
};

const GetStudentMessage = async (studentId: any) => {
    await hasStudentIdVertify(studentId);
    await studentIdVertify(studentId);

    const student = await Student.findOne({
        where: {
            id: studentId,
        },
        include: [
            {
                model: User,
                attributes: ["user_id", "email"],
            },
            Profession,
            Stage,
        ],
    });

    return student;
};

const GetFileList = async (studentId: any) => {
    const fileList = await File.findAll({
        where: {
            StudentId: studentId,
        },
        order: [
            ["createdAt", "DESC"],
        ],
        include: [
            {
                model: Stage,
                attributes: ["name"],
            },
        ],
    });

    return fileList;
};

const getTeacherId = async (userId: any) => {
    const teacher = await Teacher.findOne({
        where: {
            UserId: userId,
        },
    });

    if (!teacher) {
        throw new OAuthException(40024);
    }

    return teacher.toJSON().id;
};

const hasStudentIdVertify = async (studentId: any) => {
    if (!studentId) {
        throw new OAuthException(40021);
    }
};

const studentIdVertify = async (studnetId: any) => {
    const student = await Student.findByPk(studnetId);

    if (!student) {
        throw new OAuthException(40022);
    }
};

export {
    GetAllStudent,
    GetStudentMessage,
    GetFileList,
};