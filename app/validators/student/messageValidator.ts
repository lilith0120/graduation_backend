import { Op } from "sequelize";
import Student from "../../modules/student";
import User from "../../modules/user";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
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

    return student;
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

export {
    GetStudentMessage,
    GetAllStudent,
};