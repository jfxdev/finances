import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  schemas,
  icons,
  presets,
  type Entity,
  type Resource,
  type Space,
  type FinancialData,
} from '@finances/contracts';
import { all, save, labels, localDate } from '@/lib/api';
import {
  acceptsMoneyInput,
  currencyDecimals,
  normalizeMoneyInput,
  zeroMoneyInput,
} from '@/lib/money-input';
import { ResponsiveDialog, CategoryIcon, ErrorState } from './common';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DatePicker } from '@/components/date-picker';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
type Values = Record<string, string | number | boolean | null | undefined>;
type Field = {
  name: string;
  label: string;
  type?: 'text' | 'money' | 'date' | 'number' | 'percent' | 'notes' | 'select' | 'switch' | 'color';
  options?: { value: string; label: string }[];
  nullable?: boolean;
};
const opts = (values: Record<string, string>) =>
  Object.entries(values).map(([value, label]) => ({ value, label }));
const statuses = opts({ pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado' });
function defaults(r: Resource, date: string, zero: string, investmentId?: string): Values {
  switch (r) {
    case 'categories':
      return { name: '', color: '#17694e', icon: 'ellipsis', archived: false };
    case 'expenses':
    case 'incomes':
      return {
        description: '',
        amount: zero,
        categoryId: '',
        dueDate: date,
        status: 'confirmed',
        effectiveDate: date,
        notes: '',
      };
    case 'recurrences':
      return {
        description: '',
        amount: zero,
        categoryId: '',
        type: 'expense',
        frequency: 'monthly',
        interval: 1,
        startDate: date,
        endDate: null,
        paused: false,
        notes: '',
      };
    case 'investments':
      return {
        name: '',
        type: 'investment',
        institution: '',
        initialBalance: zero,
        startDate: date,
        goal: zero,
        goalDate: null,
        product: 'other',
        taxable: false,
        taxRate: 0,
        expectedAnnualReturn: null,
        maturityDate: null,
        notes: '',
      };
    case 'movements':
      return { investmentId, type: 'deposit', amount: zero, date, notes: '' };
    case 'valuations':
      return { investmentId, amount: zero, date, notes: '' };
  }
}
export function Editor({
  resource,
  space,
  entity,
  investmentId,
  close,
}: {
  resource: Resource;
  space: Space;
  entity?: Entity;
  investmentId?: string;
  close: () => void;
}) {
  const queryClient = useQueryClient();
  const decimals = currencyDecimals(space.currency);
  const zero = zeroMoneyInput(space.currency);
  const form = useForm<Values>({
    defaultValues: entity
      ? {
          ...defaults(resource, localDate(space.timezone), zero, investmentId),
          ...(entity.data as unknown as Values),
        }
      : defaults(resource, localDate(space.timezone), zero, investmentId),
  });
  const idempotency = useRef(crypto.randomUUID());
  const [effectiveFrom, setEffectiveFrom] = useState(localDate(space.timezone));
  const needsCategories = ['expenses', 'incomes', 'recurrences'].includes(resource);
  const categories = useQuery({
    queryKey: ['categories', space.id],
    queryFn: () => all(space.id, 'categories'),
    enabled: needsCategories,
  });
  const mutation = useMutation({
    mutationFn: (data: FinancialData) =>
      save(
        space.id,
        resource,
        data,
        entity,
        effectiveFrom && resource === 'recurrences' && entity ? effectiveFrom : undefined,
        idempotency.current,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success('Registro salvo');
      close();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const taxable = form.watch('taxable');
  const fields: Field[] =
    resource === 'categories'
      ? [
          { name: 'name', label: 'Nome' },
          { name: 'color', label: 'Cor', type: 'color' },
          {
            name: 'icon',
            label: 'Ícone',
            type: 'select',
            options: icons.map((i) => ({
              value: i,
              label: {
                house: 'Moradia',
                utensils: 'Alimentação',
                car: 'Transporte',
                'heart-pulse': 'Saúde',
                'graduation-cap': 'Educação',
                'party-popper': 'Lazer',
                repeat: 'Assinatura',
                ellipsis: 'Outros',
                video: 'Vídeo',
                bot: 'Inteligência artificial',
                music: 'Música',
                'piggy-bank': 'Caixinha',
                'chart-no-axes-combined': 'Investimento',
              }[i],
            })),
          },
          { name: 'archived', label: 'Arquivada', type: 'switch' },
        ]
      : resource === 'investments'
        ? [
            { name: 'name', label: 'Nome' },
            {
              name: 'type',
              label: 'Tipo',
              type: 'select',
              options: opts({ investment: 'Investimento', savings: 'Caixinha' }),
            },
            { name: 'institution', label: 'Instituição (opcional)' },
            {
              name: 'product',
              label: 'Produto',
              type: 'select',
              options: opts({ cdb: 'CDB', lci: 'LCI', lca: 'LCA', other: 'Outro' }),
            },
            { name: 'taxable', label: 'Incide imposto', type: 'switch' },
            ...(taxable
              ? [
                  {
                    name: 'taxRate',
                    label: 'Imposto sobre o rendimento (%)',
                    type: 'percent' as const,
                  },
                ]
              : []),
            {
              name: 'expectedAnnualReturn',
              label: 'Rentabilidade anual esperada (%)',
              type: 'percent',
              nullable: true,
            },
            { name: 'maturityDate', label: 'Vencimento (opcional)', type: 'date', nullable: true },
            { name: 'initialBalance', label: `Saldo inicial (${space.currency})`, type: 'money' },
            { name: 'startDate', label: 'Data inicial', type: 'date' },
            { name: 'goal', label: 'Meta de valor (opcional)', type: 'money', nullable: true },
            { name: 'goalDate', label: 'Data da meta (opcional)', type: 'date', nullable: true },
            { name: 'notes', label: 'Observações', type: 'notes' },
          ]
        : resource === 'movements' || resource === 'valuations'
          ? [
              ...(resource === 'movements'
                ? [
                    {
                      name: 'type',
                      label: 'Movimento',
                      type: 'select' as const,
                      options: opts({ deposit: 'Aporte', withdrawal: 'Resgate' }),
                    },
                  ]
                : []),
              {
                name: 'amount',
                label: `${resource === 'valuations' ? 'Valor de fechamento' : 'Valor'} (${space.currency})`,
                type: 'money',
              },
              { name: 'date', label: 'Data', type: 'date' },
              { name: 'notes', label: 'Observações', type: 'notes' },
            ]
          : [
              { name: 'description', label: 'Descrição' },
              { name: 'amount', label: `Valor (${space.currency})`, type: 'money' },
              {
                name: 'categoryId',
                label: 'Categoria',
                type: 'select',
                options: (categories.data ?? [])
                  .filter((c) => !c.data.archived || c.id === form.getValues('categoryId'))
                  .map((c) => ({ value: c.id, label: c.data.name })),
              },
              ...(resource === 'recurrences'
                ? [
                    {
                      name: 'frequency',
                      label: 'Frequência',
                      type: 'select' as const,
                      options: opts({
                        daily: 'Diária',
                        weekly: 'Semanal',
                        monthly: 'Mensal',
                        yearly: 'Anual',
                      }),
                    },
                    { name: 'interval', label: 'A cada quantos períodos', type: 'number' as const },
                    { name: 'startDate', label: 'Início', type: 'date' as const },
                    {
                      name: 'endDate',
                      label: 'Término (opcional)',
                      type: 'date' as const,
                      nullable: true,
                    },
                    { name: 'paused', label: 'Pausada', type: 'switch' as const },
                  ]
                : [
                    { name: 'dueDate', label: 'Data prevista', type: 'date' as const },
                    {
                      name: 'status',
                      label: resource === 'expenses' ? 'Pagamento' : 'Recebimento',
                      type: 'select' as const,
                      options: statuses,
                    },
                    {
                      name: 'effectiveDate',
                      label: resource === 'expenses' ? 'Data do pagamento' : 'Data do recebimento',
                      type: 'date' as const,
                      nullable: true,
                    },
                  ]),
              { name: 'notes', label: 'Observações', type: 'notes' },
            ];
  const submit = form.handleSubmit((values) => {
    const normalized = { ...values };
    for (const field of fields) {
      if (
        field.type === 'percent' &&
        typeof normalized[field.name] === 'string' &&
        normalized[field.name] !== ''
      )
        normalized[field.name] = Number(String(normalized[field.name]).replace(',', '.'));
      if (field.type === 'money' && typeof normalized[field.name] === 'string')
        normalized[field.name] = normalizeMoneyInput(String(normalized[field.name]));
      const value = normalized[field.name];
      if (
        field.nullable &&
        (value === '' ||
          (field.type === 'money' && typeof value === 'string' && /^0(?:\.0+)?$/.test(value)))
      )
        normalized[field.name] = null;
    }
    if (resource === 'investments' && !normalized.taxable) normalized.taxRate = 0;
    if (resource === 'expenses' || resource === 'incomes') {
      if (normalized.status !== 'confirmed') normalized.effectiveDate = null;
      else if (!normalized.effectiveDate) normalized.effectiveDate = normalized.dueDate;
    }
    const result = schemas[resource].safeParse(normalized);
    if (!result.success) {
      for (const issue of result.error.issues)
        form.setError(String(issue.path[0] ?? 'root'), { message: issue.message });
      return;
    }
    mutation.mutate(result.data);
  });
  return (
    <ResponsiveDialog
      open
      onOpenChange={(v) => {
        if (!v && !mutation.isPending) close();
      }}
      title={`${entity ? 'Editar' : 'Adicionar'} · ${labels[resource]}`}
      description={
        resource === 'valuations'
          ? 'Informe o valor ao final do dia, incluindo os movimentos dessa data.'
          : resource === 'movements'
            ? 'Cada lançamento soma ao histórico e não pode ser alterado ou removido. Para corrigir um valor, registre um movimento compensatório.'
            : resource === 'investments'
              ? 'Estimativa com juros compostos, taxa anual e imposto sobre o rendimento. Informe o vencimento para calcular o valor final. O saldo inicial será preservado.'
              : undefined
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {resource === 'recurrences' && (
          <div className="space-y-2">
            <Label id="recurrence-type-label">Tipo</Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field: control }) => (
                <ToggleGroup
                  type="single"
                  variant="outline"
                  aria-labelledby="recurrence-type-label"
                  value={String(control.value)}
                  onValueChange={(value) => {
                    if (value) control.onChange(value);
                  }}
                  onBlur={control.onBlur}
                  ref={control.ref}
                  disabled={mutation.isPending}
                  className="w-full gap-0"
                >
                  <ToggleGroupItem
                    value="expense"
                    type="button"
                    className="min-h-11 flex-1 rounded-r-none data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive"
                  >
                    Despesa
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="income"
                    type="button"
                    className="-ml-px min-h-11 flex-1 rounded-l-none data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                  >
                    Ganho
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
            {form.formState.errors.type && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>
        )}
        {needsCategories && categories.isError && (
          <ErrorState error={categories.error} retry={() => void categories.refetch()} />
        )}
        {!entity && ['expenses', 'recurrences'].includes(resource) && (
          <div className="space-y-2">
            <Label>Assinaturas comuns</Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <Button
                  key={p.name}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    form.setValue('description', p.name);
                    form.setValue('icon', p.icon);
                    const c = categories.data?.find(
                      (c) => c.data.name === 'Assinaturas' && !c.data.archived,
                    );
                    if (c) form.setValue('categoryId', c.id);
                  }}
                >
                  <CategoryIcon icon={p.icon} />
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name} className={field.type === 'notes' ? 'sm:col-span-2' : ''}>
              <Label htmlFor={`field-${field.name}`} className="mb-2 block">
                {field.label}
              </Label>
              {field.type === 'select' ? (
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: control }) => (
                    <Select
                      value={String(control.value ?? '')}
                      onValueChange={(value) => {
                        control.onChange(value);
                        if (resource === 'investments' && field.name === 'product') {
                          form.setValue('taxable', value === 'cdb');
                          if (value !== 'cdb') form.setValue('taxRate', 0);
                        }
                      }}
                    >
                      <SelectTrigger id={`field-${field.name}`} className="w-full min-h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {resource === 'movements' && field.name === 'type' ? (
                              <span
                                className={`inline-flex items-center gap-2 ${
                                  o.value === 'deposit'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {o.value === 'deposit' ? (
                                  <ArrowUpRight
                                    className="size-4 text-inherit"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ArrowDownRight
                                    className="size-4 text-inherit"
                                    aria-hidden="true"
                                  />
                                )}
                                {o.label}
                              </span>
                            ) : (
                              o.label
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : field.type === 'date' &&
                [
                  'expenses',
                  'incomes',
                  'recurrences',
                  'movements',
                  'investments',
                  'valuations',
                ].includes(resource) ? (
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: control, fieldState }) => (
                    <DatePicker
                      id={`field-${field.name}`}
                      ref={control.ref}
                      value={typeof control.value === 'string' ? control.value : null}
                      onChange={control.onChange}
                      onBlur={control.onBlur}
                      clearable={field.nullable}
                      invalid={fieldState.invalid}
                      disabled={mutation.isPending}
                      readOnly={
                        !!entity &&
                        ['recurrences', 'investments'].includes(resource) &&
                        field.name === 'startDate'
                      }
                      min={
                        (resource === 'recurrences' && field.name === 'endDate') ||
                        (resource === 'investments' && field.name === 'maturityDate')
                          ? String(form.watch('startDate') ?? '') || undefined
                          : undefined
                      }
                      max={
                        resource === 'recurrences' && field.name === 'startDate'
                          ? String(form.watch('endDate') ?? '') || undefined
                          : undefined
                      }
                    />
                  )}
                />
              ) : field.type === 'switch' ? (
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: control }) => (
                    <Switch
                      id={`field-${field.name}`}
                      checked={!!control.value}
                      onCheckedChange={control.onChange}
                    />
                  )}
                />
              ) : field.type === 'notes' ? (
                <Textarea id={`field-${field.name}`} {...form.register(field.name)} />
              ) : field.type === 'money' ? (
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: control }) => (
                    <Input
                      {...control}
                      id={`field-${field.name}`}
                      type="text"
                      inputMode={decimals === 0 ? 'numeric' : 'decimal'}
                      className="min-h-11"
                      value={String(control.value ?? zero)}
                      readOnly={
                        !!entity && resource === 'investments' && field.name === 'initialBalance'
                      }
                      onFocus={(event) => event.currentTarget.select()}
                      aria-invalid={!!form.formState.errors[field.name]}
                      onChange={(event) => {
                        if (acceptsMoneyInput(event.target.value, decimals))
                          control.onChange(event.target.value);
                      }}
                    />
                  )}
                />
              ) : field.type === 'percent' ? (
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: control }) => (
                    <Input
                      id={`field-${field.name}`}
                      type="text"
                      inputMode="decimal"
                      className="min-h-11"
                      ref={control.ref}
                      onBlur={control.onBlur}
                      value={String(control.value ?? '')}
                      aria-invalid={!!form.formState.errors[field.name]}
                      onChange={(event) => {
                        if (/^\d*(?:[.,]\d{0,6})?$/.test(event.target.value))
                          control.onChange(event.target.value);
                      }}
                    />
                  )}
                />
              ) : (
                <Input
                  id={`field-${field.name}`}
                  type={
                    field.type === 'date'
                      ? 'date'
                      : field.type === 'number'
                        ? 'number'
                        : field.type === 'color'
                          ? 'color'
                          : 'text'
                  }
                  className="min-h-11"
                  min={field.type === 'number' ? 1 : undefined}
                  readOnly={
                    !!entity &&
                    ['recurrences', 'investments'].includes(resource) &&
                    field.name === 'startDate'
                  }
                  {...form.register(
                    field.name,
                    field.type === 'number' ? { valueAsNumber: true } : {},
                  )}
                />
              )}
              {form.formState.errors[field.name] && (
                <p role="alert" className="mt-1 text-sm text-destructive">
                  {form.formState.errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
        {entity && resource === 'recurrences' && (
          <div>
            <Label htmlFor="effective-from">Aplicar à série a partir de</Label>
            <DatePicker
              id="effective-from"
              min={localDate(space.timezone)}
              value={effectiveFrom}
              onChange={setEffectiveFrom}
              disabled={mutation.isPending}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Apenas ocorrências pendentes serão atualizadas.
            </p>
          </div>
        )}
        {mutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {mutation.error.message}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={close} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
