// register.ts
import { register } from "ts-node";
import { pathToFileURL } from "node:url";

register({
  compilerOptions: {
    module: "ESNext",
    target: "ESNext",
  },
});

const mainModule = pathToFileURL(
  "./src/services/responders/resizeThumbnailResponse.ts"
).toString();
import(mainModule).catch(console.error);
