import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import File from "../../modules/file";
import Stage from "../../modules/stage";
import StuThrAss from "../../modules/stuThrAss";
import { getTeacherId } from "./processValidator";
import { Op } from "sequelize";

const GetReviewMessage = async (size = 10, current = 1, status = -1, userId: any) => {
    const teacherId = await getTeacherId(userId);
    const studentIds = await getStudentId(teacherId);

    let fileWhere: any = {
        [Op.or]: [
            {
                [Op.and]: {
                    TeacherId: teacherId,
                    is_review: false,
                },
            },
            {
                [Op.and]: {
                    StudentId: studentIds,
                    is_review: true,
                },
            },
        ],
    };
    if (status !== -1) {
        fileWhere = {
            ...fileWhere,
            status,
        };
    }

    const fileCount = await File.count({
        where: fileWhere,
    });
    const files = await File.findAll({
        limit: size,
        offset: (current - 1) * size,
        where: fileWhere,
        include: [
            {
                model: Student,
                attributes: ["name"],
            },
            {
                model: Stage,
                attributes: ["name"],
            },
        ],
    });

    const result = files.map((item) => {
        const file = item.toJSON();

        file.student_name = file.Student.name;
        file.stage_name = file.Stage.name;

        return file;
    });

    return {
        totalNums: fileCount,
        reviews: result,
    };
};

const GetFileMessage = async (fileId: any) => {
    const file = await File.findByPk(fileId, {
        include: [
            {
                model: Student,
                attributes: ["name"],
            },
            {
                model: Stage,
                attributes: ["name"],
            },
        ],
    });

    return file.toJSON();
};

const UpdateFileStatus = async (fileId: any, pass: any, comment: any) => {
    await File.update({
        status: pass ? 2 : 3,
        review: comment,
        review_at: new Date(),
    }, {
        where: {
            id: fileId,
        },
    });
};

const DownloadFile = async (fileIds: any) => {
    await File.update({
        status: 1,
    }, {
        where: {
            id: {
                [Op.in]: fileIds,
            },
            status: 0,
        },
    });
};

const GetTeacherList = async (fileId: any) => {
    const student = await getStudentByFileId(fileId);
    const { Student: { name }, createdAt, StudentId: id } = student;

    let list = [];
    list.push({
        userId: id,
        time: createdAt,
        user: name,
        status: "提交文件",
    });

    const reviewTeacher = await getReviewTeacher(id);
    if (reviewTeacher) {
        list.push(reviewTeacher);
    }

    const reviewGroup = await getReviewGroup(id);
    if (reviewGroup) {
        list = [
            ...list,
            ...reviewGroup,
        ];
    }

    return list;
};

const getStudentId = async (teacherId: any) => {
    const students = await StuThrAss.findAll({
        where: {
            TeacherId: teacherId,
        },
        attributes: ["student_id"],
    });

    const studentIds = [];
    students.forEach((item) => {
        const student = item.toJSON();

        studentIds.push(student.student_id);
    });

    return studentIds;
};

const getStudentByFileId = async (fileId: any) => {
    const student = await File.findByPk(fileId, {
        include: [
            {
                model: Student,
                attributes: ["name"],
            },
        ],
    });

    return student.toJSON();
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

    if (teacher) {
        const content = teacher.toJSON();
        return {
            userId: content.TeacherId,
            time: content.updatedAt,
            user: content.Teacher.name,
            status: content.status,
            is_group: false,
        };
    }

    return;
};

const getReviewGroup = async (studentId: any) => {
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

    if (teachers && teachers.length) {
        const result = [];
        teachers.forEach((item) => {
            const content = item.toJSON();
            result.push({
                userId: content.TeacherId,
                time: content.updatedAt,
                user: content.Teacher.name,
                status: content.status,
                is_group: true,
            });
        });

        return result;
    }

    return;
};

export {
    GetReviewMessage,
    GetFileMessage,
    UpdateFileStatus,
    DownloadFile,
    GetTeacherList,
};