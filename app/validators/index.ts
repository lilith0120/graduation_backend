import validator from "validator";
import User from "../../app/modules/user";
import { OAuthException } from "../../core/http-exception";
import userTypeEums from '../../lib/user-type-enums';

const UserAddValidator = async (body: any) => {
    const result = await Promise.all(
        body.map(async (item: any) => {
            const { userId, userType } = item;
            await hasUserIdValidator(userId);
            await userIdValidator(userId, false);
            await userTypeValidator(userType);

            item.user_id = userId;
            item.user_type = userTypeEums[userType];

            return item;
        }),
    );

    return result;
};

const OAuthValidator = async (body: any) => {
    const userId = body?.userId ?? body;
    await hasUserIdValidator(userId);
    const user = await userIdValidator(userId, true);

    return user;
};

const hasUserIdValidator = async (id: any) => {
    if (!id) {
        throw new OAuthException(40001);
    }
};

const userTypeValidator = async (userType: any) => {
    if (!userType) {
        throw new OAuthException(40003);
    }

    if (!userTypeEums[userType]) {
        throw new OAuthException(40006);
    }
};

const userIdValidator = async (id: any, isAdd = false) => {
    const user = await User.findOne({
        where: {
            user_id: id,
        }
    });

    if (user && !isAdd) {
        throw new OAuthException(40005);
    };

    // if (!user && isAdd) {
    //     throw new OAuthException(40004);
    // };

    return user.toJSON();
};

export {
    UserAddValidator,
    OAuthValidator,
};