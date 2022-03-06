import sequelize from "../../../core/db";
import User from "../../modules/user";
import Student from "../../modules/student";
import { SqlException } from "../../../core/http-exception";

const DeleteStudents = async (students: any) => {
    const studentIds = [];
    const userIds = [];

    for (let s of students) {
        studentIds.push(s.id);
        userIds.push(s.user_id);
    }

    try {
        await sequelize.transaction(async (t) => {
            await Student.destroy({
                where: {
                    id: studentIds,
                },
                transaction: t,
            });

            await User.destroy({
                where: {
                    id: userIds,
                },
                transaction: t,
            });
        });
    } catch (err) {
        throw new SqlException(err.message);
    }
};

export {
    DeleteStudents,
};