import type { RedisPipeline, RedisSubscribe } from "@/types/redis";
import { RedisClient } from "bun";
export default class RedisBuilder {
    private static clients;
    private static emitter;
    static connection(name: string): Record<string, Function>;
    static connect(name?: string): Promise<RedisClient>;
    static disconnect(name?: string): Promise<void>;
    static get(key: RedisClient.KeyLike, connection?: string): Promise<any>;
    static set(key: RedisClient.KeyLike, value: any, ttl?: number, connection?: string): Promise<number | "OK">;
    static del(key: RedisClient.KeyLike, connection?: string): Promise<number>;
    static publish(channel: string, message: any, connection?: string): Promise<number>;
    static subscribe(channel: string, listener: RedisClient.StringPubSubListener, connection?: string): Promise<RedisSubscribe>;
    static pipeline(fn: (pipe: RedisPipeline) => void, connection?: string): Promise<any[]>;
    static on(event: "connect" | "disconnect" | "error", listener: (...args: Array<any>) => void): void;
    static off(event: "connect" | "disconnect" | "error", listener: (...args: Array<any>) => void): void;
    private static buildUrl;
    private static createClient;
    private static getOptions;
    private static getConfig;
    private static getClient;
    private static serialize;
    private static deserialize;
    private static ensureExitHooks;
    private static setupExitHooks;
}
