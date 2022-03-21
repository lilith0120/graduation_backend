import BaseStage from "../../modules/baseStage";
import Student from "../../modules/student";
import { OAuthException } from "../../../core/http-exception";
import sequelize from "../../../core/db";
import { Op } from 'sequelize';

const GetProcess = async () => {
    const baseStage = await BaseStage.findAll();
    const result = [];
    let preId = -1;
    while (result.length < baseStage.length) {
        const value = baseStage.find((item) => {
            return item.pre_id === preId;
        });

        const v = value.toJSON();
        v.key = v.id;
        v.title = v.name;
        result.push(v);
        preId = value.id;
    }

    return result;
};

const SaveProcess = async (title: any, preId: any) => {
    await hasTitleVertify(title);
    await hasPreIdVertify(preId);

    const item = await BaseStage.create({
        name: title,
        pre_id: preId,
    });

    if (!item) {
        throw new OAuthException(40019);
    }

    return item.toJSON();
};

const EditProcess = async (title: any, id: any) => {
    await hasTitleVertify(title);
    await hasIdVertify(id);

    await BaseStage.update({
        name: title,
    }, {
        where: {
            id,
        },
    });
};

const DeleteProcess = async (id: any, stage: any) => {
    await hasIdVertify(id);

    await BaseStage.destroy({
        where: {
            id,
        },
    });
    await UpdateProcess(stage);
};

const UpdateProcess = async (stage: any) => {
    const stageArr = [];
    for (let s of stage) {
        const value = {
            id: s.id,
            name: s.name,
            pre_id: s.pre_id,
        };

        stageArr.push(value);
    }

    await BaseStage.bulkCreate(stageArr, { updateOnDuplicate: ["pre_id"] });
};

const CountProcessData = async (grade: any) => {
    const count: any = await Student.findAll({
        where: {
            grade: {
                [Op.substring]: grade === "-1" ? "" : grade,
            },
        },
        group: "base_stage_id",
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('base_stage_id')), 'value'],
        ],
        include: [{
            model: BaseStage,
            attributes: ["name"],
        }],
    });

    const nullCount = await Student.count({
        where: {
            BaseStageId: null,
            grade: {
                [Op.substring]: grade === "-1" ? "" : grade,
            },
        },
    });
    const result = [];
    for (let c of count) {
        c = c.toJSON();
        if (!c.BaseStage?.name) {
            continue;
        }
        const r = {
            value: c.value,
            name: c.BaseStage.name,
        };
        result.push(r);
    }
    result.push({
        value: nullCount,
        name: "未开始",
    });

    return result;
};

const hasTitleVertify = async (title: any) => {
    if (!title) {
        throw new OAuthException(40017);
    }
};

const hasPreIdVertify = async (preId: any) => {
    if (!preId) {
        throw new OAuthException(40018);
    }
};

const hasIdVertify = async (id: any) => {
    if (!id) {
        throw new OAuthException(40020);
    }
};

export {
    GetProcess,
    SaveProcess,
    EditProcess,
    DeleteProcess,
    UpdateProcess,
    CountProcessData,
};