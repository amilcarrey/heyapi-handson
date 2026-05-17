import { createClient, createConfig } from "./client-v2/client";
import * as sdk from "./client-v2/sdk.gen";

export interface CreateTurtleV2ClientOptions {
  apiKey: string;
  baseUrl?: string;
}

type SdkV2 = typeof sdk;

export function createTurtleV2Client({
  apiKey,
  baseUrl = "https://earn.turtle.xyz",
}: CreateTurtleV2ClientOptions): SdkV2 {
  const localClient = createClient(
    createConfig({
      baseUrl,
      headers: { Authorization: `Bearer ${apiKey}` },
    }),
  );

  return new Proxy({} as SdkV2, {
    get(_target, prop: string | symbol) {
      const value = (sdk as Record<string | symbol, unknown>)[prop];
      if (typeof value !== "function") return value;
      const fn = value as (options?: Record<string, unknown>) => unknown;
      return (options?: Record<string, unknown>) =>
        fn({ ...(options ?? {}), client: localClient });
    },
  });
}
