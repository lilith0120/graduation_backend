import User from "../../app/modules/user";
import { OAuthException } from "../../core/http-exception";

// const OAuthValidator = async (body: any) => {
//     const userId = body?.userId ?? body;
//     await hasUserIdValidator(userId);
//     await userIdValidator(userId, true);;
// };

const vertifyUserId = async (id: any, isHas = true) => {
    await hasUserIdValidator(id);
    await userIdValidator(id, isHas);
};

const vertifyId = async (id: any) => {
    await hasUserIdValidator(id);
    await IdValidator(id);
};

const hasUserIdValidator = async (id: any) => {
    if (!id) {
        throw new OAuthException(40001);
    }
};

const userIdValidator = async (id: any, isHas = true) => {
    const user = await User.findOne({
        where: {
            user_id: id,
        }
    });

    if (user && !isHas) {
        throw new OAuthException(40005);
    }

    if (!user && isHas) {
        throw new OAuthException(40004);
    }
};

const IdValidator = async (id: any) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new OAuthException(40004);
    }
};

export {
    // OAuthValidator,
    vertifyUserId,
    vertifyId,
};