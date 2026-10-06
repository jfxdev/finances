import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Pencil,
  Trash2,
  Check,
  Repeat,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
  ChartNoAxesCombined,
} from 'lucide-react';
import type {
  Entity,
  Transaction,
  Resource,
  Space,
  Recurrence,
  Investment,
} from '@finances/contracts';
import {
  request,
  list,
  all,
  remove,
  save,
  formatMoney,
  formatDate,
  localDate,
  labels,
  type Summary,
  type Report,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Editor } from './editor';
import { Empty, Loading, ErrorState, CategoryIcon } from './common';
import { toast } from 'sonner';
function Actions({
  entity,
  edit,
  del,
  children,
}: {
  entity: Entity;
  edit: () => void;
  del: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-end gap-1">
      {children}
      <Button
        size="icon"
        variant="ghost"
        aria-label={`Editar ${'name' in entity.data ? entity.data.name : 'description' in entity.data ? entity.data.description : 'registro'}`}
        onClick={edit}
      >
        <Pencil className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Excluir registro" onClick={del}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
function DeleteDialog({
  entity,
  space,
  close,
}: {
  entity: Entity;
  space: Space;
  close: () => void;
}) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => remove(space.id, entity.resource, entity),
    onSuccess: (result) => {
      void qc.invalidateQueries();
      toast.success(result.archived ? 'Categoria arquivada' : 'Registro excluído');
      close();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <AlertDialog
      open
      onOpenChange={(v) => {
        if (!v && !mutation.isPending) close();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir este registro?</AlertDialogTitle>
          <AlertDialogDescription>
            {entity.resource === 'categories'
              ? 'Categorias em uso serão arquivadas para preservar o histórico.'
              : entity.resource === 'recurrences'
                ? 'As ocorrências pendentes da série também serão removidas. As confirmadas serão preservadas.'
                : 'O registro será removido das suas finanças.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {mutation.isError && (
          <p role="alert" className="text-destructive">
            {mutation.error.message}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Excluindo…' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export function Dashboard({ space, month }: { space: Space; month: string }) {
  const query = useQuery({
    queryKey: ['summary', space.id, month],
    queryFn: () => request<Summary>(`/spaces/${space.id}/summary?month=${month}`),
  });
  const [editor, setEditor] = useState<Resource | null>(null);
  if (query.isPending) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const d = query.data;
  const metrics = [
    {
      label: 'Ganhos recebidos',
      value: d.incomes,
      detail: `${formatMoney(d.pendingIncomes, space.currency)} a receber`,
      Icon: ArrowUpRight,
      color: 'text-primary',
    },
    {
      label: 'Despesas pagas',
      value: d.expenses,
      detail: `${formatMoney(d.pendingExpenses, space.currency)} a pagar`,
      Icon: ArrowDownRight,
      color: 'text-destructive',
    },
    {
      label: 'Resultado do mês',
      value: d.balance,
      detail: 'Ganhos recebidos menos despesas pagas',
      Icon: Wallet,
      color: 'text-primary',
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card
            key={m.label}
            className={m.label === 'Resultado do mês' ? 'col-span-2 py-0 lg:col-span-1' : 'py-0'}
          >
            <CardContent className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <span className={`rounded-lg bg-muted p-2 ${m.color}`}>
                  <m.Icon className="size-4" />
                </span>
              </div>
              <p className="break-words text-2xl font-semibold tracking-tight lg:text-3xl">
                {formatMoney(m.value, space.currency)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{m.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {space.role !== 'reader' && (
          <>
            <Button onClick={() => setEditor('expenses')}>
              <Plus className="size-4" />
              Adicionar despesa
            </Button>
            <Button variant="outline" onClick={() => setEditor('incomes')}>
              <Plus className="size-4" />
              Adicionar ganho
            </Button>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="min-w-0 xl:col-span-3">
          <CardHeader>
            <CardTitle>Para onde foi seu dinheiro</CardTitle>
            <CardDescription>Despesas pagas por categoria neste mês</CardDescription>
          </CardHeader>
          <CardContent>
            {d.byCategory.length ? (
              <ChartContainer
                config={{ amount: { label: 'Despesas', color: 'var(--chart-1)' } }}
                className="h-[260px] w-full min-w-0 aspect-auto"
              >
                <BarChart
                  accessibilityLayer
                  data={d.byCategory.map((c) => ({
                    ...c,
                    amount: Number(c.amount),
                    fill: c.color,
                  }))}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(s) => s.slice(0, 12)}
                  />
                  <YAxis
                    width={55}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v)
                    }
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatMoney(String(v), space.currency)}
                      />
                    }
                  />
                  <Bar isAnimationActive={false} dataKey="amount" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                As categorias aparecerão após confirmar uma despesa.
              </div>
            )}
            <div className="mt-3 space-y-2">
              {d.byCategory.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="tabular-nums">{formatMoney(c.amount, space.currency)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>Próximos vencimentos</CardTitle>
            <CardDescription>Lançamentos pendentes do período</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {d.upcoming.length ? (
              d.upcoming.map((e) => {
                const t = e.data as Transaction;
                const overdue = t.dueDate < localDate(space.timezone);
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <CategoryIcon
                      icon={
                        t.icon ?? (e.resource === 'expenses' ? 'repeat' : 'chart-no-axes-combined')
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.description}</p>
                      <p
                        className={`text-xs ${overdue ? 'text-destructive' : 'text-muted-foreground'}`}
                      >
                        {formatDate(t.dueDate)}
                        {overdue ? ' · Atrasado' : ''}
                      </p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {formatMoney(t.amount, space.currency)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum vencimento pendente neste mês.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      {editor && <Editor resource={editor} space={space} close={() => setEditor(null)} />}
    </div>
  );
}
function subtotal(entities: Entity[], currency: string) {
  const scale =
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2;
  let n = 0n;
  for (const e of entities) {
    if (!('amount' in e.data) || ('status' in e.data && e.data.status === 'cancelled')) continue;
    const [w, f = ''] = e.data.amount.split('.');
    n += BigInt(w) * 10n ** BigInt(scale) + BigInt(f.padEnd(scale, '0') || '0');
  }
  const str = n.toString().padStart(scale + 1, '0');
  return scale ? `${str.slice(0, -scale)}.${str.slice(-scale)}` : str;
}
export function Transactions({ space, month }: { space: Space; month: string }) {
  const [resource, setResource] = useState<'expenses' | 'incomes'>('expenses');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [grouped, setGrouped] = useState(false);
  const [edit, setEdit] = useState<Entity | null | undefined>();
  const [del, setDel] = useState<Entity>();
  const qc = useQueryClient();
  const categories = useQuery({
    queryKey: ['categories', space.id],
    queryFn: () => all(space.id, 'categories'),
  });
  const [year, mo] = month.split('-').map(Number);
  const from = `${month}-01`,
    to = new Date(Date.UTC(year, mo, 0)).toISOString().slice(0, 10);
  const filter = {
    from,
    to,
    ...(status !== 'all' ? { status: status as Transaction['status'] } : {}),
    ...(category !== 'all' ? { categoryId: category } : {}),
  };
  const query = useQuery({
    queryKey: ['transactions', space.id, resource, filter, page, grouped],
    queryFn: async () =>
      grouped
        ? { items: await all(space.id, resource, filter), total: 0, page: 1, limit: 25 }
        : list(space.id, resource, { ...filter, page }),
  });
  const confirm = useMutation({
    mutationFn: (e: Entity) =>
      save(
        space.id,
        resource,
        {
          ...(e.data as Transaction),
          status: 'confirmed',
          effectiveDate: localDate(space.timezone),
        },
        e,
      ),
    onSuccess: () => {
      void qc.invalidateQueries();
      toast.success(resource === 'expenses' ? 'Pagamento confirmado' : 'Recebimento confirmado');
    },
    onError: (e) => toast.error(e.message),
  });
  const writable = space.role !== 'reader';
  const catMap = new Map(categories.data?.map((c) => [c.id, c.data]));
  const columns: ColumnDef<Entity>[] = [
    {
      id: 'description',
      header: 'Descrição',
      cell: ({ row }) => {
        const d = row.original.data as Transaction;
        const c = catMap.get(d.categoryId);
        return (
          <div className="flex items-center gap-3">
            <CategoryIcon icon={d.icon ?? c?.icon} color={c?.color} />
            <div>
              <p className="font-medium">{d.description}</p>
              <p className="text-xs text-muted-foreground">
                {c?.name ?? 'Categoria'}
                {row.original.recurrenceId ? ' · Recorrente' : ''}
              </p>
              <p className="mt-1 text-xs text-muted-foreground md:hidden">
                {formatDate(d.effectiveDate ?? d.dueDate)} ·{' '}
                {d.status === 'confirmed'
                  ? 'Confirmado'
                  : d.status === 'cancelled'
                    ? 'Cancelado'
                    : d.dueDate < localDate(space.timezone)
                      ? 'Atrasado'
                      : 'Pendente'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'date',
      header: 'Data',
      cell: ({ row }) =>
        formatDate(
          (row.original.data as Transaction).effectiveDate ??
            (row.original.data as Transaction).dueDate,
        ),
    },
    {
      id: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const t = row.original.data as Transaction;
        return (
          <Badge
            variant={
              t.status === 'confirmed'
                ? 'secondary'
                : t.status === 'cancelled'
                  ? 'outline'
                  : t.dueDate < localDate(space.timezone)
                    ? 'destructive'
                    : 'outline'
            }
          >
            {t.status === 'confirmed'
              ? 'Confirmado'
              : t.status === 'cancelled'
                ? 'Cancelado'
                : t.dueDate < localDate(space.timezone)
                  ? 'Atrasado'
                  : 'Pendente'}
          </Badge>
        );
      },
    },
    {
      id: 'amount',
      header: 'Valor',
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatMoney((row.original.data as Transaction).amount, space.currency)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        writable ? (
          <Actions
            entity={row.original}
            edit={() => setEdit(row.original)}
            del={() => setDel(row.original)}
          >
            {(row.original.data as Transaction).status === 'pending' && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Confirmar lançamento"
                disabled={confirm.isPending}
                onClick={() => confirm.mutate(row.original)}
              >
                <Check className="size-4" />
              </Button>
            )}
          </Actions>
        ) : null,
    },
  ];
  const table = useReactTable({
    data: query.data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const groups = grouped
    ? [...new Set(query.data?.items.map((e) => (e.data as Transaction).categoryId))].map((id) => ({
        id,
        name: catMap.get(id)?.name ?? 'Categoria',
        items: query.data?.items.filter((e) => (e.data as Transaction).categoryId === id) ?? [],
      }))
    : [];
  function renderTable(
    rows: typeof table extends never ? never : ReturnType<typeof table.getRowModel>['rows'],
  ) {
    return (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((g) => (
            <TableRow key={g.id}>
              {g.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className={
                    ['date', 'status'].includes(h.column.id)
                      ? 'hidden md:table-cell'
                      : h.column.id === 'amount'
                        ? 'text-right'
                        : ''
                  }
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={
                    ['date', 'status'].includes(cell.column.id)
                      ? 'hidden md:table-cell'
                      : cell.column.id === 'amount'
                        ? 'text-right'
                        : ''
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={resource}
          onValueChange={(v) => {
            setResource(v as typeof resource);
            setPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
            <TabsTrigger value="incomes">Ganhos</TabsTrigger>
          </TabsList>
        </Tabs>
        {writable && (
          <Button onClick={() => setEdit(null)}>
            <Plus className="size-4" />
            Adicionar
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filtrar categoria" className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.data?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.data.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filtrar estado" className="w-[145px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch
            id="grouped"
            checked={grouped}
            onCheckedChange={(v) => {
              setGrouped(v);
              setPage(1);
            }}
          />
          <Label htmlFor="grouped">Por categoria</Label>
        </div>
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.items.length ? (
        <Empty
          title="Nenhum lançamento no período"
          description="Registre suas despesas e ganhos para acompanhar este mês."
        />
      ) : grouped ? (
        <div className="space-y-4">
          {groups.map((g) => (
            <Card key={g.id} className="overflow-hidden">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{g.name}</CardTitle>
                <span className="font-semibold">
                  {formatMoney(subtotal(g.items, space.currency), space.currency)}
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {renderTable(
                  table
                    .getRowModel()
                    .rows.filter((r) => (r.original.data as Transaction).categoryId === g.id),
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0">{renderTable(table.getRowModel().rows)}</CardContent>
          </Card>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {query.data.total} lançamentos · Página {page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Página anterior"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Próxima página"
                disabled={page * 25 >= query.data.total}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
      {edit !== undefined && (
        <Editor
          key={edit?.id ?? resource}
          resource={resource}
          space={space}
          entity={edit ?? undefined}
          close={() => setEdit(undefined)}
        />
      )}{' '}
      {del && <DeleteDialog entity={del} space={space} close={() => setDel(undefined)} />}
    </div>
  );
}
export function Recurrences({ space }: { space: Space }) {
  const query = useQuery({
    queryKey: ['recurrences', space.id],
    queryFn: () => all(space.id, 'recurrences'),
  });
  const [edit, setEdit] = useState<Entity | null | undefined>();
  const [del, setDel] = useState<Entity>();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          O app gera pendentes. Você confirma quando pagar ou receber.
        </p>
        {space.role !== 'reader' && (
          <Button onClick={() => setEdit(null)}>
            <Plus className="size-4" />
            Nova recorrência
          </Button>
        )}
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.length ? (
        <Empty
          title="Crie sua primeira recorrência"
          description="Organize assinaturas, aluguel, salário e outros valores recorrentes."
        />
      ) : (
        <div className="space-y-6">
          {[
            { type: 'income', title: 'Ganhos' },
            { type: 'expense', title: 'Despesas' },
          ].map((group) => {
            const items = query.data
              .filter((e) => e.data.type === group.type)
              .sort((a, b) => Number(a.data.paused) - Number(b.data.paused));
            const expense = group.type === 'expense';
            return (
              <section key={group.type} className="space-y-3">
                <h2 className={`text-lg font-semibold ${expense ? 'text-destructive' : ''}`}>
                  {group.title}
                </h2>
                <div className="overflow-hidden rounded-md border">
                  <Table aria-label={`Recorrências de ${group.title.toLowerCase()}`}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Frequência</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        {space.role !== 'reader' && (
                          <TableHead className="text-right">Ações</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!items.length && (
                        <TableRow>
                          <TableCell
                            colSpan={space.role !== 'reader' ? 5 : 4}
                            className="h-24 text-center text-muted-foreground"
                          >
                            Nenhuma recorrência de {group.title.toLowerCase()}.
                          </TableCell>
                        </TableRow>
                      )}
                      {items.map((e) => {
                        const d = e.data;
                        return (
                          <TableRow
                            key={e.id}
                            className={d.paused ? 'opacity-50 [&>td]:line-through' : undefined}
                          >
                            <TableCell className="min-w-48 whitespace-normal">
                              <div className="flex items-center gap-3">
                                <CategoryIcon
                                  icon={d.icon ?? 'repeat'}
                                  variant={expense ? 'destructive' : 'default'}
                                />
                                <p className="font-medium">
                                  {d.description}
                                  {d.paused && <span className="sr-only"> (Inativa)</span>}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              A cada {d.interval}{' '}
                              {
                                {
                                  daily: 'dia(s)',
                                  weekly: 'semana(s)',
                                  monthly: 'mês(es)',
                                  yearly: 'ano(s)',
                                }[d.frequency]
                              }
                            </TableCell>
                            <TableCell>
                              Desde {formatDate(d.startDate)}
                              {d.endDate ? ` até ${formatDate(d.endDate)}` : ''}
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium tabular-nums ${expense ? 'text-destructive' : ''}`}
                            >
                              <span className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                                {expense ? (
                                  <ArrowDownRight className="size-4 shrink-0" aria-hidden="true" />
                                ) : (
                                  <ArrowUpRight
                                    className="size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                  />
                                )}
                                <span className={d.paused ? 'line-through' : undefined}>
                                  {formatMoney(d.amount, space.currency)}
                                </span>
                              </span>
                            </TableCell>
                            {space.role !== 'reader' && (
                              <TableCell>
                                <Actions entity={e} edit={() => setEdit(e)} del={() => setDel(e)} />
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <p className="flex flex-wrap justify-end gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Total de {group.title.toLowerCase()}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${expense ? 'text-destructive' : ''}`}
                  >
                    {formatMoney(subtotal(items, space.currency), space.currency)}
                  </span>
                </p>
              </section>
            );
          })}
        </div>
      )}
      {edit !== undefined && (
        <Editor
          resource="recurrences"
          space={space}
          entity={edit ?? undefined}
          close={() => setEdit(undefined)}
        />
      )}{' '}
      {del && <DeleteDialog entity={del} space={space} close={() => setDel(undefined)} />}
    </div>
  );
}
function InvestmentCard({
  entity,
  space,
  select,
  edit,
}: {
  entity: Entity<'investments'>;
  space: Space;
  select: () => void;
  edit: () => void;
}) {
  const report = useQuery({
    queryKey: ['report', space.id, entity.id],
    queryFn: () => request<Report>(`/spaces/${space.id}/investments/${entity.id}/report`),
  });
  const d = entity.data;
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <CategoryIcon icon={d.type === 'savings' ? 'piggy-bank' : 'chart-no-axes-combined'} />
          <div className="flex-1">
            <button className="text-left font-semibold hover:underline" onClick={select}>
              {d.name}
            </button>
            <p className="text-xs text-muted-foreground">
              {d.institution || (d.type === 'savings' ? 'Caixinha' : 'Investimento')}
            </p>
          </div>
          {space.role !== 'reader' && (
            <Button size="icon" variant="ghost" aria-label={`Editar ${d.name}`} onClick={edit}>
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
        {report.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {report.error.message}
          </p>
        ) : (
          <>
            <p className="text-2xl font-semibold">
              {formatMoney(report.data?.current, space.currency)}
            </p>
            {d.goal ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Meta: {formatMoney(d.goal, space.currency)}</span>
                  <span>{Math.max(0, report.data?.progress ?? 0).toFixed(1)}%</span>
                </div>
                <Progress value={Math.max(0, Math.min(100, report.data?.progress ?? 0))} />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Resultado: {formatMoney(report.data?.result, space.currency)}
              </p>
            )}
          </>
        )}
        {report.data?.projection && (
          <p className="text-sm text-muted-foreground">
            Estimativa líquida em {formatDate(report.data.projection.maturityDate)}:{' '}
            <span className="font-semibold text-foreground">
              {formatMoney(report.data.projection.net, space.currency)}
            </span>
          </p>
        )}
        <Button className="w-full" variant="outline" onClick={select}>
          Ver evolução e movimentos
          <ArrowUpRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
function InvestmentDetail({
  entity,
  space,
  back,
}: {
  entity: Entity<'investments'>;
  space: Space;
  back: () => void;
}) {
  const [editor, setEditor] = useState<{ resource: Resource; entity?: Entity }>();
  const report = useQuery({
    queryKey: ['report', space.id, entity.id],
    queryFn: () => request<Report>(`/spaces/${space.id}/investments/${entity.id}/report`),
  });
  const movements = useQuery({
    queryKey: ['movements', space.id, entity.id],
    queryFn: () => all(space.id, 'movements', { investmentId: entity.id }),
  });
  const valuations = useQuery({
    queryKey: ['valuations', space.id, entity.id],
    queryFn: () => all(space.id, 'valuations', { investmentId: entity.id }),
  });
  const points = new Map<string, { date: string; current?: number; estimated?: number }>();
  for (const point of report.data?.history ?? [])
    points.set(point.date, { date: point.date, current: Number(point.current) });
  for (const point of report.data?.forecast ?? [])
    points.set(point.date, {
      ...points.get(point.date),
      date: point.date,
      estimated: Number(point.net),
    });
  const chartData = [...points.values()].sort((a, b) => a.date.localeCompare(b.date));
  const records = [...(movements.data ?? []), ...(valuations.data ?? [])].sort((a, b) =>
    b.data.date.localeCompare(a.data.date),
  );
  return (
    <div className="space-y-5">
      <Button variant="ghost" onClick={back}>
        <ChevronLeft className="size-4" />
        Todos os investimentos
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{entity.data.name}</h2>
          <p className="text-sm text-muted-foreground">{entity.data.institution}</p>
        </div>
        {space.role !== 'reader' && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setEditor({ resource: 'movements' })}>
              <Plus className="size-4" />
              Aporte ou resgate
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditor({ resource: 'investments', entity })}
            >
              Editar investimento
            </Button>
            <Button variant="outline" onClick={() => setEditor({ resource: 'valuations' })}>
              Atualizar valor
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Os lançamentos são cumulativos e permanecem no histórico. Correções devem ser registradas
        como novos movimentos.
      </p>
      {report.isPending ? (
        <Loading />
      ) : report.isError ? (
        <ErrorState error={report.error} retry={() => void report.refetch()} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { name: 'Valor atual', value: report.data.current },
              { name: 'Total aportado', value: report.data.deposits },
              { name: 'Total resgatado', value: report.data.withdrawals },
              { name: 'Resultado', value: report.data.result },
            ].map((m) => (
              <Card key={m.name}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{m.name}</p>
                  <p className="mt-2 break-words text-lg font-semibold">
                    {formatMoney(m.value, space.currency)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {!report.data.projection && (
            <p className="text-sm text-muted-foreground">
              Informe a rentabilidade anual esperada e o vencimento ao editar o investimento para
              ver a estimativa do valor final.
            </p>
          )}
          {report.data.projection && (
            <Card>
              <CardHeader>
                <CardTitle>Estimativa no vencimento</CardTitle>
                <CardDescription>
                  {formatDate(report.data.projection.maturityDate)} ·{' '}
                  {entity.data.expectedAnnualReturn?.toLocaleString('pt-BR')}% ao ano ·{' '}
                  {entity.data.taxable
                    ? `${entity.data.taxRate.toLocaleString('pt-BR')}% de imposto sobre o rendimento`
                    : 'Sem imposto'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: 'Valor bruto estimado', value: report.data.projection.gross },
                    { label: 'Rendimento estimado', value: report.data.projection.earnings },
                    { label: 'Imposto estimado', value: report.data.projection.tax },
                    { label: 'Valor líquido estimado', value: report.data.projection.net },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="mt-2 break-words font-semibold">
                        {formatMoney(item.value, space.currency)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Projeção com juros compostos em dias corridos (base de 365 dias), considerando os
                  lançamentos registrados. A rentabilidade pode variar.
                </p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do valor</CardTitle>
              <CardDescription>
                Pontos a cada 7 dias, incluindo a data final. Valor registrado e estimativa líquida.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  current: { label: 'Valor registrado', color: 'var(--chart-1)' },
                  estimated: { label: 'Estimativa líquida', color: 'var(--chart-2)' },
                }}
                className="h-[250px] w-full min-w-0 aspect-auto"
              >
                <LineChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <YAxis
                    width={64}
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('pt-BR', {
                        notation: 'compact',
                        maximumFractionDigits: 1,
                      }).format(value)
                    }
                  />
                  <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={24} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatMoney(String(v), space.currency)}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  {report.data.projection && (
                    <Line
                      isAnimationActive={false}
                      dataKey="estimated"
                      name="Estimativa líquida"
                      type="linear"
                      stroke="var(--color-estimated)"
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls
                    />
                  )}
                  <Line
                    isAnimationActive={false}
                    name="Valor registrado"
                    dataKey="current"
                    type="linear"
                    stroke="var(--color-current)"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
      {movements.isError || valuations.isError ? (
        <ErrorState
          error={(movements.error ?? valuations.error)!}
          retry={() => {
            void movements.refetch();
            void valuations.refetch();
          }}
        />
      ) : !records.length ? (
        <Empty
          title="Nenhum movimento registrado"
          description="Adicione aportes, resgates ou o valor de fechamento para acompanhar sua evolução."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movimento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      {e.resource === 'valuations'
                        ? 'Avaliação'
                        : e.data && 'type' in e.data && e.data.type === 'deposit'
                          ? 'Aporte'
                          : 'Resgate'}
                    </TableCell>
                    <TableCell>{formatDate(e.data.date)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(e.data.amount, space.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {editor && (
        <Editor
          resource={editor.resource}
          space={space}
          investmentId={entity.id}
          entity={editor.entity}
          close={() => setEditor(undefined)}
        />
      )}{' '}
    </div>
  );
}
export function Investments({ space }: { space: Space }) {
  const query = useQuery({
    queryKey: ['investments', space.id],
    queryFn: () => all(space.id, 'investments'),
  });
  const [edit, setEdit] = useState<Entity | null | undefined>();
  const [selected, setSelected] = useState<string>();
  const investment = query.data?.find((e) => e.id === selected);
  if (investment)
    return (
      <InvestmentDetail entity={investment} space={space} back={() => setSelected(undefined)} />
    );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Um passo de cada vez para seus objetivos.</p>
        {space.role !== 'reader' && (
          <Button onClick={() => setEdit(null)}>
            <Plus className="size-4" />
            Novo investimento
          </Button>
        )}
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.length ? (
        <Empty
          title="Comece a guardar para seus planos"
          description="Adicione um investimento ou uma caixinha e acompanhe seus aportes e metas."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {query.data.map((e) => (
            <InvestmentCard
              key={e.id}
              entity={e}
              space={space}
              select={() => setSelected(e.id)}
              edit={() => setEdit(e)}
            />
          ))}
        </div>
      )}
      {edit !== undefined && (
        <Editor
          resource="investments"
          space={space}
          entity={edit ?? undefined}
          close={() => setEdit(undefined)}
        />
      )}{' '}
    </div>
  );
}
export function Categories({ space }: { space: Space }) {
  const query = useQuery({
    queryKey: ['categories', space.id],
    queryFn: () => all(space.id, 'categories'),
  });
  const [edit, setEdit] = useState<Entity | null | undefined>();
  const [del, setDel] = useState<Entity>();
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Organize seus lançamentos do seu jeito.</p>
        {space.role !== 'reader' && (
          <Button size="sm" onClick={() => setEdit(null)}>
            <Plus className="size-4" />
            Categoria
          </Button>
        )}
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {query.data.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <CategoryIcon icon={e.data.icon} color={e.data.color} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{e.data.name}</p>
                  {e.data.archived && <Badge variant="outline">Arquivada</Badge>}
                </div>
                {space.role !== 'reader' && (
                  <Actions entity={e} edit={() => setEdit(e)} del={() => setDel(e)} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {edit !== undefined && (
        <Editor
          resource="categories"
          space={space}
          entity={edit ?? undefined}
          close={() => setEdit(undefined)}
        />
      )}{' '}
      {del && <DeleteDialog entity={del} space={space} close={() => setDel(undefined)} />}
    </div>
  );
}
