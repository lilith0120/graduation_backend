import * as redis from 'redis';
import { RedisException } from './http-exception';

const config: any = {
    port: 6370,
    password: "wuhan20001226",
};

const client = redis.createClient({
    socket: {
        port: config.port,
    },
    password: config.password,
});

client.on('error', (err) => {
    throw new RedisException(err);
});
client.connect();

const setCode = async (key: any, value: any, expire = 60 * 5) => {
    try {
        await client.set(key, value);
        await client.expire(key, expire);
    } catch (err) {
        throw new RedisException(err.message);
    }
};

const getCode = async (key: any) => {
    try {
        return await client.get(key);
    } catch (err) {
        throw new RedisException(err.message);
    }
};

export {
    setCode,
    getCode,
};