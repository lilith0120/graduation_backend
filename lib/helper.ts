import { SuccessException } from "../core/http-exception";

const success = (msg = null) => {
    throw new SuccessException(msg);
};

export {
    success,
};