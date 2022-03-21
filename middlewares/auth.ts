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

            let decode: any;
            try {
                decode = jwt.verify(token, auth.secretKey);

                ctx.auth = {
                    id: decode.uid,
                    userType: decode.scope,
                };
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new Foribbiden(43001);
                };

                throw new Foribbiden();
            };

            if (decode.scope < this.level) {
                throw new Foribbiden(43002);
            }
            await next();
        };
    }
};

export default Auth;