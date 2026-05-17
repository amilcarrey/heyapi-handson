// Demo (snippet — NO ejecutable acá, requiere React) del plugin
// `@tanstack/react-query`.
//
// El plugin genera, para CADA operación, helpers tipo:
//
//   <op>QueryKey(args)         → arma queryKey estable y tipado
//   <op>Options(args)          → objeto pasable a useQuery
//   <op>InfiniteQueryKey(args) → para useInfiniteQuery
//   <op>InfiniteOptions(args)  → idem
//   <op>Mutation(args)         → objeto pasable a useMutation (para POST/PUT/DELETE)
//
// Convención de nombre: el plugin tanstack usa los `operationId` ORIGINALES
// del spec, NO los nombres limpios del plugin `sdk.operations.methodName`.
// Si querés alinear, usá las opciones `queryKeys`, `queryOptions`,
// `mutationOptions` del plugin con su propio NameTransformer.
//
// Este archivo es .tsx para que TS lo lea como JSX. Lo dejamos como ejemplo
// de uso; no se corre como parte de `pnpm example`.

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

import {
  // v1
  getOpportunitiesOptions,
  getOpportunityByIdOptions,
  createDepositInteractionMutation,
  // v2 (mismo plugin, nombres con prefijo handlersV2 porque el operationId
  // del spec viene así y el plugin tanstack no aplica el methodName del sdk)
  handlersV2GetChainsHandlerOptions,
  handlersV2GetOpportunityHistoricalTvlHandlerOptions,
} from "../src/client-v1/@tanstack/react-query.gen";

// ──────────────────────────────────────────────────────────────────────────
// useQuery: lista opportunities
// ──────────────────────────────────────────────────────────────────────────
function OpportunitiesList() {
  const { data, isLoading, error } = useQuery(getOpportunitiesOptions());

  if (isLoading) return <p>Cargando…</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <ul>
      {data?.opportunities?.map((opp) => (
        <li key={opp.id}>{opp.name}</li>
      ))}
    </ul>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// useQuery con path param
// ──────────────────────────────────────────────────────────────────────────
function OpportunityDetail({ id }: { id: string }) {
  const { data } = useQuery(
    getOpportunityByIdOptions({ path: { id } }),
  );
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

// ──────────────────────────────────────────────────────────────────────────
// useMutation: hacer un deposit
// ──────────────────────────────────────────────────────────────────────────
function DepositButton({ opportunityId }: { opportunityId: string }) {
  const mutation = useMutation(createDepositInteractionMutation());

  return (
    <button
      onClick={() =>
        mutation.mutate({
          path: { opportunityId },
          body: {
            /* payload tipado */
          } as never,
        })
      }
    >
      Depositar
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// useInfiniteQuery: chains paginados
// ──────────────────────────────────────────────────────────────────────────
function ChainsList() {
  const { data } = useInfiniteQuery({
    ...handlersV2GetChainsHandlerOptions(),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.pagination?.nextPage,
  });
  return <div>{data?.pages.length} páginas cargadas</div>;
}

// ──────────────────────────────────────────────────────────────────────────
// Lo bueno de este plugin:
//
//   - queryKey tipados + estables (no más bugs por inconsistencias)
//   - cero código de query/mutation wrappers a mano
//   - el .gen importa de tu sdk.gen, así que la auth/baseUrl que configuraste
//     en client.gen.ts (o via runtimeConfigPath para v2) se aplica solo
//
// El trade-off: tu paquete npm queda "atado" a React Query. Si tu SDK quiere
// ser framework-agnostic, NO incluyas este plugin en el build principal —
// publicalo como sub-paquete `@turtle/sdk-react`.

export { OpportunitiesList, OpportunityDetail, DepositButton, ChainsList };
