import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // The generated SDK references peerDeps; bundle them out, the consumer brings them.
  external: ["@hey-api/client-fetch", "zod", "@tanstack/react-query"],
});
