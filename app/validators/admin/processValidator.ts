import BaseStage from "../../modules/baseStage";
import { OAuthException } from "../../../core/http-exception";


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

export {
    SaveProcess,
};