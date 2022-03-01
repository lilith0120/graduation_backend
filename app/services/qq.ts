import axios from 'axios';
import { OAuthException } from '../../core/http-exception';
import config from '../../config/config';
import { generateToken } from '../../core/util';
import { OAuthValidator } from '../../app/validators';
import User from '../../app/modules/user';

const { qq } = config;

class QQManager {
    static async getCode() {
        const state = 'mygraduationproject';
        const codeUrl =
            `${qq.loginUrl}?client_id=${qq.appId}&redirect_uri=${encodeURIComponent(qq.redirectUrl)}&state=${state}&response_type=code`;

        const res = await axios.get(codeUrl);
        if (res.status !== 200) {
            throw new OAuthException(40007);
        };

        const errorCode = res.data.error;
        const errorMsg = res.data.error_description;
        if (errorCode !== 0) {
            throw new OAuthException(`${errorCode} ${errorMsg}`, 40007);
        };
    };

    static async getOpenId(code: any) {
        const access_token = await this.codeToToken(code);
        const openIdUrl = `${qq.openIdUrl}?access_token=${access_token}&fmt=json`;

        const res = await axios.get(openIdUrl);
        if (res.status !== 200) {
            throw new OAuthException(40009);
        };

        const errorCode = res.data.error;
        const errorMsg = res.data.error_description;
        if (errorCode !== 0) {
            throw new OAuthException(`${errorCode} ${errorMsg}`, 40009);
        };

        let user = await OAuthValidator(res.data.openid);
        if (!user) {
            user = await User.create({
                user_id: res.data.openid,
                user_type: 0,
            });
            user = user.toJSON();
        };

        const userMessage = await this.getUserMessage(access_token, res.data.openid);
        const token = generateToken(user.id, user.user_type);

        return {
            token,
            userMessage,
        };
    };

    static async codeToToken(code: any) {
        const tokenUrl =
            `${qq.tokenUrl}?client_id=${qq.appId}&client_secret=${qq.appKey}&code=${code}&redirect_uri=${encodeURIComponent(qq.redirectUrl)}&grant_type=authorization_code&fmt=json`;

        const res = await axios.get(tokenUrl);
        if (res.status !== 200) {
            throw new OAuthException(40008);
        };

        const errorCode = res.data.error;
        const errorMsg = res.data.error_description;
        if (errorCode !== 0) {
            throw new OAuthException(`${errorCode} ${errorMsg}`, 40008);
        };

        return res.data.access_token;
    };

    static async getUserMessage(access_token: any, openid: any) {
        const userMessageUrl =
            `${qq.userMessageUrl}?access_token=${access_token}&oauth_consumer_key=${qq.appId}&openid=${openid}`;

        const res = await axios.get(userMessageUrl);
        if (res.status !== 200) {
            throw new OAuthException(40010);
        };

        const errorCode = res.data.error;
        const errorMsg = res.data.error_description;
        if (errorCode !== 0) {
            throw new OAuthException(`${errorCode} ${errorMsg}`, 40010);
        };

        const { nickname, figureurl_qq_1 } = res.data;
        const userMessage = {
            nickname,
            avatar: figureurl_qq_1,
        };

        return userMessage;
    };
};

export default QQManager;