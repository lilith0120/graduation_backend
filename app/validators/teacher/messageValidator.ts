import { Op } from "sequelize";
import User from "../../modules/user";
import Teacher from "../../modules/teacher";
import { vertifyId } from "..";
import { RoleException } from "../../../core/http-exception";

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
                attributes: ["user_id"],
                where: {
                    user_id: {
                        [Op.substring]: search?.teacher_id ?? '',
                    },
                },
            },
        ],
    });

    return teachers;
};

export {
    GetTeacherMessage,
    GetAllTeacher,
};