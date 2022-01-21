import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { Foribbiden } from '../core/http-exception';

const { auth } = config;

class Auth {
    level: Number;

    constructor(level = 0) {
        this.level = level;
    };

    get verify() {
        return async (ctx: any, next: any) => {
            const { token } = ctx.request.header;
            if (!token) {
                throw new Foribbiden();
            };

            try {
                const decode: any = jwt.verify(token, auth.secretKey);

                ctx.auth = {
                    userId: decode.uid,
                    userType: decode.scope,
                };

                if (decode.scope < this.level) {
                    throw new Foribbiden(43002);
                }

                await next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new Foribbiden(43001);
                };

                throw new Foribbiden();
            };
        };
    }
};

export default Auth;