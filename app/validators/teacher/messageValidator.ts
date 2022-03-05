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

export {
    GetTeacherMessage,
};