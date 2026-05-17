// SDK público — punto de entrada.
// Cada versión del API tiene su propio cliente + sus propios tipos.

export {
  createTurtleV1Client,
  type CreateTurtleV1ClientOptions,
} from "./createTurtleV1Client";
export {
  createTurtleV2Client,
  type CreateTurtleV2ClientOptions,
} from "./createTurtleV2Client";

// Re-export de tipos por versión. Los consumidores los importan así:
//   import type { v1 } from 'heyapi-handson';
//   const opp: v1.Opportunity = ...
export * as v1 from "./client-v1/types.gen";
export * as v2 from "./client-v2/types.gen";
