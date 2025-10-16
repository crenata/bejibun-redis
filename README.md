<div align="center">

![GitHub top language](https://img.shields.io/github/languages/top/crenata/bejibun-redis)
![GitHub all releases](https://img.shields.io/github/downloads/crenata/bejibun-redis/total)
![GitHub issues](https://img.shields.io/github/issues/crenata/bejibun-redis)
![GitHub](https://img.shields.io/github/license/crenata/bejibun-redis)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/crenata/bejibun-redis?display_name=tag&include_prereleases)

</div>

# Redis for Bejibun
Redis package with Built-in Bun for Bejibun Framework.

## Usage

### Installation
Install the package.

```bash
# Using Bun
bun add @bejibun/redis

# Using Bejibun
bun ace install @bejibun/redis
```

### Configuration
Add `redis.ts` inside config directory on your project

```bash
config/redis.ts
```

```ts
const config: Record<string, any> = {
    default: "local",

    connections: {
        local: {
            host: "127.0.0.1",
            port: 6379,
            password: "",
            database: 0,
            maxRetries: 10
        }
    }
};

export default config;
```

You can pass the value with environment variables.

### How to Use
How to use tha package.

```ts
import Redis from "@bejibun/Redis";
import {BunRequest} from "bun";
import BaseController from "@/app/controllers/BaseController";

export default class TestController extends BaseController {
    public async redis(request: BunRequest): Promise<Response> {
        await Redis.set("redis", {hello: "world"});
        const redis = await Redis.get("redis");

        const pipeline = await Redis.pipeline((pipe: RedisPipeline) => {
            pipe.set("redis-pipeline-1", "This is redis pipeline 1");
            pipe.set("redis-pipeline-2", "This is redis pipeline 2");

            pipe.get("redis-pipeline-1");
            pipe.get("redis-pipeline-2");
        });

        const subscriber = await Redis.subscribe("redis-subscribe", (message: string, channel: string) => {
            console.log(`[${channel}]: ${message}`);
        });
        await Redis.publish("redis-subscribe", "Hai redis subscriber!");
        setTimeout(async () => {
            await subscriber.unsubscribe();
        }, 500);

        return super.response.setData({redis, pipeline}).send();
    }
}
```

## Contributors
- [Havea Crenata](mailto:havea.crenata@gmail.com)

## ☕ Support / Donate

If you find this project helpful and want to support it, you can donate via PayPal :

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal)](https://paypal.me/hafiizhghulam)

Or if you are prefer using crypto :

| EVM | Solana |
| --- | ------ |
| <img src="https://github.com/crenata/bejibun/blob/master/public/images/EVM.png?raw=true" width="150" /> | <img src="https://github.com/crenata/bejibun/blob/master/public/images/SOL.png?raw=true" width="150" /> |
| 0xdABe8750061410D35cE52EB2a418c8cB004788B3 | GAnoyvy9p3QFyxikWDh9hA3fmSk2uiPLNWyQ579cckMn |