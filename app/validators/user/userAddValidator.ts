import { vertifyUserId } from "../index";
import { OAuthException } from "../../../core/http-exception";
import userTypeEums from '../../../lib/user-type-enums';

const UserAddValidator = async (body: any) => {
    const result = await Promise.all(
        body.map(async (item: any) => {
            const { userId, userType } = item;
            await vertifyUserId(userId, false);
            await userTypeValidator(userType);

            item.user_id = userId;
            item.user_type = userTypeEums[userType];
            item.user_pswd = userId;

            return item;
        }),
    );

    return result;
};

const userTypeValidator = async (userType: any) => {
    if (!userType) {
        throw new OAuthException(40003);
    }

    if (userTypeEums[userType] === undefined ||
        userTypeEums[userType] === null) {
        throw new OAuthException(40006);
    }
};

export {
    UserAddValidator,
};