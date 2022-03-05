import Student from "../../modules/student";
import User from "../../modules/user";
import Teacher from "../../modules/teacher";
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

export {
    GetStudentMessage,
};