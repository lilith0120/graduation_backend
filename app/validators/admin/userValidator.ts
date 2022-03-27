import sequelize from "../../../core/db";
import User from "../../modules/user";
import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import StuThrAss from "../../modules/stuThrAss";
import { OAuthException, SqlException } from "../../../core/http-exception";
import { hasAssMessage } from "../util/messageValidator";
import { Op } from 'sequelize';

const AddStudents = async (students: any) => {
    const studentsMessage = [];

    for (let s of students) {
        let studentMessage = {
            name: s.name,
            sex: s.sex,
            grade: s.grade,
            TeacherId: s?.teacher_id,
            ProfessionId: s?.profession_id,
            User: {
                user_id: s.student_id.toString(),
                user_pswd: s.student_id.toString(),
                email: s?.email,
                user_type: 0,
            },
        };

        const user = await User.findOne({
            where: {
                user_id: s.student_id.toString(),
            },
        });

        if (user) {
            await updateStudent(s, user.toJSON().id);

            continue;
        }

        studentsMessage.push(studentMessage);
    }

    try {
        await Student.bulkCreate(studentsMessage, {
            include: [User],
        });
    } catch (err) {
        throw new SqlException(err);
    }
};

const DeleteStudents = async (students: any) => {
    const studentIds = [];
    const userIds = [];

    for (let s of students) {
        studentIds.push(s.id);
        userIds.push(s.student_id);
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
                    user_id: userIds,
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

    let student: any = await Student.findOne({
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
    student = student.toJSON();

    const reviewTeacher = await getReviewTeacher(studentId);
    if (reviewTeacher) {
        student.review_teacher = reviewTeacher.Teacher.name;
        student.review_id = reviewTeacher.TeacherId;
    }

    const groupTeachers = await getGroupTeacher(studentId);
    if (groupTeachers) {
        const group = [];
        const groupId = [];
        groupTeachers.forEach((item) => {
            const groupTeacher = item.toJSON();
            group.push(groupTeacher.Teacher.name);
            groupId.push(groupTeacher.TeacherId);
        });
        student.group = group;
        student.review_group = groupId;
    }

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
                ProfessionId: form.profession_id,
                TeacherId: form.teacher_id,
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

    await updateReviewMessage(id, [form.review_id], false);
    await updateReviewMessage(id, form.review_group, true);
};

const AddTeachers = async (teachers: any) => {
    const teachersMessage = [];

    for (let t of teachers) {
        const teacherMessage = {
            name: t.name,
            sex: t.sex,
            User: {
                user_id: t.teacher_id.toString(),
                user_pswd: t.teacher_id.toString(),
                email: t?.email,
                user_type: 1,
            },
        };
        teachersMessage.push(teacherMessage);
    }

    try {
        await Teacher.bulkCreate(teachersMessage, {
            include: [User],
        });
    } catch (err) {
        throw new SqlException(err);
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

const updateStudent = async (student: any, userId: any) => {
    await Student.update({
        TeacherId: student?.teacher_id,
        ProfessionId: student?.profession_id,
    }, {
        where: {
            UserId: userId,
        },
    });
};

const getReviewTeacher = async (studentId: any) => {
    const teacher = await StuThrAss.findOne({
        where: {
            StudentId: studentId,
            is_group: false,
        },
        include: [
            {
                model: Teacher,
                attributes: ["name"],
            },
        ],
    });

    if (!teacher) {
        return;
    }

    return teacher.toJSON();
};

const getGroupTeacher = async (studentId: any) => {
    const teachers = await StuThrAss.findAll({
        where: {
            StudentId: studentId,
            is_group: true,
        },
        include: [
            {
                model: Teacher,
                attributes: ["name"],
            },
        ],
    });

    if (!teachers) {
        return;
    }

    return teachers;
};

const updateReviewMessage = async (studentId: any, selectTeachers: any, is_group: any) => {
    try {
        await sequelize.transaction(async (t) => {
            await StuThrAss.destroy({
                where: {
                    StudentId: studentId,
                    TeacherId: {
                        [Op.notIn]: selectTeachers,
                    },
                    is_group,
                },
                transaction: t,
            });

            const assData = [];
            for (let thr of selectTeachers) {
                const value = {
                    StudentId: studentId,
                    TeacherId: thr,
                    is_group,
                };

                const hasAss = await hasAssMessage(studentId, thr, is_group, t);
                if (!hasAss) {
                    assData.push(value);
                }
            }

            await StuThrAss.bulkCreate(assData, {
                transaction: t,
            });
        });
    } catch (err) {
        throw new SqlException(err.message);
    };
};

export {
    AddStudents,
    DeleteStudents,
    GetStudentMessage,
    UpdateStudentMessage,
    AddTeachers,
    GetTeacherMessage,
    UpdateTeacherMessage,
};