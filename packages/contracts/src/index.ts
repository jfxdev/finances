import { z } from 'zod';
z.config(z.locales.pt());

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const d = new Date(`${s}T12:00:00Z`);
    return !Number.isNaN(+d) && d.toISOString().slice(0, 10) === s;
  }, 'Data inválida');
export const moneySchema = z
  .string()
  .regex(/^(0|[1-9]\d{0,17})(\.\d{1,4})?$/, 'Informe um valor decimal válido');
const positive = moneySchema.refine((s) => /[1-9]/.test(s), 'Valor deve ser maior que zero');
export const idSchema = z.uuid();
const label = z.string().trim().min(1).max(160);
const notes = z.string().max(4000).default('');
export const icons = [
  'house',
  'utensils',
  'car',
  'heart-pulse',
  'graduation-cap',
  'party-popper',
  'repeat',
  'ellipsis',
  'video',
  'bot',
  'music',
  'piggy-bank',
  'chart-no-axes-combined',
] as const;
export const categorySchema = z
  .object({
    name: label,
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .default('#16a34a'),
    icon: z.enum(icons).default('ellipsis'),
    archived: z.boolean().default(false),
  })
  .strict();
export const transactionSchema = z
  .object({
    description: label,
    amount: positive,
    categoryId: idSchema,
    dueDate: dateSchema,
    status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
    effectiveDate: dateSchema.nullable().default(null),
    notes,
    icon: z.enum(icons).optional(),
  })
  .strict()
  .superRefine((d, ctx) => {
    if (d.status === 'confirmed' && !d.effectiveDate)
      ctx.addIssue({
        code: 'custom',
        path: ['effectiveDate'],
        message: 'Informe a data do pagamento ou recebimento',
      });
    if (d.status !== 'confirmed' && d.effectiveDate)
      ctx.addIssue({
        code: 'custom',
        path: ['effectiveDate'],
        message: 'A data efetiva exige confirmação',
      });
  });
