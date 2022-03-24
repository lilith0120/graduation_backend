import Student from "../../modules/student";
import File from "../../modules/file";
import Stage from "../../modules/stage";
import { getTeacherId } from "./processValidator";
import { Op } from "sequelize";

const GetReviewMessage = async (size = 10, current = 1, status = -1, userId: any) => {
    const teacherId = await getTeacherId(userId);

    let fileWhere: any = {
        TeacherId: teacherId,
        is_review: false,
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

export {
    GetReviewMessage,
    GetFileMessage,
    UpdateFileStatus,
    DownloadFile,
};