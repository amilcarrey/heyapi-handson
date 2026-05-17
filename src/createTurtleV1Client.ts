import { createClient, createConfig } from "./client-v1/client";
// El `index.ts` del cliente re-exporta todas las funciones (incluidas las que
// están en `sdk/*.gen.ts` por el split por tag).
import * as sdk from "./client-v1";

export interface CreateTurtleV1ClientOptions {
  apiKey: string;
  baseUrl?: string;
}

type SdkV1 = typeof sdk;

export function createTurtleV1Client({
  apiKey,
  baseUrl = "https://earn.turtle.xyz",
}: CreateTurtleV1ClientOptions): SdkV1 {
  const localClient = createClient(
    createConfig({
      baseUrl,
      headers: { Authorization: `Bearer ${apiKey}` },
    }),
  );

  return new Proxy({} as SdkV1, {
    get(_target, prop: string | symbol) {
      const value = (sdk as Record<string | symbol, unknown>)[prop];
      if (typeof value !== "function") return value;
      const fn = value as (options?: Record<string, unknown>) => unknown;
      return (options?: Record<string, unknown>) =>
        fn({ ...(options ?? {}), client: localClient });
    },
  });
}
