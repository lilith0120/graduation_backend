import Stage from "../../modules/Stage";
import BaseStage from "../../modules/baseStage";
import Student from "../../modules/student";
import { OAuthException } from "../../../core/http-exception";
import { GetProcess as GetBaseProcess } from "../admin/processValidator";
import sequelize from "../../../core/db";
import { Op } from 'sequelize';

const GetProcess = async () => {
    const baseStage = await GetBaseProcess();
    const resultStage = Promise.all(baseStage.map(async (item) => {
        const baseItem = item.toJSON();
        const stage = await Stage.findAll({
            where: {
                parent_id: baseItem.id,
            },
        });

        if (!stage) {
            return;
        }

        let preId = -1;
        const result = [];
        while (result.length < stage.length) {
            const value = stage.find((item) => {
                return item.pre_id === preId;
            });

            result.push(value);
            preId = value.id;
        }

        const children = result.map((i) => {
            const c = i.toJSON();
            c.key = `${c.parent_id}-${c.id}`;
            c.pre_id = (c.pre_id === -1 ? -1 : `${c.parent_id}-${c.pre_id}`);
            c.title = c.name;

            return c;
        });
        baseItem.key = baseItem.id;
        baseItem.title = baseItem.name;
        baseItem.children = children;

        return baseItem;
    }));

    return resultStage;
};

const SaveProcess = async (newStage: any, teacherId: any) => {
    const { title, pre_id, parent_id } = newStage;
    await hasTitleVertify(title);
    await hasPreIdVertify(pre_id);
    await hasParentIdVertify(parent_id);
    await parentIdVertify(parent_id);

    const item = await Stage.create({
        name: title,
        pre_id,
        parent_id,
        TeacherId: teacherId,
    });

    if (!item) {
        throw new OAuthException(40019);
    }

    return item;
};

const EditProcess = async (title: any, id: any) => {
    await hasTitleVertify(title);
    await hasIdVertify(id);

    await Stage.update({
        name: title,
    }, {
        where: {
            id,
        },
    });
};

const DeleteProcess = async (id: any) => {
    await hasIdVertify(id);

    await Stage.destroy({
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

const hasParentIdVertify = async (parentId: any) => {
    if (!parentId) {
        throw new OAuthException(40025);
    }
};

const parentIdVertify = async (parentId: any) => {
    const baseStage = await BaseStage.findByPk(parentId);

    if (!baseStage) {
        throw new OAuthException(40026);
    }
};

export {
    GetProcess,
    SaveProcess,
    EditProcess,
    DeleteProcess,
    UpdateProcess,
};