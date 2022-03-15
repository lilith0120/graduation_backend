import Student from "../../modules/student";
import File from "../../modules/file";
import Stage from "../../modules/stage";
import { getTeacherId } from "./processValidator";

const GetReviewMessage = async (size = 10, current = 1, status = -1, userId: any) => {
    const teacherId = await getTeacherId(userId);

    let fileWhere: any = {
        TeacherId: teacherId,
    };
    if (status !== -1) {
        fileWhere = {
            ...fileWhere,
            status,
        };
    }

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

    return files;
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

const DownloadFile = async (fileId: any) => {
    await File.update({
        status: 1,
    }, {
        where: {
            id: fileId,
        },
    });
};

export {
    GetReviewMessage,
    GetFileMessage,
    UpdateFileStatus,
    DownloadFile,
};