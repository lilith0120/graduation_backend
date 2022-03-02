import * as redis from 'redis';
import { RedisException } from './http-exception';

const config: any = {
    port: 6370,
    password: "wuhan20001226",
};

const client = redis.createClient(config.port);
client.on('error', (err) => {
    throw new RedisException(err);
});

client.auth(config.password); // 验证redis

const setString = async () => {

};

const getString = async () => {

};

export {
    setString,
    getString,
};