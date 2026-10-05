import type { Entity, Resource, Space, User, ResourceData, ListQuery } from '@finances/contracts';
import type { paths } from './api.generated';
import createClient from 'openapi-fetch';
let csrf = '';
export const setCsrf = (value: string) => {
  csrf = value;
};
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
const fetchWithErrors: typeof fetch = (input, init) =>
  fetch(input, init).catch(() => {
    throw new ApiError(
      'NETWORK_ERROR',
      'Não foi possível conectar ao servidor. Tente novamente.',
      0,
    );
  });
export async function request<T>(
  path: string,
  method = 'GET',
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<T> {
  const response = await fetchWithErrors(`/api/v1${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(method !== 'GET' ? { 'X-CSRF-Token': csrf } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const json = await response.json();
  if (!response.ok)
    throw new ApiError(
      json.error?.code ?? 'ERROR',
      json.error?.message ?? 'Não foi possível concluir a operação',
      response.status,
    );
  return json as T;
}
export type Session = { user: User; csrf: string };
export type Page<R extends Resource = Resource> = {
  items: Entity<R>[];
  total: number;
  page: number;
  limit: number;
};
const generatedClient = createClient<paths>({
  credentials: 'same-origin',
  cache: 'no-store',
  fetch: fetchWithErrors,
});
generatedClient.use({
  onRequest({ request }) {
    if (!['GET', 'HEAD'].includes(request.method)) request.headers.set('X-CSRF-Token', csrf);
  },
});
function unwrap<T>(result: { data?: unknown; error?: unknown; response: Response }): T {
  if (!result.response.ok) {
    const body = result.error as { error?: { code?: string; message?: string } };
    throw new ApiError(
      body?.error?.code ?? 'ERROR',
      body?.error?.message ?? 'Não foi possível concluir a operação',
      result.response.status,
    );
  }
  return result.data as T;
}
// These templates are checked against the generated OpenAPI contract.
const financialPaths = {
  categories: '/api/v1/spaces/{spaceId}/categories',
  expenses: '/api/v1/spaces/{spaceId}/expenses',
  incomes: '/api/v1/spaces/{spaceId}/incomes',
  recurrences: '/api/v1/spaces/{spaceId}/recurrences',
  investments: '/api/v1/spaces/{spaceId}/investments',
  movements: '/api/v1/spaces/{spaceId}/movements',
  valuations: '/api/v1/spaces/{spaceId}/valuations',
} as const satisfies Record<Resource, keyof paths>;
export function resourcePath(spaceId: string, resource: Resource) {
  return financialPaths[resource].replace('/api/v1', '').replace('{spaceId}', spaceId);
}
export async function list<R extends Resource>(s: string, r: R, filters: Partial<ListQuery> = {}) {
  const result = await generatedClient.GET(financialPaths[r as Resource], {
    params: { path: { spaceId: s }, query: filters },
  });
  return unwrap<Page<R>>(result);
}

export async function all<R extends Resource>(s: string, r: R, filters: Partial<ListQuery> = {}) {
  const items: Entity<R>[] = [];
  for (let page = 1; ; page++) {
    const result = await list(s, r, { ...filters, page, limit: 100 });
    items.push(...result.items);
    if (items.length >= result.total) return items;
  }
}
const itemPaths = {
  categories: '/api/v1/spaces/{spaceId}/categories/{id}',
  expenses: '/api/v1/spaces/{spaceId}/expenses/{id}',
  incomes: '/api/v1/spaces/{spaceId}/incomes/{id}',
  recurrences: '/api/v1/spaces/{spaceId}/recurrences/{id}',
  investments: '/api/v1/spaces/{spaceId}/investments/{id}',
  movements: '/api/v1/spaces/{spaceId}/movements/{id}',
  valuations: '/api/v1/spaces/{spaceId}/valuations/{id}',
} as const satisfies Record<Resource, keyof paths>;
export async function save<R extends Resource>(
  s: string,
  r: R,
  data: ResourceData[R],
  entity?: Entity<R>,
  effectiveFrom?: string,
  idempotencyKey: string = crypto.randomUUID(),
) {
  if (entity)
    return unwrap<Entity<R>>(
      await generatedClient.PATCH(itemPaths[r as Resource], {
        params: { path: { spaceId: s, id: entity.id } },
        body: {
          version: entity.version,
          data,
          ...(effectiveFrom ? { effectiveFrom } : {}),
        } as NonNullable<
          paths[(typeof itemPaths)[Resource]]['patch']['requestBody']
        >['content']['application/json'],
      }),
    );
  return unwrap<Entity<R>>(
    await generatedClient.POST(financialPaths[r as Resource], {
      params: { path: { spaceId: s } },
      body: data as ResourceData[Resource],
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  );
}
export async function remove(s: string, r: Resource, e: Entity) {
  return unwrap<{ archived: boolean }>(
    await generatedClient.DELETE(itemPaths[r as Resource], {
      params: { path: { spaceId: s, id: e.id } },
      body: { version: e.version },
    }),
  );
}

export const spaces = () => request<Space[]>('/spaces');
export type { Summary, Report } from '@finances/contracts';

export function formatMoney(value: string | null | undefined, currency: string) {
  if (value == null) return '—';
  const negative = value.startsWith('-');
  const [whole, fraction = ''] = value.replace(/^-/, '').split('.');
  const parts = new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).formatToParts(
    BigInt(whole),
  );
  return (
    (negative ? '−' : '') +
    parts
      .map((p) =>
        p.type === 'fraction'
          ? fraction.padEnd(p.value.length, '0').slice(0, p.value.length)
          : p.value,
      )
      .join('')
  );
}
export function localDate(timezone = 'America/Sao_Paulo') {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
    new Date(`${date}T12:00:00Z`),
  );
}
export const labels: Record<Resource, string> = {
  categories: 'Categorias',
  expenses: 'Despesas',
  incomes: 'Ganhos',
  recurrences: 'Recorrências',
  investments: 'Investimentos',
  movements: 'Movimentos',
  valuations: 'Avaliações',
};
