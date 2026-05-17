import { defineConfig } from "@hey-api/openapi-ts";

// `defineConfig` acepta un array → podés tener N specs en una sola config.
// Cada entry es un codegen independiente: input propio, filtros propios, output propio.
// Para agregar otra API entera, sumás un objeto más a este array (ejemplo al final).

export default defineConfig([
  // ─── Turtle Earn API — v1 ──────────────────────────────────────────────────
  {
    input: "https://earn.turtle.xyz/v1/docs/openapi.json",
    output: { path: "./src/client-v1", format: "prettier" },
    parser: {
      filters: {
        operations: {
          // Solo operaciones cuyo path arranca con /v1/
          include: ["/^[A-Z]+ \\/v1\\//"],
        },
      },
    },
    plugins: ["@hey-api/client-fetch", "@hey-api/sdk", "@hey-api/typescript"],
  },

  // ─── Turtle Earn API — v2 ──────────────────────────────────────────────────
  {
    input: "https://earn.turtle.xyz/v1/docs/openapi.json",
    output: { path: "./src/client-v2", format: "prettier" },
    parser: {
      filters: {
        operations: {
          include: ["/^[A-Z]+ \\/v2\\//"],
        },
      },
    },
    plugins: ["@hey-api/client-fetch", "@hey-api/sdk", "@hey-api/typescript"],
  },

  // ─── Ejemplo: para agregar otra API entera (otro origen) ──────────────────
  // Es la misma forma: input propio, output a otra carpeta, mismos plugins.
  // El wrapper de esa API vive aparte (src/createOtraClient.ts) y maneja su
  // propia auth/baseUrl.
  //
  // {
  //   input: "https://api.otra-empresa.com/openapi.json",
  //   output: { path: "./src/client-otra", format: "prettier" },
  //   plugins: ["@hey-api/client-fetch", "@hey-api/sdk", "@hey-api/typescript"],
  // },
]);
