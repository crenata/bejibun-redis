export type RedisConfig = {
    host: string;
    port: number;
    password?: string | null;
    database?: number;
    maxRetries?: number;
};
export type RedisPipeline = {
    del: (key: string) => void;
    get: (key: string) => void;
    set: (key: string, value: any, ttl?: number) => void;
};
export type RedisSubscribe = {
    client: RedisClient;
    unsubscribe: () => Promise<boolean>;
};