// Demo de los dos patrones expuestos por el SDK.
//
// v1 → wrapper parametrizable (creás tu propia instancia)
// v2 → funciones pre-configuradas via runtimeConfigPath (lee TURTLE_API_KEY de env)

import { createTurtleV1Client, v2GetChains } from "../src/index";

async function main() {
  const apiKey = process.env.TURTLE_API_KEY ?? "";
  const baseUrl = "https://earn.turtle.xyz";

  // ─── v1: patrón wrapper ──────────────────────────────────────────────────
  const v1 = createTurtleV1Client({ apiKey, baseUrl });
  console.log("→ [v1] getOpportunities()");
  const opps = await v1.getOpportunities();
  if (opps.error) {
    console.error("✖ [v1] error:", opps.response?.status, opps.error);
  } else {
    console.log("✓ [v1] HTTP", opps.response?.status);
    console.log("✓ [v1] data:");
    console.dir(opps.data, { depth: null, colors: true });
  }

  // ─── v2: patrón runtimeConfigPath (cero setup acá) ───────────────────────
  // Notá que NO hay `createTurtleV2Client({...})` — el client ya está
  // configurado desde hey-api.runtime.ts.
  console.log("\n→ [v2] v2GetChains()");
  const chains = await v2GetChains();
  if (chains.error) {
    console.error("✖ [v2] error:", chains.response?.status, chains.error);
  } else {
    console.log("✓ [v2] HTTP", chains.response?.status);
    console.log("✓ [v2] data:");
    console.dir(chains.data, { depth: null, colors: true });
  }
}

main().catch((err) => {
  console.error("✖ Excepción no capturada:", err);
  process.exit(1);
});
