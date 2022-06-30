import { Middleware } from "@pxe/server";
import fs from "fs";

function staticDirectory(dir: string = "public"): Middleware {
    return async (ctx, next, ...args) => {
        const path = ctx.request.url.substring(1);

        if (path.startsWith(dir))
            ctx.response.body = fs.readFileSync("./" + path).toString();

        await next(...args);
    }
}

export = staticDirectory;