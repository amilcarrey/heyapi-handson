import { createTurtleV1Client, createTurtleV2Client } from "../src/index";

async function main() {
  const apiKey = process.env.TURTLE_API_KEY ?? "";
  const baseUrl = "https://earn.turtle.xyz";

  // ─── v1: getOpportunities ─────────────────────────────────────────────────
  const v1 = createTurtleV1Client({ apiKey, baseUrl });
  console.log("→ [v1] getOpportunities()");
  const opps = await v1.getOpportunities();
  if (opps.error) {
    console.error("✖ [v1] error:", opps.response?.status, opps.error);
  } else {
    console.log("✓ [v1] HTTP", opps.response?.status);
  }

  // ─── v2: handlersV2GetChainsHandler ───────────────────────────────────────
  const v2 = createTurtleV2Client({ apiKey, baseUrl });
  console.log("\n→ [v2] handlersV2GetChainsHandler()");
  const chains = await v2.handlersV2GetChainsHandler();
  if (chains.error) {
    console.error("✖ [v2] error:", chains.response?.status, chains.error);
  } else {
    console.log("✓ [v2] HTTP", chains.response?.status);
    if (Array.isArray(chains.data)) {
      console.log("✓ [v2] chains recibidas:", chains.data.length);
    }
  }
}

main().catch((err) => {
  console.error("✖ Excepción no capturada:", err);
  process.exit(1);
});
