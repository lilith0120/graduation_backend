import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import Stage from "../../modules/stage";
import File from "../../modules/file";
import StuThrAss from "../../modules/stuThrAss";
import { OAuthException, SqlException } from "../../../core/http-exception";
import { vertifyId } from "..";
import { GetProcess as GetBaseProcess } from "../admin/processValidator";
import { Op } from 'sequelize';
import sequelize from "../../../core/db";
import { getTeacherId } from "../teacher/processValidator";

const GetGradeMessage = async () => {
    const grades = await Student.findAll({
        attributes: ["grade"],
        group: ["grade"],
        order: [
            ["grade", "DESC"],
        ],
    });

    const result = [];
    for (let g of grades) {
        result.push(g.grade);
    };

    return result;
};

const GetProfessionMessage = async () => {
    const professions = await Profession.findAll({
        attributes: ["id", "name"],
    });

    return professions;
};

const GetTeacherMessage = async () => {
    const teachers = await Teacher.findAll({
        attributes: ["id", "name"],
    });

    return teachers;
};

const GetStudentMessage = async (userId: any, is_review: any) => {
    const teacherId = await getTeacherId(userId);
    const students = await Student.findAll({
        attributes: ["id", "name"],
    });

    if (is_review) {
        const reviewStudents = await StuThrAss.findAll({
            where: {
                is_group: false,
            },
        });

        const result = students.filter((item) => {
            const student = item.toJSON();
            const hasReview = reviewStudents.find((review) => review.toJSON().StudentId === student.id);
            const isTeacher = reviewStudents.find(
                (review) => review.toJSON().StudentId === student.id && review.toJSON().TeacherId === teacherId
            );

            if (!hasReview || isTeacher) {
                return student;
            }
        });

        return result;
    }

    return students;
};

const GetProcessList = async (userId: any, userType: any) => {
    await vertifyId(userId);

    let teacherId: number;
    let hasReview = false;
    if (userType === 0) {
        const student = await Student.findOne({
            where: {
                UserId: userId,
            },
        });
        const stu = student.toJSON();
        teacherId = stu.TeacherId;
        hasReview = await hasReviewFile(stu.id);
    } else if (userType === 1) {
        const teacher = await Teacher.findOne({
            where: {
                UserId: userId,
            },
        })
        const thr = teacher.toJSON();
        teacherId = thr.id;
    }

    return await GetProcessMessage(teacherId, hasReview);
};

const GetProcessMessage = async (teacherId: any, hasReview = false) => {
    await hasTeacherIdVertify(teacherId);
    await teacherIdVertify(teacherId);

    const baseStage = await GetBaseProcess();
    const stage = await Stage.findAll({
        where: {
            TeacherId: teacherId,
        },
    });

    const result = [];
    let preId = -1;
    let current = 0;
    let parentId = baseStage[current].id;
    while (result.length < stage.length) {
        const value = stage.find((item) => {
            return item.pre_id === preId && item.parent_id === parentId;
        });

        if (!value) {
            current += 1;
            if (current === baseStage.length) {
                break;
            }

            parentId = baseStage[current].id;
            preId = -1;
            continue;
        }

        const v = value.toJSON();
        v.disabled = false;
        const now = new Date();
        const begin = new Date(v.begin_at);
        const end = new Date(v.end_at);

        if (now < begin || now > end || !v.begin_at) {
            v.disabled = true;
        }

        result.push(v);
        preId = v.id;
    }

    result[result.length - 1].disabled = result[result.length - 1].disabled || hasReview;

    return result;
};

const PostTeacherMessage = async (selectStudents: any, is_review: any) => {
    const studentLength = selectStudents.length;
    const teachers = await StuThrAss.findAll({
        where: {
            StudentId: selectStudents,
            is_group: !is_review,
        },
        group: "teacher_id",
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('teacher_id')), 'value'],
            "teacher_id",
        ],
    });

    const result = [];
    teachers.forEach((item: any) => {
        const teacher = item.toJSON();
        if (teacher.value === studentLength) {
            result.push(teacher.teacher_id);
        }
    });

    return result;
};

const PostStudentMessage = async (selectTeachers: any, is_review: any) => {
    const teacherLength = selectTeachers.length;
    const students = await StuThrAss.findAll({
        where: {
            TeacherId: selectTeachers,
            is_group: !is_review,
        },
        group: "student_id",
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('student_id')), 'value'],
            "student_id",
        ],
    });

    const result = [];
    students.forEach((item: any) => {
        const student = item.toJSON();
        if (student.value === teacherLength) {
            result.push(student.student_id);
        }
    });

    return result;
};

const UpdateAssMessage = async (selectStudents: any, selectTeachers: any, is_group: boolean) => {
    try {
        await sequelize.transaction(async (t) => {
            await deleteAssMessage(selectStudents, selectTeachers, is_group, t);

            const assData = [];
            for (let stu of selectStudents) {
                for (let thr of selectTeachers) {
                    const value = {
                        StudentId: stu,
                        TeacherId: thr,
                        is_group,
                    };

                    const hasAss = await hasAssMessage(stu, thr, is_group, t);
                    if (!hasAss) {
                        assData.push(value);
                    }
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

const hasTeacherIdVertify = async (teacherId: any) => {
    if (!teacherId) {
        throw new OAuthException(40023);
    }
};

const teacherIdVertify = async (teacherId: any) => {
    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
        throw new OAuthException(40024);
    }
};

const hasReviewFile = async (studentId: any) => {
    const file = await File.findOne({
        where: {
            StudentId: studentId,
            is_review: true,
            status: {
                [Op.ne]: 3, // 如果审核状态不为审核驳回，就不允许再提交
            }
        }
    });

    if (file) {
        return true;
    } else {
        return false;
    }
};

const deleteAssMessage = async (selectStudents: any, selectTeachers: any, is_group: any, t: any) => {
    await StuThrAss.destroy({
        where: {
            TeacherId: selectTeachers,
            StudentId: {
                [Op.notIn]: selectStudents,
            },
            is_group,
        },
        transaction: t,
    });

    await StuThrAss.destroy({
        where: {
            StudentId: selectStudents,
            TeacherId: {
                [Op.notIn]: selectTeachers,
            },
            is_group,
        },
        transaction: t,
    });
};

const hasAssMessage = async (studentId: any, teacherId: any, is_group: any, t: any) => {
    const ass = await StuThrAss.findOne({
        where: {
            StudentId: studentId,
            TeacherId: teacherId,
            is_group,
        },
        transaction: t,
    });

    if (ass) {
        return true;
    }

    return false;
};

export {
    GetGradeMessage,
    GetProfessionMessage,
    GetTeacherMessage,
    GetStudentMessage,
    GetProcessList,
    GetProcessMessage,
    PostTeacherMessage,
    PostStudentMessage,
    UpdateAssMessage,
    hasAssMessage,
};