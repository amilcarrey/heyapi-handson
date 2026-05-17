# heyapi-handson

PoC de un SDK TypeScript autogenerado desde un OpenAPI spec usando [`@hey-api/openapi-ts`](https://heyapi.dev).

Spec de prueba: `https://earn.turtle.xyz/v1/docs/openapi.json` (Turtle Earn API).

## Qué hace

- Genera tipos + cliente runtime + funciones tipadas por endpoint desde el OpenAPI
- Empaqueta un wrapper mínimo `createTurtleClient({ apiKey, baseUrl })` para DX limpia
- GitHub Action que re-genera el SDK en cada cambio del spec y abre PR

## Scripts

```bash
pnpm install           # instalar deps
pnpm codegen           # regenerar src/client/ desde el OpenAPI
pnpm typecheck         # validar tipos
pnpm example           # correr examples/basic.ts (necesita TURTLE_API_KEY)
```

## Uso

```ts
import { createTurtleV1Client, createTurtleV2Client, v1, v2 } from './src';

const apiV1 = createTurtleV1Client({ apiKey, baseUrl: 'https://earn.turtle.xyz' });
const opps = await apiV1.getOpportunities();

const apiV2 = createTurtleV2Client({ apiKey, baseUrl: 'https://earn.turtle.xyz' });
const chains = await apiV2.handlersV2GetChainsHandler();

// Tipos por versión:
const opp: v1.Opportunity = /* ... */;
```

## Múltiples specs / múltiples APIs

`openapi-ts.config.ts` exporta un **array de configs**: cada entry es un codegen
independiente con su propio `input`, `output` y filtros.

- **Mismo API, distinta versión**: dos entries con el mismo `input` y filtros
  `parser.filters.operations.include` por path (regex `^[A-Z]+ \/v1\/`).
- **Otra API entera**: un entry más con otro `input`, `output: './src/client-otra'`
  y su propio wrapper `createOtraClient.ts`. Mismo patrón.

## Workflow de sync

`.github/workflows/sync-sdk.yml` corre:

- Manualmente (`workflow_dispatch`)
- Cada día a las 06:00 UTC (cron)

Si detecta cambios en el spec, abre un PR con `src/client/` regenerado. Vos revisás el diff (¿se rompió algo?), mergeás, y listo.

Más adelante: sumar `repository_dispatch` desde el merge a main del repo del API para trigger real-time.

## Stack y decisiones

- `@hey-api/openapi-ts` con plugins `client-fetch` + `sdk` (flat) + `typescript`
- Tree-shakeable: cada endpoint es una función exportada
- v1 expone wrapper parametrizable `createTurtleV1Client({ apiKey, baseUrl })`
- v2 expone funciones pre-configuradas via `runtimeConfigPath` (lee env)

### Features del codegen aplicadas

| Feature | Dónde se ve |
|---|---|
| **Array de configs** | `openapi-ts.config.ts` exporta `defineConfig([v1, v2, ...])` |
| **Filtros por path** | `parser.filters.operations.include` separa v1 y v2 de la misma spec |
| **Naming custom** | `sdk.operations.methodName.name` strip `handlersV\d+` / `Handler$` |
| **Enums como objetos JS** | `typescript.enums: 'javascript'` (evita footgun de TS enums) |
| **Runtime config** | `client-fetch.runtimeConfigPath` apunta a `hey-api.runtime.ts` (solo v2) |
| **Split por tag** | `parser.hooks.symbols.getFilePath` parte el SDK en `sdk/<tag>.gen.ts` (solo v1) |

## Pendientes para producción

- [ ] `tsup` + `package.json#exports` para builds ESM+CJS
- [ ] `changesets` para versionado semver
- [ ] `oasdiff` para detectar breaking changes en el PR
- [ ] `npm publish` automático
- [ ] `repository_dispatch` desde el repo del API
