import * as nodemailer from "nodemailer";
import User from "../../modules/user";
import { vertifyUserId } from "../index";
import { OAuthException } from "../../../core/http-exception";
import { sendConfig, recieveConfig } from "../../../config/email-config";
import { setCode, getCode } from "../../../core/redis";

const EmailValidator = async (userId: any) => {
    await vertifyUserId(userId);

    const email = await vertifyEmail(userId);

    return email;
};

const GetEmailCode = async (email: any) => {
    await hasEmailValidator(email);

    const code = Math.random().toString().substr(2, 6);
    recieveConfig.to = email;
    recieveConfig.html = `<h3>重置密码的验证码为: ${code}, 该验证码邮箱时间为5分钟</h3>`;

    const transport = nodemailer.createTransport(sendConfig);
    transport.sendMail(recieveConfig, async (err, res) => {
        if (err) {
            transport.close();
            throw new OAuthException(40014);
        }

        // 将邮箱和对应的验证码存入redis
        await setCode(email, code);
    });
};

const CheckEmailCode = async (email: any, code: any) => {
    await hasEmailValidator(email);
    await hasCodeValidator(code);

    // 判断是否验证码是否正确
    const trueCode = await getCode(email);
    if (code !== trueCode) {
        throw new OAuthException(40016);
    }
};

const ChangeEmail = async (email: any, id: any) => {
    await hasEmailValidator(email);

    await User.update({ email }, {
        where: {
            id
        },
    });
};

const vertifyEmail = async (id: any) => {
    const user = await User.findOne({
        where: {
            user_id: id,
        },
    });

    if (!user) {
        throw new OAuthException(40004);
    }

    if (!user.email) {
        throw new OAuthException(40012);
    }

    return user.email;
};

const hasEmailValidator = async (email: any) => {
    if (!email) {
        throw new OAuthException(40013);
    }
};

const hasCodeValidator = async (code: any) => {
    if (!code) {
        throw new OAuthException(40015);
    }
};

export {
    EmailValidator,
    GetEmailCode,
    CheckEmailCode,
    ChangeEmail,
}