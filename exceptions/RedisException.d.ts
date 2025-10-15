export default class RedisException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
