import User from "../../modules/user";
import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import { OAuthException } from "../../../core/http-exception";
import { vertifyUserId } from "../index";

const UserLoginValidator = async (body: any) => {
    const userId = body?.userId;
    const userPswd = body?.userPswd;
    await vertifyUserId(userId);

    const user = await User.vertifyPassword(userId, userPswd);

    return user;
};

const UserMessageValidator = async (userId: string, userType: number) => {
    let userMessage: any;
    if (userType === 0) {
        userMessage = await Student.findOne({
            where: {
                user_id: userId,
            },
        });
    } else if (userType === 1) {
        userMessage = await Teacher.findOne({
            where: {
                user_id: userId,
            },
        });
    } else {
        userMessage = {
            name: "管理员",
        };
    }

    if (!userMessage) {
        throw new OAuthException(40004);
    }

    return userMessage;
};

const RewritePassword = async (userId: any, userPswd: any) => {
    await vertifyUserId(userId);
    await User.update({
        user_pswd: userPswd,
    }, {
        where: {
            user_id: userId,
        },
    });
};

export {
    UserLoginValidator,
    UserMessageValidator,
    RewritePassword,
};