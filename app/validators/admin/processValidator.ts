import BaseStage from "../../modules/baseStage";
import { OAuthException } from "../../../core/http-exception";

const GetProcess = async () => {
    const baseStage = await BaseStage.findAll();
    const result = [];
    let preId = -1;
    while (result.length < baseStage.length) {
        const value = baseStage.find((item) => {
            return item.pre_id === preId;
        });
        result.push(value);
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

    return item;
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

const DeleteProcess = async (id: any) => {
    await hasIdVertify(id);

    await BaseStage.destroy({
        where: {
            id,
        },
    });
};

const UpdateProcess = async (stage: any) => {
    const stageArr = [];
    for (let s of stage) {
        const value = {
            id: s.key,
            name: s.title,
            pre_id: s.pre_id,
        };

        stageArr.push(value);
    }

    await BaseStage.bulkCreate(stageArr, { updateOnDuplicate: ["name", "pre_id"] });
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
};