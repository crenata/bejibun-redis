import { defineValue } from "@bejibun/core";
export default class RedisException extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = "RedisException";
        this.code = defineValue(code, 503);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RedisException);
        }
    }
}
