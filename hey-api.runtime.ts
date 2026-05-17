// Runtime config para el cliente v2.
//
// Este archivo se referencia desde `openapi-ts.config.ts` vía
// `output.runtimeConfigPath`. Hey-api enchufa este `createClientConfig`
// al cliente generado, así no hace falta un wrapper `createTurtleV2Client`
// que el consumidor tenga que invocar — el cliente ya viene configurado.
//
// Trade-off vs wrapper:
//   - PRO: el consumidor importa funciones y las llama. Cero setup.
//   - CON: una sola config global. Si necesitás múltiples instancias con
//          distintas API keys, esto NO sirve — usá el patrón wrapper (v1).

import type { CreateClientConfig } from "./src/client-v2/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: process.env.TURTLE_BASE_URL ?? "https://earn.turtle.xyz",
  headers: {
    ...config?.headers,
    Authorization: `Bearer ${process.env.TURTLE_API_KEY ?? ""}`,
  },
});
