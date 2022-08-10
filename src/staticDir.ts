import { Middleware } from "@pxe/server";
import fs from "fs/promises";

function staticDirectory(dir: string = "public"): Middleware {
    return async (ctx, next, ...args) => {
        const path = ctx.request.url.substring(1);

        if (path.startsWith(dir))
            ctx.response.body = await fs.readFile("./" + path);

        await next(...args);
    }
}

export = staticDirectory;