import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty, isNotEmpty } from "@bejibun/utils";
import { EventEmitter } from "events";
import fs from "fs";
import RedisConf from "../config/redis";
import RedisException from "../exceptions/RedisException";
export default class RedisBuilder {
    static clients = {};
    static emitter = new EventEmitter();
    static connection(name) {
        return {
            del: (key) => this.del(key, name),
            get: (key) => this.get(key, name),
            pipeline: (fn) => this.pipeline(fn, name),
            publish: (channel, message) => this.publish(channel, message, name),
            set: (key, value, ttl) => this.set(key, value, ttl, name),
            subscribe: (channel, listener) => this.subscribe(channel, listener, name),
        };
    }
    static async connect(name) {
        const client = this.getClient(name);
        await client.connect();
        Logger.setContext("Redis").info(`Connected manually to "${defineValue(name, "default")}" connection.`);
        this.emitter.emit("connect", defineValue(name, "default"));
        return client;
    }
    static async disconnect(name) {
        if (isNotEmpty(name)) {
            const client = this.clients[name];
            if (isNotEmpty(client)) {
                await client.close();
                delete this.clients[name];
                Logger.setContext("Redis").warn(`Disconnected manually from "${name}" connection.`);
            }
        }
        else {
            for (const [connectionName, client] of Object.entries(this.clients)) {
                await client.close();
                Logger.setContext("Redis").warn(`Disconnected manually from "${connectionName}" connection.`);
            }
            this.clients = {};
        }
    }
    static async get(key, connection) {
        const response = await this.getClient(connection).get(key);
        return this.deserialize(response);
    }
    static async set(key, value, ttl, connection) {
        const client = this.getClient(connection);
        const serialized = this.serialize(value);
        const data = await client.set(key, serialized);
        if (isNotEmpty(ttl))
            return await client.expire(key, ttl);
        return data;
    }
    static async del(key, connection) {
        return await this.getClient(connection).del(key);
    }
    static async publish(channel, message, connection) {
        const serialized = this.serialize(message);
        return await this.getClient(connection).publish(channel, serialized);
    }
    static async subscribe(channel, listener, connection) {
        const cfg = this.getConfig(connection);
        const client = this.createClient(this.config.default, cfg);
        this.clients[channel] = client;
        await client.subscribe(channel, (message, channel) => listener(this.deserialize(message), channel));
        Logger.setContext("Redis").info(`Subscribed to "${channel}" channel.`);
        const unsubscribe = async () => {
            await client.unsubscribe(channel);
            await client.close();
            Logger.setContext("Redis").warn(`Unsubscribed from "${channel}" channel.`);
            return true;
        };
        return {
            client,
            unsubscribe: unsubscribe
        };
    }
    static async pipeline(fn, connection) {
        const client = this.getClient(connection);
        const ops = [];
        const pipe = {
            del: (key) => {
                ops.push(client.del(key));
            },
            get: (key) => {
                ops.push(client.get(key));
            },
            set: (key, value, ttl) => {
                const serialized = this.serialize(value);
                const data = client.set(key, serialized);
                if (isNotEmpty(ttl))
                    ops.push(client.expire(key, ttl));
                ops.push(data);
            }
        };
        fn(pipe);
        const results = await Promise.all(ops);
        return results.map((result) => this.deserialize(result));
    }
    static on(event, listener) {
        this.emitter.on(event, listener);
    }
    static off(event, listener) {
        this.emitter.off(event, listener);
    }
    static get config() {
        let config;
        const configPath = App.Path.configPath("redis.ts");
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = RedisConf;
        return config;
    }
    static buildUrl(cfg) {
        const url = new URL(`redis://${cfg.host}:${cfg.port}`);
        if (isNotEmpty(cfg.password))
            url.password = cfg.password;
        if (isNotEmpty(cfg.database))
            url.pathname = `/${cfg.database}`;
        return url.toString();
    }
    static createClient(name, cfg) {
        const url = this.buildUrl(cfg);
        const client = new Bun.RedisClient(url, this.getOptions(cfg));
        client.onconnect = () => {
            Logger.setContext("Redis").info(`Connected to "${name}" connection.`);
            this.emitter.emit("connect", name);
        };
        client.onclose = (error) => {
            Logger.setContext("Redis").warn(`Disconnected from "${name}" connection.`).trace(error);
            this.emitter.emit("disconnect", name, error);
        };
        return client;
    }
    static getOptions(cfg) {
        return {
            autoReconnect: true,
            maxRetries: cfg.maxRetries
        };
    }
    static getConfig(name) {
        const connectionName = defineValue(name, this.config.default);
        const connection = this.config.connections[connectionName];
        if (isEmpty(connection))
            throw new RedisException(`Connection "${connectionName}" not found.`);
        return connection;
    }
    static getClient(name) {
        const connectionName = defineValue(name, this.config.default);
        this.ensureExitHooks();
        if (isEmpty(this.clients[connectionName])) {
            const cfg = this.getConfig(connectionName);
            this.clients[connectionName] = this.createClient(connectionName, cfg);
        }
        return this.clients[connectionName];
    }
    static serialize(value) {
        if (isEmpty(value))
            return "";
        if (typeof value === "object")
            return JSON.stringify(value);
        if (typeof value === "number" || typeof value === "boolean")
            return String(value);
        return value;
    }
    static deserialize(value) {
        if (isEmpty(value))
            return null;
        try {
            return JSON.parse(value);
        }
        catch (error) {
            return value;
        }
    }
    static ensureExitHooks() {
        this.setupExitHooks();
    }
    static setupExitHooks = (() => {
        let initialized = false;
        return () => {
            if (initialized)
                return;
            initialized = true;
            const handleExit = async (signal) => {
                try {
                    await RedisBuilder.disconnect();
                    Logger.setContext("Redis").warn(`Disconnected on "${defineValue(signal, "exit")}".`);
                }
                catch (error) {
                    Logger.setContext("Redis").error("Error during disconnect.").trace(error);
                }
                finally {
                    process.exit(0);
                }
            };
            process.on("exit", async () => {
                await handleExit();
            });
            process.on("SIGINT", async () => {
                await handleExit("SIGINT");
            });
            process.on("SIGTERM", async () => {
                await handleExit("SIGTERM");
            });
        };
    })();
}
