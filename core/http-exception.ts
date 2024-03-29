import codeMessage from "../config/code-message";

class HttpException extends Error {
    errorCode: number;
    code: number;
    msg: string;

    constructor(msg = "服务器异常", errorCode = 10000, code = 400) {
        super();
        this.msg = msg;
        this.errorCode = errorCode;
        this.code = code;
    }
};

class OAuthException extends HttpException {
    constructor(errorCode = 40000, msg = null) {
        super();
        this.msg = msg || codeMessage.getMessage(errorCode);
        this.errorCode = errorCode;
        this.code = 200;
    }
};

class Foribbiden extends HttpException {
    constructor(errorCode = 43000) {
        super();
        this.msg = codeMessage.getMessage(errorCode);
        this.errorCode = errorCode;
        this.code = 401;
    }
};

class SuccessException extends HttpException {
    constructor(msg = null, errorCode = 0) {
        super();
        this.errorCode = errorCode;
        this.msg = msg || codeMessage.getMessage(errorCode);
        this.code = 200;
    }
};

class RedisException extends HttpException {
    constructor(msg = null, errorCode = 42000) {
        super();
        this.msg = msg || codeMessage.getMessage(errorCode);
        this.errorCode = errorCode;
        this.code = 200;
    }
};

class RoleException extends HttpException {
    constructor(errorCode = 44000, msg = null) {
        super();
        this.msg = msg || codeMessage.getMessage(errorCode);
        this.errorCode = errorCode;
        this.code = 200;
    };
};

class SqlException extends HttpException {
    constructor(msg = null, errorCode = 45000) {
        super();
        this.msg = msg || codeMessage.getMessage(errorCode);
        this.errorCode = errorCode;
        this.code = 200;
    };
};

export {
    HttpException,
    OAuthException,
    Foribbiden,
    SuccessException,
    RedisException,
    RoleException,
    SqlException,
};