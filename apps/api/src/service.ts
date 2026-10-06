import { randomBytes, randomUUID, createHmac } from 'node:crypto';
import { and, eq, isNull, isNotNull, gte, lte, sql, asc, desc, or } from 'drizzle-orm';
import {
  schemas,
  type Resource,
  type FinancialData,
  type Entity,
  type ListQuery,
  type Recurrence,
  type Transaction,
  type Investment,
  type Movement,
  type Valuation,
  defaultCategories,
  type Operation,
  type Category,
} from '@finances/contracts';
import {
  records,
  spaces,
  members,
  users,
  apiKeys,
  audits,
  idempotencies,
  type DB,
  type Store,
  type RecordRow,
  type SpaceRow,
  type TX,
} from './db.js';
import { encrypt, decrypt } from './crypto.js';
import {
  fail,
  units,
  money,
  today,
  horizon,
  occurrences,
  investmentTotals,
  investmentReport,
} from './domain.js';
import type { Config } from './config.js';
export type Principal = { userId: string; keyId?: string };
type Stored = FinancialData & {
  revisions?: { from: string; data: Recurrence }[];
  generatedThrough?: string;
};
export class Service {
  readonly masterKeys: Record<string, Buffer>;
  constructor(
    readonly db: DB,
    readonly config: Config,
  ) {
    this.masterKeys = Object.fromEntries(
      Object.entries(JSON.parse(config.MASTER_KEYS) as Record<string, string>).map(([v, k]) => [
        v,
        Buffer.from(k, 'base64'),
      ]),
    );
  }
  async verifyKeys() {
    for (const space of await this.db.select().from(spaces)) this.key(space);
  }
  key(space: SpaceRow) {
    const master = this.masterKeys[space.keyVersion];
    if (!master) fail(503, 'KEY_UNAVAILABLE', 'Chave de criptografia indisponível');
    return Buffer.from(
      decrypt<string>(master, `space-key:${space.id}`, space.wrappedKey),
      'base64',
    );
  }
  data(row: RecordRow, space: SpaceRow): Stored {
    return decrypt<Stored>(
      this.key(space),
      `record:${space.id}:${row.resource}:${row.id}`,
      row.payload,
    );
  }
  entity(row: RecordRow, space: SpaceRow): Entity {
    const { revisions: _r, generatedThrough: _g, ...data } = this.data(row, space);
    return {
      id: row.id,
      spaceId: row.spaceId,
      resource: row.resource,
      version: row.version,
      createdBy: row.createdBy,
      updatedBy: row.updatedBy,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      recurrenceId: row.recurrenceId,
      data:
        row.resource === 'investments' ? schemas.investments.parse(data) : (data as FinancialData),
    };
  }
  async audit(
    tx: Store,
    p: Principal,
    spaceId: string | null,
    resource: string | null,
    recordId: string | null,
    operation: string,
    result = 'success',
  ) {
    await tx.insert(audits).values({
      id: randomUUID(),
      actorId: p.userId,
      keyId: p.keyId ?? null,
      spaceId,
      resource,
      recordId,
      operation,
      result,
    });
  }
  async authorize(
    tx: Store,
    p: Principal,
    spaceId: string,
    resource?: Resource,
    operation: Operation = 'read',
  ) {
    const [user] = await tx
      .select()
      .from(users)
      .where(and(eq(users.id, p.userId), eq(users.active, true)))
      .for('share');
    if (!user) fail(401, 'UNAUTHENTICATED', 'Sessão inválida');
    const [member] = await tx
      .select()
      .from(members)
      .where(and(eq(members.spaceId, spaceId), eq(members.userId, p.userId)))
      .for('share');
    if (!member) fail(404, 'NOT_FOUND', 'Espaço não encontrado');
    if (operation !== 'read' && member.role === 'reader')
      fail(403, 'FORBIDDEN', 'Você possui acesso somente de leitura');
    if (p.keyId) {
      const [key] = await tx
        .select()
        .from(apiKeys)
        .where(
          and(eq(apiKeys.id, p.keyId), eq(apiKeys.userId, p.userId), isNull(apiKeys.revokedAt)),
        )
        .for('share');
      if (!key || (key.expiresAt && key.expiresAt <= new Date()))
        fail(401, 'INVALID_KEY', 'Chave inválida ou expirada');
      if (
        !key.grants.some(
          (g) =>
            g.spaceId === spaceId &&
            (!resource || g.resource === resource) &&
            g.operations.includes(operation),
        )
      )
        fail(403, 'INSUFFICIENT_SCOPE', 'A chave não possui esta permissão');
    }
    const [space] = await tx.select().from(spaces).where(eq(spaces.id, spaceId));
    if (!space) fail(404, 'NOT_FOUND', 'Espaço não encontrado');
    return { space, role: member.role };
  }
  async canRead(tx: Store, p: Principal, s: string, r: Resource) {
    if (!p.keyId) return true;
    const [key] = await tx.select().from(apiKeys).where(eq(apiKeys.id, p.keyId));
    return !!key?.grants.some(
      (g) => g.spaceId === s && g.resource === r && g.operations.includes('read'),
    );
  }
  async createSpace(
    tx: TX,
    userId: string,
    name: string,
    currency = 'BRL',
    timezone = 'America/Sao_Paulo',
    personal = false,
  ) {
    const id = randomUUID();
    const key = randomBytes(32);
    await tx.insert(spaces).values({
      id,
      title: encrypt(key, `space-title:${id}`, name),
      currency,
      timezone,
      personal,
      wrappedKey: encrypt(
        this.masterKeys[this.config.ACTIVE_MASTER_KEY],
        `space-key:${id}`,
        key.toString('base64'),
      ),
      keyVersion: this.config.ACTIVE_MASTER_KEY,
    });
    await tx.insert(members).values({ spaceId: id, userId, role: 'owner' });
    const [space] = await tx.select().from(spaces).where(eq(spaces.id, id));
    for (const category of defaultCategories)
      await this.insert(tx, { userId }, space, 'categories', category);
    return id;
  }
  async lookup(tx: Store, spaceId: string, id: string, resource: Resource, includeDeleted = false) {
    const [row] = await tx
      .select()
      .from(records)
      .where(
        and(
          eq(records.spaceId, spaceId),
          eq(records.id, id),
          eq(records.resource, resource),
          includeDeleted ? undefined : isNull(records.deletedAt),
        ),
      );
    if (!row) fail(404, 'NOT_FOUND', 'Registro não encontrado');
    return row;
  }
  async validate(tx: Store, space: SpaceRow, r: Resource, data: FinancialData, old?: RecordRow) {
    if ('amount' in data) units(data.amount, space.currency);
    if ('initialBalance' in data) {
      units(data.initialBalance, space.currency);
      if (data.goal) units(data.goal, space.currency);
    }
    if ('categoryId' in data) {
      const cat = await this.lookup(tx, space.id, data.categoryId, 'categories');
      if (
        (this.data(cat, space) as Category).archived &&
        (!old || old.categoryId !== data.categoryId)
      )
        fail(400, 'CATEGORY_ARCHIVED', 'Categoria arquivada');
    }
    if ('investmentId' in data) {
      const inv = await this.lookup(tx, space.id, data.investmentId, 'investments');
      const investment = this.data(inv, space) as Investment;
      if (data.date < investment.startDate)
        fail(400, 'DATE_BEFORE_INVESTMENT', 'Data anterior ao início do investimento');
      if (old && old.investmentId !== data.investmentId)
        fail(400, 'IMMUTABLE_PARENT', 'O investimento do movimento não pode ser alterado');
    }
    if (r === 'investments' && old) {
      const previous = this.data(old, space) as Investment;
      const next = data as Investment;
      if (
        next.startDate !== previous.startDate ||
        units(next.initialBalance, space.currency) !==
          units(previous.initialBalance, space.currency)
      )
        fail(
          409,
          'IMMUTABLE_PRINCIPAL',
          'O saldo e a data inicial não podem ser alterados. Registre um novo aporte ou resgate.',
        );
    }
  }
  columns(data: FinancialData) {
    return {
      categoryId: 'categoryId' in data ? data.categoryId : null,
      investmentId: 'investmentId' in data ? data.investmentId : null,
      date:
        'dueDate' in data
          ? data.dueDate
          : 'date' in data
            ? data.date
            : 'startDate' in data
              ? data.startDate
              : null,
      effectiveDate: 'effectiveDate' in data ? data.effectiveDate : null,
      status: 'status' in data ? data.status : null,
      type: 'type' in data ? data.type : null,
    };
  }
  async insert(
    tx: Store,
    p: Principal,
    space: SpaceRow,
    r: Resource,
    data: Stored,
    extra: Partial<typeof records.$inferInsert> = {},
  ) {
    const id = randomUUID();
    const [row] = await tx
      .insert(records)
      .values({
        id,
        spaceId: space.id,
        resource: r,
        payload: encrypt(this.key(space), `record:${space.id}:${r}:${id}`, data),
        ...this.columns(data),
        createdBy: p.userId,
        updatedBy: p.userId,
        ...extra,
      })
      .returning();
    return row;
  }
  async create(p: Principal, s: string, r: Resource, input: unknown, token?: string) {
    const data = schemas[r].parse(input) as FinancialData;
    return this.db.transaction(async (tx) => {
      await tx.select().from(spaces).where(eq(spaces.id, s)).for('update');
      const { space } = await this.authorize(tx, p, s, r, 'create');
      const requestHash = createHmac('sha256', this.key(space))
        .update(JSON.stringify({ s, r, data }))
        .digest('hex');
      if (token) {
        await tx.execute(
          sql`SELECT pg_advisory_xact_lock(hashtextextended(${`${p.userId}:${p.keyId ?? 'session'}:${token}`},0))`,
        );
        const [prior] = await tx
          .select()
          .from(idempotencies)
          .where(
            and(
              eq(idempotencies.actorId, p.userId),
              eq(idempotencies.keyId, p.keyId ?? 'session'),
              eq(idempotencies.token, token),
            ),
          );
        if (prior) {
          if (prior.requestHash !== requestHash)
            fail(409, 'IDEMPOTENCY_CONFLICT', 'Identificador já utilizado com outros dados');
          const previous = await this.lookup(tx, s, prior.recordId, r);
          return this.entity(previous, space);
        }
      }
      await this.validate(tx, space, r, data);
      if ((r === 'expenses' || r === 'incomes') && (data as Transaction).status === 'confirmed') {
        const transaction = data as Transaction;
        const pending = await tx
          .select()
          .from(records)
          .where(
            and(
              eq(records.spaceId, s),
              eq(records.resource, r),
              eq(records.categoryId, transaction.categoryId),
              eq(records.date, transaction.dueDate),
              eq(records.status, 'pending'),
              isNotNull(records.recurrenceId),
              isNull(records.deletedAt),
            ),
          );
        if (
          pending.some((record) => {
            const existing = this.data(record, space) as Transaction;
            return (
              existing.description === transaction.description &&
              units(existing.amount, space.currency) === units(transaction.amount, space.currency)
            );
          })
        )
          fail(
            409,
            'PENDING_RECURRENCE_EXISTS',
            'Já existe um lançamento recorrente pendente com esses dados. Confirme-o em Lançamentos.',
          );
      }
      const stored: Stored =
        r === 'recurrences'
          ? {
              ...data,
              revisions: [{ from: (data as Recurrence).startDate, data: data as Recurrence }],
            }
          : data;
      const row = await this.insert(tx, p, space, r, stored);
      if (token)
        await tx.insert(idempotencies).values({
          actorId: p.userId,
          keyId: p.keyId ?? 'session',
          token,
          requestHash,
          spaceId: s,
          recordId: row.id,
        });
      if (r === 'movements' || r === 'valuations' || r === 'investments')
        await this.validatePortfolio(
          tx,
          space,
          r === 'investments' ? row.id : 'investmentId' in data ? data.investmentId : '',
        );
      await this.audit(tx, p, s, r, row.id, 'create');
      if (r === 'recurrences') await this.generateOne(tx, space, row);
      return this.entity(row, space);
    });
  }
  async update(
    p: Principal,
    s: string,
    r: Resource,
    id: string,
    version: number,
    input: unknown,
    effectiveFrom?: string,
  ) {
    const data = schemas[r].parse(input) as FinancialData;
    return this.db.transaction(async (tx) => {
      await tx.select().from(spaces).where(eq(spaces.id, s)).for('update');
      const { space } = await this.authorize(tx, p, s, r, 'update');
      const old = await this.lookup(tx, s, id, r);
      if (r === 'movements' || r === 'valuations')
        fail(
          409,
          'IMMUTABLE_INVESTMENT_ENTRY',
          'Lançamentos de investimentos não podem ser alterados. Registre um novo movimento.',
        );
      if (old.version !== version)
        fail(409, 'VERSION_CONFLICT', 'Registro alterado. Atualize a tela e tente novamente');
      await this.validate(tx, space, r, data, old);
      let stored: Stored = data;
      let rebuildFrom: string | undefined;
      if (r === 'recurrences') {
        const previous = this.data(old, space) as Recurrence & Stored;
        const next = data as Recurrence;
        const from = effectiveFrom ?? today(space.timezone);
        if (from < today(space.timezone))
          fail(400, 'PAST_SERIES_EDIT', 'Altere ocorrências passadas individualmente');
        if (next.startDate !== previous.startDate)
          fail(400, 'IMMUTABLE_START', 'A data inicial da recorrência não pode ser alterada');
        const revisions = previous.revisions ?? [{ from: previous.startDate, data: previous }];
        const prior = this.entity(old, space).data as Recurrence;
        const changed =
          JSON.stringify({ ...prior, paused: false }) !==
          JSON.stringify({ ...next, paused: false });
        stored = {
          ...next,
          generatedThrough: previous.generatedThrough,
          revisions: changed
            ? [...revisions.filter((v) => v.from < from), { from, data: next }]
            : revisions,
        };
        if (changed) rebuildFrom = from;
        if (rebuildFrom)
          await tx
            .update(records)
            .set({
              deletedAt: new Date(),
              deletionReason: 'rescheduled',
              version: sql`${records.version}+1`,
              updatedAt: new Date(),
              updatedBy: p.userId,
            })
            .where(
              and(
                eq(records.recurrenceId, id),
                eq(records.status, 'pending'),
                gte(records.occurrenceDate, from),
                isNull(records.deletedAt),
              ),
            );
      }
      const [row] = await tx
        .update(records)
        .set({
          ...this.columns(data),
          payload: encrypt(this.key(space), `record:${s}:${r}:${id}`, stored),
          version: version + 1,
          updatedBy: p.userId,
          updatedAt: new Date(),
        })
        .where(eq(records.id, id))
        .returning();
      if (r === 'investments') await this.validatePortfolio(tx, space, id);
      if (r === 'recurrences') await this.generateOne(tx, space, row, rebuildFrom);
      await this.audit(tx, p, s, r, id, 'update');
      return this.entity(row, space);
    });
  }
  async remove(p: Principal, s: string, r: Resource, id: string, version: number) {
    return this.db.transaction(async (tx) => {
      await tx.select().from(spaces).where(eq(spaces.id, s)).for('update');
      const { space } = await this.authorize(tx, p, s, r, 'delete');
      const row = await this.lookup(tx, s, id, r);
      if (r === 'investments' || r === 'movements' || r === 'valuations')
        fail(
          409,
          'IMMUTABLE_INVESTMENT_ENTRY',
          'Investimentos e seus lançamentos não podem ser removidos.',
        );
      if (row.version !== version)
        fail(409, 'VERSION_CONFLICT', 'Registro alterado. Atualize a tela');
      if (r === 'categories') {
        const [used] = await tx
          .select({ id: records.id })
          .from(records)
          .where(and(eq(records.categoryId, id), isNull(records.deletedAt)))
          .limit(1);
        if (used) {
          const data = { ...this.data(row, space), archived: true };
          await tx
            .update(records)
            .set({
              payload: encrypt(this.key(space), `record:${s}:${r}:${id}`, data),
              version: version + 1,
              updatedBy: p.userId,
              updatedAt: new Date(),
            })
            .where(eq(records.id, id));
          await this.audit(tx, p, s, r, id, 'archive');
          return { archived: true };
        }
      }
      await tx
        .update(records)
        .set({
          deletedAt: new Date(),
          deletionReason: 'user',
          version: version + 1,
          updatedBy: p.userId,
          updatedAt: new Date(),
        })
        .where(eq(records.id, id));
      if (r === 'recurrences')
        await tx
          .update(records)
          .set({
            deletedAt: new Date(),
            deletionReason: 'series_deleted',
            version: sql`${records.version}+1`,
            updatedAt: new Date(),
            updatedBy: p.userId,
          })
          .where(
            and(
              eq(records.recurrenceId, id),
              eq(records.status, 'pending'),
              isNull(records.deletedAt),
            ),
          );
      if (row.investmentId) await this.validatePortfolio(tx, space, row.investmentId);
      await this.audit(tx, p, s, r, id, 'delete');
      return { archived: false };
    });
  }
  async list(p: Principal, s: string, r: Resource, q: ListQuery) {
    return this.db.transaction(async (tx) => {
      const { space } = await this.authorize(tx, p, s, r);
      const period = sql`coalesce(${records.effectiveDate},${records.date})`;
      const where = and(
        eq(records.spaceId, s),
        eq(records.resource, r),
        isNull(records.deletedAt),
        q.from ? gte(period, q.from) : undefined,
        q.to ? lte(period, q.to) : undefined,
        q.categoryId ? eq(records.categoryId, q.categoryId) : undefined,
        q.investmentId ? eq(records.investmentId, q.investmentId) : undefined,
        q.status ? eq(records.status, q.status) : undefined,
      );
      const rows = await tx
        .select()
        .from(records)
        .where(where)
        .orderBy(desc(records.date), asc(records.id))
        .limit(q.limit)
        .offset((q.page - 1) * q.limit);
      const [count] = await tx
        .select({ total: sql<number>`count(*)::int` })
        .from(records)
        .where(where);
      return {
        items: rows.map((row) => this.entity(row, space)),
        total: count.total,
        page: q.page,
        limit: q.limit,
      };
    });
  }
  async get(p: Principal, s: string, r: Resource, id: string) {
    return this.db.transaction(async (tx) => {
      const { space } = await this.authorize(tx, p, s, r);
      return this.entity(await this.lookup(tx, s, id, r), space);
    });
  }
  async summary(p: Principal, s: string, from: string, to: string) {
    return this.db.transaction(async (tx) => {
      const { space } = await this.authorize(tx, p, s);
      const expenseAllowed = await this.canRead(tx, p, s, 'expenses');
      const incomeAllowed = await this.canRead(tx, p, s, 'incomes');
      const categoryAllowed = await this.canRead(tx, p, s, 'categories');
      if (!expenseAllowed && !incomeAllowed)
        fail(403, 'INSUFFICIENT_SCOPE', 'A chave não permite consultar lançamentos');
      const kinds: Resource[] = [];
      if (expenseAllowed) kinds.push('expenses');
      if (incomeAllowed) kinds.push('incomes');
      const period = sql`coalesce(${records.effectiveDate},${records.date})`;
      const rows = await tx
        .select()
        .from(records)
        .where(
          and(
            eq(records.spaceId, s),
            isNull(records.deletedAt),
            or(...kinds.map((r) => eq(records.resource, r))),
            gte(period, from),
            lte(period, to),
          ),
        );
      let expenses = 0n,
        incomes = 0n,
        pendingExpenses = 0n,
        pendingIncomes = 0n;
      const grouped = new Map<string, bigint>();
      const upcoming: Entity[] = [];
      for (const row of rows) {
        const d = this.data(row, space) as Transaction;
        const n = units(d.amount, space.currency);
        if (d.status === 'cancelled') continue;
        if (d.status === 'confirmed') {
          if (row.resource === 'expenses') {
            expenses += n;
            grouped.set(d.categoryId, (grouped.get(d.categoryId) ?? 0n) + n);
          } else incomes += n;
        } else {
          if (row.resource === 'expenses') pendingExpenses += n;
          else pendingIncomes += n;
          upcoming.push(this.entity(row, space));
        }
      }
      const byCategory = [];
      for (const [id, n] of grouped) {
        let name = 'Categoria',
          color = '#64748b';
        if (categoryAllowed) {
          const row = await this.lookup(tx, s, id, 'categories', true);
          const d = this.data(row, space);
          if ('name' in d) name = d.name;
          if ('color' in d) color = d.color;
        }
        byCategory.push({ id, name, color, amount: money(n, space.currency) });
      }
      return {
        currency: space.currency,
        expenses: expenseAllowed ? money(expenses, space.currency) : null,
        incomes: incomeAllowed ? money(incomes, space.currency) : null,
        balance: expenseAllowed && incomeAllowed ? money(incomes - expenses, space.currency) : null,
        pendingExpenses: expenseAllowed ? money(pendingExpenses, space.currency) : null,
        pendingIncomes: incomeAllowed ? money(pendingIncomes, space.currency) : null,
        byCategory,
        upcoming: upcoming
          .sort((a, b) =>
            (a.data as Transaction).dueDate.localeCompare((b.data as Transaction).dueDate),
          )
          .slice(0, 10),
      };
    });
  }
  async portfolio(tx: Store, space: SpaceRow, id: string) {
    const inv = await this.lookup(tx, space.id, id, 'investments');
    const rows = await tx
      .select()
      .from(records)
      .where(
        and(eq(records.spaceId, space.id), eq(records.investmentId, id), isNull(records.deletedAt)),
      )
      .orderBy(asc(records.date), asc(records.id));
    return {
      investment: this.data(inv, space) as Investment,
      movements: rows
        .filter((r) => r.resource === 'movements')
        .map((r) => this.data(r, space) as Movement),
      valuations: rows
        .filter((r) => r.resource === 'valuations')
        .map((r) => this.data(r, space) as Valuation),
    };
  }
  async validatePortfolio(tx: Store, space: SpaceRow, id: string) {
    const p = await this.portfolio(tx, space, id);
    for (const date of [
      ...new Set([
        p.investment.startDate,
        ...p.movements.map((m) => m.date),
        ...p.valuations.map((v) => v.date),
      ]),
    ].sort()) {
      if (
        units(
          investmentTotals(p.investment, p.movements, p.valuations, space.currency, date).current,
          space.currency,
        ) < 0n
      )
        fail(400, 'NEGATIVE_INVESTMENT', 'O movimento deixaria o investimento com saldo negativo');
    }
  }
  async report(p: Principal, s: string, id: string) {
    return this.db.transaction(async (tx) => {
      const { space } = await this.authorize(tx, p, s, 'investments');
      await this.authorize(tx, p, s, 'movements');
      await this.authorize(tx, p, s, 'valuations');
      const data = await this.portfolio(tx, space, id);
      return investmentReport(
        data.investment,
        data.movements,
        data.valuations,
        space.currency,
        today(space.timezone),
      );
    });
  }
  async generateOne(tx: TX, space: SpaceRow, row: RecordRow, rebuildFrom?: string) {
    const stored = this.data(row, space) as Recurrence & Stored;
    if (stored.paused) return;
    const revisions = stored.revisions ?? [{ from: stored.startDate, data: stored }];
    const through = horizon(space.timezone);
    const from = rebuildFrom ?? stored.generatedThrough ?? stored.startDate;
    if (from > through) return;
    const days = Math.ceil((+new Date(through) - +new Date(from)) / 86400000);
    if (days > 3720) fail(400, 'RECURRENCE_TOO_OLD', 'Use uma data inicial nos últimos dez anos');
    for (let i = 0; i < revisions.length; i++) {
      const rev = revisions[i];
      const upper = revisions[i + 1]?.from;
      for (const date of occurrences(rev.data, from > rev.from ? from : rev.from, through)) {
        if (upper && date >= upper) continue;
        const r = rev.data;
        const kind = r.type === 'expense' ? 'expenses' : 'incomes';
        const [existing] = await tx
          .select()
          .from(records)
          .where(and(eq(records.recurrenceId, row.id), eq(records.occurrenceDate, date)));
        const data: Transaction = {
          description: r.description,
          amount: r.amount,
          categoryId: r.categoryId,
          dueDate: date,
          status: 'pending',
          effectiveDate: null,
          notes: r.notes,
          icon: r.icon,
        };
        if (existing) {
          if (existing.deletionReason === 'rescheduled')
            await tx
              .update(records)
              .set({
                ...this.columns(data),
                resource: kind,
                payload: encrypt(
                  this.key(space),
                  `record:${space.id}:${kind}:${existing.id}`,
                  data,
                ),
                deletedAt: null,
                deletionReason: null,
                updatedAt: new Date(),
                updatedBy: row.updatedBy,
                version: existing.version + 1,
              })
              .where(eq(records.id, existing.id));
          continue;
        }
        await this.insert(tx, { userId: row.updatedBy }, space, kind, data, {
          recurrenceId: row.id,
          occurrenceDate: date,
        });
      }
    }
    await tx
      .update(records)
      .set({
        payload: encrypt(this.key(space), `record:${space.id}:recurrences:${row.id}`, {
          ...stored,
          generatedThrough: through,
        }),
      })
      .where(eq(records.id, row.id));
  }
  async generate() {
    await this.db.transaction(async (tx) => {
      const lock = await tx.execute(sql`SELECT pg_try_advisory_xact_lock(726402) AS locked`);
      if (!(lock.rows[0] as { locked: boolean }).locked) return;
      const series = await tx
        .select()
        .from(records)
        .where(and(eq(records.resource, 'recurrences'), isNull(records.deletedAt)));
      for (const row of series) {
        const [space] = await tx
          .select()
          .from(spaces)
          .where(eq(spaces.id, row.spaceId))
          .for('update');
        const fresh = await this.lookup(tx, space.id, row.id, 'recurrences');
        await this.generateOne(tx, space, fresh);
      }
    });
  }
}
