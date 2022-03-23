import Stage from "../../modules/stage";
import BaseStage from "../../modules/baseStage";
import Teacher from "../../modules/teacher";
import { OAuthException } from "../../../core/http-exception";
import { GetProcess as GetBaseProcess } from "../admin/processValidator";

const GetProcess = async (id: any) => {
    const teacherId = await getTeacherId(id);
    const baseStage = await GetBaseProcess();
    const resultStage = Promise.all(baseStage.map(async (item) => {
        const stage = await Stage.findAll({
            where: {
                parent_id: item.id,
                TeacherId: teacherId,
            },
        });

        if (!stage || stage.length === 0) {
            const newStage = {
                title: item.name,
                pre_id: -1,
                parent_id: item.id,
            }
            const newItem = await SaveProcess(newStage, id);
            stage.push(newItem);
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
            c.title = c.name;

            return c;
        });
        item.key = item.id;
        item.title = item.name;
        item.children = children;

        return item;
    }));

    return resultStage;
};

const SaveProcess = async (newStage: any, userId: any) => {
    const teacherId = await getTeacherId(userId);
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

    return item.toJSON();
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

const DeleteProcess = async (id: any, stage: any) => {
    await hasIdVertify(id);

    await Stage.destroy({
        where: {
            id,
        },
    });

    await UpdateProcess(stage);
};

const UpdateProcess = async (stage: any) => {
    const stageArr = [];
    for (let s of stage) {
        if (s.children) {
            for (let i of s.children) {
                const value = {
                    id: i.id,
                    name: i.name,
                    pre_id: i.pre_id,
                    parent_id: i.parent_id,
                };

                stageArr.push(value);
            }
        }
    }

    await Stage.bulkCreate(stageArr, { updateOnDuplicate: ["pre_id"] });
};

const EditProcessTime = async (id: any, time: any) => {
    const { begin_at, end_at } = time;
    await Stage.update({
        begin_at,
        end_at,
    }, {
        where: {
            id,
        }
    });
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

const getTeacherId = async (id: any) => {
    const teacher = await Teacher.findOne({
        where: {
            UserId: id,
        },
    });

    return teacher.toJSON().id;
};

export {
    getTeacherId,
    GetProcess,
    SaveProcess,
    EditProcess,
    DeleteProcess,
    UpdateProcess,
    EditProcessTime,
};