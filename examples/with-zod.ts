// Demo del plugin `zod`.
//
// El plugin genera un schema zod para CADA tipo del spec (request, response,
// path params, query params, body, components.schemas). Convención de nombre:
// `z` + nombre del tipo, ej: `GetOpportunitiesResponse` → `zV1GetOpportunitiesResponse`.
//
// Para qué sirven en producción:
//
//   1. Validar la response del API en runtime. Si el backend rompe el
//      contrato (campo removido, tipo cambiado, etc), el zod tira un error
//      VS un error silencioso en el código consumer.
//
//   2. Validar inputs antes de mandarlos (forms, CLI, etc).
//
//   3. Inferir el tipo desde el schema: `z.infer<typeof zV1GetOpportunitiesResponse>`.

import { createTurtleV1Client } from "../src/index";
import { zV1GetOpportunitiesResponse } from "../src/client-v1/zod.gen";

async function main() {
  const v1 = createTurtleV1Client({
    apiKey: process.env.TURTLE_API_KEY ?? "",
    baseUrl: "https://earn.turtle.xyz",
  });

  const { data, error } = await v1.getOpportunities();
  if (error) {
    console.error("✖ HTTP error:", error);
    return;
  }

  // ─── Validación runtime ────────────────────────────────────────────────────
  // safeParse devuelve { success: true, data } | { success: false, error }
  const parsed = zV1GetOpportunitiesResponse.safeParse(data);

  if (parsed.success) {
    console.log("✓ zod validó la response — el backend honra el contrato del spec");
    console.log("  opportunities:", parsed.data.opportunities?.length ?? 0);
  } else {
    console.error("✖ zod rechazó la response — drift entre backend y spec!");
    console.error(parsed.error.issues.slice(0, 3));
  }

  // ─── Inferir tipo desde el schema (alternativa al import de types.gen.ts) ──
  // type OpportunitiesResp = z.infer<typeof zV1GetOpportunitiesResponse>;
  //
  // Si tu app vive 100% en mundo zod, podés derivar todos los tipos así y
  // saltearte `types.gen.ts`.
}

main().catch((err) => {
  console.error("✖ Excepción:", err);
  process.exit(1);
});
