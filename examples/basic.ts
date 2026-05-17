import { createTurtleClient } from "../src/index";

async function main() {
  const turtle = createTurtleClient({
    apiKey: process.env.TURTLE_API_KEY ?? "",
    baseUrl: "https://earn.turtle.xyz",
  });

  console.log("→ Llamando getOpportunities()...");
  const { data, error, response } = await turtle.getOpportunities();

  if (error) {
    console.error("✖ Error:", response?.status, error);
    process.exit(1);
  }

  console.log("✓ HTTP", response?.status);
  const count = Array.isArray(data) ? data.length : "(no array)";
  console.log("✓ Opportunities recibidas:", count);

  if (Array.isArray(data) && data.length > 0) {
    console.log("\n→ Primera opportunity (preview):");
    console.log(JSON.stringify(data[0], null, 2).slice(0, 400) + "...");
  }
}

main().catch((err) => {
  console.error("✖ Excepción no capturada:", err);
  process.exit(1);
});
