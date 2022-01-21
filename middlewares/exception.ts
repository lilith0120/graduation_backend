import { HttpException } from "../core/http-exception";

const catchError = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        if (error instanceof HttpException) {
            const { msg, errorCode, code } = error;
            ctx.body = {
                msg,
                code: errorCode,
                requestUrl: `${ctx.method} ${ctx.path}`,
            };
            ctx.status = code;
        } else {
            ctx.body = {
                msg: "未知异常",
                code: 23333,
                requestUrl: `${ctx.method} ${ctx.path}`,
            };
            ctx.status = 500;
        }
    }
};

export default catchError;