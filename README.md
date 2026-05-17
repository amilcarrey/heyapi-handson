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
import { createTurtleClient } from './src';

const turtle = createTurtleClient({
  apiKey: process.env.TURTLE_API_KEY!,
  baseUrl: 'https://earn.turtle.xyz',
});

const opps = await turtle.getOpportunities();
```

## Workflow de sync

`.github/workflows/sync-sdk.yml` corre:

- Manualmente (`workflow_dispatch`)
- Cada día a las 06:00 UTC (cron)

Si detecta cambios en el spec, abre un PR con `src/client/` regenerado. Vos revisás el diff (¿se rompió algo?), mergeás, y listo.

Más adelante: sumar `repository_dispatch` desde el merge a main del repo del API para trigger real-time.

## Stack y decisiones

- `@hey-api/openapi-ts` con plugins `client-fetch` + `sdk` (flat) + `typescript`
- Tree-shakeable: cada endpoint es una función exportada
- Auth via wrapper `createTurtleClient` que inyecta `Authorization: Bearer <apiKey>` en un client local

## Pendientes para producción

- [ ] `tsup` + `package.json#exports` para builds ESM+CJS
- [ ] `changesets` para versionado semver
- [ ] `oasdiff` para detectar breaking changes en el PR
- [ ] `npm publish` automático
- [ ] `repository_dispatch` desde el repo del API