export const recurrenceSchema = z
  .object({
    description: label,
    amount: positive,
    categoryId: idSchema,
    type: z.enum(['expense', 'income']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().int().min(1).max(120).default(1),
    startDate: dateSchema,
    endDate: dateSchema.nullable().default(null),
    paused: z.boolean().default(false),
    notes,
    icon: z.enum(icons).optional(),
  })
  .strict()
  .refine((d) => !d.endDate || d.endDate >= d.startDate, {
    message: 'Término anterior ao início',
    path: ['endDate'],
  });
export const investmentSchema = z
  .object({
    name: label,
    type: z.enum(['investment', 'savings']),
    institution: z.string().max(160).default(''),
    initialBalance: moneySchema.default('0'),
    startDate: dateSchema,
    goal: positive.nullable().default(null),
    goalDate: dateSchema.nullable().default(null),
    product: z.enum(['cdb', 'lci', 'lca', 'other']).default('other'),
    taxable: z.boolean().default(false),
    taxRate: z.number().min(0).max(100).default(0),
    expectedAnnualReturn: z.number().min(0).max(1000).nullable().default(null),
    maturityDate: dateSchema.nullable().default(null),
    notes,
  })
  .strict()
  .refine((d) => !d.taxable || d.taxRate > 0, {
    message: 'Informe o percentual do imposto',
    path: ['taxRate'],
  })
  .refine((d) => !d.maturityDate || d.maturityDate >= d.startDate, {
    message: 'Vencimento anterior ao início',
    path: ['maturityDate'],
  })
  .refine(
    (d) =>
      !d.maturityDate || (+new Date(d.maturityDate) - +new Date(d.startDate)) / 86400000 <= 36525,
    {
      message: 'O prazo máximo para estimativa é de 100 anos',
      path: ['maturityDate'],
    },
  );
export const movementSchema = z
  .object({
    investmentId: idSchema,
    type: z.enum(['deposit', 'withdrawal']),
    amount: positive,
    date: dateSchema,
    notes,
  })
  .strict();
// A valuation is the closing value for its date, including that day's movements.
export const valuationSchema = z
  .object({ investmentId: idSchema, amount: moneySchema, date: dateSchema, notes })
  .strict();
export const schemas = {
  categories: categorySchema,
  expenses: transactionSchema,
  incomes: transactionSchema,
  recurrences: recurrenceSchema,
  investments: investmentSchema,
  movements: movementSchema,
  valuations: valuationSchema,
};
export const resources = [
  'categories',
  'expenses',
  'incomes',
  'recurrences',
  'investments',
  'movements',
  'valuations',
] as const;
export const resourceSchema = z.enum(resources);
export type Resource = (typeof resources)[number];
export type Category = z.infer<typeof categorySchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Recurrence = z.infer<typeof recurrenceSchema>;
export type Investment = z.infer<typeof investmentSchema>;
export type Movement = z.infer<typeof movementSchema>;
export type Valuation = z.infer<typeof valuationSchema>;
export type ResourceData = {
  categories: Category;
  expenses: Transaction;
  incomes: Transaction;
  recurrences: Recurrence;
  investments: Investment;
  movements: Movement;
  valuations: Valuation;
};
export type FinancialData = ResourceData[Resource];
export interface Entity<R extends Resource = Resource> {
  id: string;
  spaceId: string;
  resource: R;
  version: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  recurrenceId: string | null;
  data: ResourceData[R];
}
export const entityResponseSchema = z.object({
  id: idSchema,
  spaceId: idSchema,
  resource: resourceSchema,
  version: z.number().int(),
  createdBy: idSchema,
  updatedBy: idSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  recurrenceId: idSchema.nullable(),
  data: z.union(Object.values(schemas)),
});
export const operationSchema = z.enum(['read', 'create', 'update', 'delete']);
export type Operation = z.infer<typeof operationSchema>;
export const grantSchema = z
  .object({
    spaceId: idSchema,
    resource: resourceSchema,
    operations: z.array(operationSchema).min(1),
  })
  .strict();
export type Grant = z.infer<typeof grantSchema>;
export const keySchema = z
  .object({
    name: label,
    expiresAt: z.iso.datetime().nullable().default(null),
    grants: z.array(grantSchema).min(1).max(100),
  })
  .strict();
export const spaceSchema = z
  .object({
    name: label,
    currency: z
      .string()
      .length(3)
      .default('BRL')
      .refine((s) => Intl.supportedValuesOf('currency').includes(s), 'Moeda ISO inválida'),
    timezone: z
      .string()
      .default('America/Sao_Paulo')
      .refine((s) => {
        try {
          new Intl.DateTimeFormat('pt-BR', { timeZone: s });
          return true;
        } catch {
          return false;
        }
      }, 'Fuso inválido'),
  })
  .strict();
export type Space = z.infer<typeof spaceSchema> & {
  id: string;
  personal: boolean;
  role: 'owner' | 'editor' | 'reader';
  version: number;
};
export const registerSchema = z
  .object({
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
    name: label,
    password: z.string().min(12).max(128),
    setupToken: z.string().optional(),
  })
  .strict();
export const loginSchema = z
  .object({
    email: z.email().transform((s) => s.toLowerCase()),
    password: z.string().min(1).max(128),
  })
  .strict();
export const querySchema = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  categoryId: idSchema.optional(),
  investmentId: idSchema.optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
export type ListQuery = z.infer<typeof querySchema>;
export interface User {
  id: string;
  email: string;
  name: string;
  admin: boolean;
}
export const presets = [
  { name: 'Netflix', icon: 'video' },
  { name: 'ChatGPT', icon: 'bot' },
  { name: 'Spotify', icon: 'music' },
  { name: 'YouTube Premium', icon: 'video' },
  { name: 'iCloud', icon: 'repeat' },
] as const;
export const defaultCategories: Category[] = [
  ['Moradia', 'house', '#2563eb'],
  ['Alimentação', 'utensils', '#f97316'],
  ['Transporte', 'car', '#8b5cf6'],
  ['Saúde', 'heart-pulse', '#ef4444'],
  ['Educação', 'graduation-cap', '#0ea5e9'],
  ['Lazer', 'party-popper', '#ec4899'],
  ['Assinaturas', 'repeat', '#10b981'],
  ['Outros', 'ellipsis', '#64748b'],
].map(([name, icon, color]) => categorySchema.parse({ name, icon, color }));

export const userResponseSchema = z.object({
  id: idSchema,
  email: z.email(),
  name: z.string(),
  admin: z.boolean(),
});
export const sessionResponseSchema = z.object({ user: userResponseSchema, csrf: z.string() });
export const spaceResponseSchema = spaceSchema.extend({
  id: idSchema,
  personal: z.boolean(),
  role: z.enum(['owner', 'editor', 'reader']),
  version: z.number().int(),
});
export const errorResponseSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});
export const summaryResponseSchema = z.object({
  currency: z.string(),
  expenses: z.string().nullable(),
  incomes: z.string().nullable(),
  balance: z.string().nullable(),
  pendingExpenses: z.string().nullable(),
  pendingIncomes: z.string().nullable(),
  byCategory: z.array(
    z.object({ id: idSchema, name: z.string(), color: z.string(), amount: z.string() }),
  ),
  upcoming: z.array(entityResponseSchema),
});
const totalsSchema = z.object({
  current: z.string(),
  deposits: z.string(),
  withdrawals: z.string(),
  result: z.string(),
  progress: z.number().nullable(),
});
export const reportResponseSchema = totalsSchema.extend({
  history: z.array(totalsSchema.extend({ date: dateSchema })),
  projection: z
    .object({
      maturityDate: dateSchema,
      gross: z.string(),
      earnings: z.string(),
      tax: z.string(),
      net: z.string(),
    })
    .nullable(),
  forecast: z.array(z.object({ date: dateSchema, gross: z.string(), net: z.string() })),
});
export type Summary = z.infer<typeof summaryResponseSchema>;
export type Report = z.infer<typeof reportResponseSchema>;
