import * as jwt from 'jsonwebtoken';
import config from '../config/config';

const { auth } = config;

const generateToken = (uid: any, scope: any) => {
    const { secretKey, expiresIn } = auth;
    const token = jwt.sign({
        uid,
        scope,
    }, secretKey, {
        expiresIn,
    });

    return token;
};

export {
    generateToken,
};