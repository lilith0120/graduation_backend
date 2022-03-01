import User from "../../app/modules/user";
import { OAuthException } from "../../core/http-exception";
import { hasUserIdValidator, userIdValidator } from "./index";

const UserLoginValidator = async (body: any) => {
    const userId = body?.userId ?? body;
    const userPswd = body?.userPswd ?? body;
    await hasUserIdValidator(userId);
    await userIdValidator(userId, true);

    const user = await User.vertifyPassword(userId, userPswd);

    return user;
};

export {
    UserLoginValidator,
};