import { createClient, createConfig } from "./client/client";
import * as sdk from "./client/sdk.gen";

export interface CreateTurtleClientOptions {
  apiKey: string;
  baseUrl?: string;
}

type SdkModule = typeof sdk;

export function createTurtleClient({
  apiKey,
  baseUrl = "https://earn.turtle.xyz",
}: CreateTurtleClientOptions): SdkModule {
  const localClient = createClient(
    createConfig({
      baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }),
  );

  return new Proxy({} as SdkModule, {
    get(_target, prop: string | symbol) {
      const value = (sdk as Record<string | symbol, unknown>)[prop];
      if (typeof value !== "function") return value;
      const fn = value as (options?: Record<string, unknown>) => unknown;
      return (options?: Record<string, unknown>) =>
        fn({ ...(options ?? {}), client: localClient });
    },
  });
}
