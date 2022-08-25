import fs from "fs";
import path from "path/posix";
import type Router from "@pxe/router";
import { Module } from "module";

async function resolveImport(path: string) {
    const res = await import(path);
    return res?.default || res;
}

/**
 * @param dir 
 */
export function routesSync(dir: string): Router[] {
    if (!module.require)
        // @ts-ignore
        module.require = Module.createRequire(import.meta?.url);

    const list = [];

    for (const file of fs.readdirSync(dir)) {
        const filePath = path.resolve(dir, file);

        if (filePath.endsWith("index.js"))
            list.push(module.require(filePath));
        else if (fs.statSync(filePath).isDirectory())
            list.push(...routesSync(filePath));
    }

    return list;
}

export async function routes(dir: string): Promise<Router[]> {
    const list = [];

    for (const file of await fs.promises.readdir(dir)) {
        const filePath = path.resolve(dir, file);

        if (filePath.endsWith("index.js") || filePath.endsWith("index.mjs"))
            list.push(await resolveImport(filePath));
        else if (fs.statSync(filePath).isDirectory())
            list.push(...await routes(filePath));
    }

    return list;
}

