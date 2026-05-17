import { defineConfig } from "@hey-api/openapi-ts";

// `defineConfig` acepta un array → podés tener N specs en una sola config.
// Cada entry es un codegen independiente: input propio, filtros propios, output propio.
// Para agregar otra API entera, sumás un objeto más a este array (ejemplo al final).

// Limpia nombres de operaciones que vienen feos del spec.
// Ejemplos en turtle: `handlersV2GetChainsHandler` → `v2GetChains` → `getChains`
// (aplicamos casing camelCase después del transform).
const cleanOperationName = (name: string): string =>
  name
    // strip prefijos tipo "handlersV2", "handlersV1"
    .replace(/^handlers[A-Z]?\d*/, "")
    // strip sufijo "Handler"
    .replace(/Handler$/, "");

// Plugin SDK reutilizable: tree-shakeable (flat) con renombrado.
const sdkPlugin = {
  name: "@hey-api/sdk" as const,
  operations: {
    strategy: "flat" as const,
    methodName: {
      name: cleanOperationName,
      casing: "camelCase" as const,
    },
  },
};

// Plugin typescript con enums como objetos JS (evita footgun de TS enums).
const typescriptPlugin = {
  name: "@hey-api/typescript" as const,
  enums: "javascript" as const,
};

// Plugin Zod: genera schemas paralelos a los tipos. Útil para:
//  - Validar respuestas del API en runtime (detectar drift backend)
//  - Validar inputs antes de enviarlos
//  - Inferir tipos zod (`z.infer<typeof schema>`)
const zodPlugin = {
  name: "zod" as const,
  // Zod 4 es default. Si tu app está en zod 3, poné `compatibilityVersion: 3`.
};

// Plugin TanStack React Query: genera para cada operación helpers tipo
// `*Options()`, `*Mutation()`, `*QueryKey()`, `*InfiniteOptions()` que se
// spreadean en `useQuery`/`useMutation`/`useInfiniteQuery`.
const tanstackPlugin = {
  name: "@tanstack/react-query" as const,
};

export default defineConfig([
  // ─── Turtle Earn API — v1 (patrón "wrapper parametrizable") ────────────────
  // El consumidor llama `createTurtleV1Client({ apiKey, baseUrl })` para crear
  // su propia instancia. Útil cuando una app necesita múltiples instancias
  // con distintos credentials.
  //
  // Además de los wrappers + naming, este entry usa `parser.hooks.symbols
  // .getFilePath` para PARTIR el sdk.gen.ts por tag. En vez de un archivo
  // monolítico, las operaciones se distribuyen en `sdk/actions.gen.ts`,
  // `sdk/streams.gen.ts`, etc. Útil cuando el spec crece. El meta del símbolo
  // expone `{ pluginName, resource, tags, path, resourceId, ... }`.
  {
    input: "https://earn.turtle.xyz/v1/docs/openapi.json",
    output: { path: "./src/client-v1", format: "prettier" },
    parser: {
      filters: { operations: { include: ["/^[A-Z]+ \\/v1\\//"] } },
      hooks: {
        symbols: {
          getFilePath: (symbol) => {
            const meta = symbol.meta as
              | { pluginName?: string; resource?: string; tags?: string[] }
              | undefined;
            if (
              meta?.pluginName === "@hey-api/sdk" &&
              meta?.resource === "operation" &&
              meta?.tags?.[0]
            ) {
              const tag = meta.tags[0]
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              // El codegen agrega `.gen.ts` automáticamente.
              return `sdk/${tag}`;
            }
            return undefined; // fallback al default (client.gen.ts + sdk.gen.ts)
          },
        },
      },
    },
    plugins: [
      "@hey-api/client-fetch",
      sdkPlugin,
      typescriptPlugin,
      zodPlugin,
      tanstackPlugin,
    ],
  },

  // ─── Turtle Earn API — v2 (patrón "singleton con runtimeConfigPath") ───────
  // El plugin client-fetch tiene `runtimeConfigPath` apuntando a un archivo
  // local. Ese archivo exporta `createClientConfig` que setea baseUrl + auth
  // desde process.env. Cero wrapper: el consumidor importa funciones y las
  // llama. Trade-off: una sola config global (no podés tener 2 instancias con
  // distintas API keys en la misma app).
  {
    input: "https://earn.turtle.xyz/v1/docs/openapi.json",
    output: { path: "./src/client-v2", format: "prettier" },
    parser: {
      filters: { operations: { include: ["/^[A-Z]+ \\/v2\\//"] } },
    },
    plugins: [
      {
        name: "@hey-api/client-fetch",
        runtimeConfigPath: "./hey-api.runtime.ts",
      },
      sdkPlugin,
      typescriptPlugin,
      zodPlugin,
      tanstackPlugin,
    ],
  },

  // ─── Ejemplo: agregar otra API entera (otro origen) ──────────────────────
  // {
  //   input: "https://api.otra-empresa.com/openapi.json",
  //   output: { path: "./src/client-otra", format: "prettier" },
  //   plugins: ["@hey-api/client-fetch", sdkPlugin, typescriptPlugin],
  // },
]);
