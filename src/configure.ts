import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import path from "path";

const configPath: string = path.resolve(__dirname, "config");

const configs: Array<string> = Array.from(new Bun.Glob("**/*").scanSync({
    cwd: configPath
}));

for (const config of configs) {
    await Bun.write(App.Path.configPath(config), await Bun.file(path.resolve(configPath, config)).text());

    Logger.setContext("CONFIGURE").info(`Copying ${config} into config/${config}`);
}