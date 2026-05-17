// SDK público — punto de entrada.
// Cada versión del API muestra un patrón distinto a propósito:
//
//   v1 → patrón "wrapper parametrizable" (createTurtleV1Client({apiKey, baseUrl}))
//        El consumidor crea su propia instancia. Soporta N instancias con
//        distintos credentials en la misma app.
//
//   v2 → patrón "singleton con runtimeConfigPath"
//        El cliente generado ya viene configurado desde hey-api.runtime.ts
//        (lee process.env). Cero setup en el call site, pero solo UNA config
//        global por proceso. Para SDK npm público, normalmente preferís el
//        patrón wrapper (v1).

// ─── v1: wrapper parametrizable ───────────────────────────────────────────
export {
  createTurtleV1Client,
  type CreateTurtleV1ClientOptions,
} from "./createTurtleV1Client";

// ─── v2: funciones pre-configuradas (re-export directo) ───────────────────
export * from "./client-v2/sdk.gen";

// ─── Tipos por versión, accesibles como namespaces ────────────────────────
export * as v1 from "./client-v1/types.gen";
export * as v2 from "./client-v2/types.gen";
