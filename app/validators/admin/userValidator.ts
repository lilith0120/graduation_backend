import sequelize from "../../../core/db";
import User from "../../modules/user";
import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import { OAuthException, SqlException } from "../../../core/http-exception";

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
            Teacher,
            Profession,
        ]
    });

    return student;
};

const UpdateStudentMessage = async (id: any, form: any) => {
    await hasStudentIdVertify(id);
    await studentIdVertify(id);

    try {
        await sequelize.transaction(async (t) => {
            await Student.update({
                name: form.name,
                sex: form.sex,
                grade: form.grade,
                profession_id: form.profession_id,
                teacher_id: form.teacher_id,
            }, {
                where: {
                    id,
                },
                transaction: t,
            });

            const student = await Student.findByPk(id, { transaction: t });

            await User.update({
                user_id: form.student_id,
                email: form.email,
            }, {
                where: {
                    id: student.toJSON().UserId,
                },
                transaction: t,
            });
        });
    } catch (err) {
        throw new SqlException(err.message);
    }
};

const GetTeacherMessage = async (teacherId: any) => {
    await hasTeacherIdVertify(teacherId);
    await teacherIdVertify(teacherId);

    const teacher = await Teacher.findOne({
        where: {
            id: teacherId,
        },
        include: [
            {
                model: User,
                attributes: ["user_id", "email"],
            }
        ]
    });

    return teacher;
};

const UpdateTeacherMessage = async (id: any, form: any) => {
    await hasTeacherIdVertify(id);
    await teacherIdVertify(id);

    try {
        await sequelize.transaction(async (t) => {
            await Teacher.update({
                name: form.name,
                sex: form.sex,
            }, {
                where: {
                    id,
                },
                transaction: t,
            });

            const teacher = await Teacher.findByPk(id, { transaction: t });

            await User.update({
                user_id: form.teacher_id,
                email: form.email,
            }, {
                where: {
                    id: teacher.toJSON().UserId,
                },
                transaction: t,
            });
        });
    } catch (err) {
        throw new SqlException(err.message);
    }
};

const hasStudentIdVertify = async (studentId: any) => {
    if (!studentId) {
        throw new OAuthException(40021);
    }
};

const hasTeacherIdVertify = async (teacherId: any) => {
    if (!teacherId) {
        throw new OAuthException(40023);
    }
};

const studentIdVertify = async (studentId: any) => {
    const user = await Student.findOne({
        where: {
            id: studentId,
        },
    });

    if (!user) {
        throw new OAuthException(40022);
    }
};

const teacherIdVertify = async (teacherId: any) => {
    const user = await Teacher.findOne({
        where: {
            id: teacherId,
        },
    });

    if (!user) {
        throw new OAuthException(40024);
    }
};

export {
    DeleteStudents,
    GetStudentMessage,
    UpdateStudentMessage,
    GetTeacherMessage,
    UpdateTeacherMessage,
};