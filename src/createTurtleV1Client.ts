import { createClient, createConfig } from "./client-v1/client";
import * as sdk from "./client-v1/sdk.gen";

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
