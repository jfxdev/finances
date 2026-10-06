import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  resources,
  type Grant,
  type Operation,
  type Space,
  type User,
  spaceSchema,
} from '@finances/contracts';
import { request, labels, formatDate } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { ResponsiveDialog, Loading, ErrorState, Empty } from './common';
import { Categories } from './financial-pages';
import { Plus, Copy, KeyRound, Users, Shield, Link, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
type KeyInfo = {
  id: string;
  name: string;
  grants: Grant[];
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};
function ShareValue({
  value,
  title,
  description = 'Copie e guarde em um local seguro.',
  close,
}: {
  value: string;
  title: string;
  description?: string;
  close: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <ResponsiveDialog
      open
      title={title}
      onOpenChange={(v) => {
        if (!v) close();
      }}
      description={description}
    >
      <Input readOnly value={value} aria-label={title} />
      <Button
        className="mt-4 w-full"
        onClick={() =>
          void navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => toast.error('Selecione o texto e copie manualmente'))
        }
      >
        <Copy className="size-4" />
        {copied ? 'Copiado' : 'Copiar'}
      </Button>
    </ResponsiveDialog>
  );
}
function Confirm({
  title,
  description,
  run,
  close,
}: {
  title: string;
  description: string;
  run: () => Promise<unknown>;
  close: () => void;
}) {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: run,
    onSuccess: () => {
      void qc.invalidateQueries();
      close();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <AlertDialog
      open
      onOpenChange={(v) => {
        if (!v && !m.isPending) close();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {m.isError && (
          <p role="alert" className="text-destructive">
            {m.error.message}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={m.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              m.mutate();
            }}
            disabled={m.isPending}
          >
            {m.isPending ? 'Aguarde…' : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function Keys({ spaces }: { spaces: Space[] }) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['keys'], queryFn: () => request<KeyInfo[]>('/keys') });
  const [newKey, setNewKey] = useState(false);
  const [value, setValue] = useState<string>();
  const [revoke, setRevoke] = useState<KeyInfo>();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg text-sm text-muted-foreground">
          Dê acesso a agentes com permissões escolhidas por espaço e recurso.
        </p>
        <Button onClick={() => setNewKey(true)}>
          <Plus className="size-4" />
          Nova chave
        </Button>
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.length ? (
        <Empty
          title="Conecte seus agentes"
          description="Crie uma API key para usar a API REST e o MCP."
        />
      ) : (
        <div className="space-y-3">
          {query.data.map((k) => (
            <Card key={k.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <KeyRound className="size-5 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{k.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {k.grants.length} permissões ·{' '}
                    {k.expiresAt
                      ? `Expira em ${formatDate(k.expiresAt.slice(0, 10))}`
                      : 'Sem expiração'}
                  </p>
                  <details className="mt-2 text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Ver permissões</summary>
                    <ul className="mt-2 space-y-1">
                      {k.grants.map((g, i) => (
                        <li key={i}>
                          {spaces.find((s) => s.id === g.spaceId)?.name ?? 'Espaço removido'} ·{' '}
                          {labels[g.resource]} ·{' '}
                          {g.operations
                            .map(
                              (o) =>
                                ({
                                  read: 'ler',
                                  create: 'criar',
                                  update: 'alterar',
                                  delete: 'excluir',
                                })[o],
                            )
                            .join(', ')}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
                {k.revokedAt ? (
                  <Badge variant="outline">Revogada</Badge>
                ) : k.expiresAt && new Date(k.expiresAt) < new Date() ? (
                  <Badge variant="outline">Expirada</Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setRevoke(k)}>
                    Revogar
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conectar por MCP</CardTitle>
          <CardDescription>
            Use a URL abaixo com sua API key no cabeçalho Bearer. Clientes que exigem OAuth não são
            suportados nesta versão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <code className="block overflow-x-auto rounded-lg bg-muted p-3 text-sm">
            {window.location.origin}/mcp
          </code>
          <p className="mt-3 text-sm text-muted-foreground">
            Para agentes locais, o adaptador stdio recebe FINANCES_URL e FINANCES_API_KEY por
            ambiente. Consulte o guia de instalação.
          </p>
        </CardContent>
      </Card>
      {newKey && (
        <KeyForm
          spaces={spaces}
          close={() => setNewKey(false)}
          created={(secret) => {
            setNewKey(false);
            setValue(secret);
            void qc.invalidateQueries({ queryKey: ['keys'] });
          }}
        />
      )}
      {value && (
        <ShareValue
          value={value}
          title="Sua API key · exibida apenas uma vez"
          close={() => setValue(undefined)}
        />
      )}{' '}
      {revoke && (
        <Confirm
          title="Revogar esta chave?"
          description="Os agentes conectados com ela perderão acesso imediatamente."
          close={() => setRevoke(undefined)}
          run={() => request(`/keys/${revoke.id}`, 'DELETE')}
        />
      )}
    </div>
  );
}
function KeyForm({
  spaces,
  close,
  created,
}: {
  spaces: Space[];
  close: () => void;
  created: (secret: string) => void;
}) {
  const [name, setName] = useState('');
  const [expires, setExpires] = useState('');
  const [spaceId, setSpaceId] = useState(spaces[0]?.id ?? '');
  const [grants, setGrants] = useState<Grant[]>([]);
  const m = useMutation({
    mutationFn: () =>
      request<{ secret: string }>('/keys', 'POST', {
        name,
        expiresAt: expires ? new Date(expires).toISOString() : null,
        grants,
      }),
    onSuccess: (r) => created(r.secret),
    onError: (e) => toast.error(e.message),
  });
  function toggle(resource: Grant['resource'], operation: Operation, checked: boolean) {
    setGrants((previous) => {
      const old = previous.find((g) => g.spaceId === spaceId && g.resource === resource);
      const operations = checked
        ? [...new Set([...(old?.operations ?? []), operation])]
        : (old?.operations ?? []).filter((o) => o !== operation);
      return [
        ...previous.filter((g) => !(g.spaceId === spaceId && g.resource === resource)),
        ...(operations.length ? [{ spaceId, resource, operations }] : []),
      ];
    });
  }
  return (
    <ResponsiveDialog
      open
      title="Nova API key"
      description="A chave só poderá fazer o que você selecionar abaixo."
      onOpenChange={(v) => {
        if (!v && !m.isPending) close();
      }}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          m.mutate();
        }}
      >
        <div>
          <Label htmlFor="key-name">Nome</Label>
          <Input
            id="key-name"
            required
            maxLength={160}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Meu agente financeiro"
          />
        </div>
        <div>
          <Label htmlFor="key-expiry">Expiração (opcional)</Label>
          <Input
            id="key-expiry"
            type="datetime-local"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
          />
        </div>
        <div>
          <Label>Espaço</Label>
          <Select value={spaceId} onValueChange={setSpaceId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spaces.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} · {s.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recurso</TableHead>
              {['Ler', 'Criar', 'Alterar', 'Excluir'].map((o) => (
                <TableHead key={o} className="px-1 text-center text-xs">
                  {o}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((r) => (
              <TableRow key={r}>
                <TableCell className="px-1 text-xs">{labels[r]}</TableCell>
                {(['read', 'create', 'update', 'delete'] as Operation[]).map((o) => (
                  <TableCell key={o} className="px-1 text-center">
                    <Checkbox
                      aria-label={`${labels[r]}: ${{ read: 'Ler', create: 'Criar', update: 'Alterar', delete: 'Excluir' }[o]}`}
                      checked={
                        !!grants
                          .find((g) => g.spaceId === spaceId && g.resource === r)
                          ?.operations.includes(o)
                      }
                      disabled={
                        spaces.find((s) => s.id === spaceId)?.role === 'reader' && o !== 'read'
                      }
                      onCheckedChange={(v) => toggle(r, o, v === true)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">
          {grants.length} permissões selecionadas. Troque de espaço para adicionar outras.
        </p>
        {m.isError && (
          <p role="alert" className="text-sm text-destructive">
            {m.error.message}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={!name || !grants.length || m.isPending}>
          {m.isPending ? 'Criando…' : 'Criar chave'}
        </Button>
      </form>
    </ResponsiveDialog>
  );
}
function SpaceForm({ space, close }: { space?: Space; close: () => void }) {
  const qc = useQueryClient();
  const form = useForm<{ name: string; currency: string; timezone: string }>({
    defaultValues: space
      ? { name: space.name, currency: space.currency, timezone: space.timezone }
      : { name: '', currency: 'BRL', timezone: 'America/Sao_Paulo' },
  });
  const m = useMutation({
    mutationFn: (d: unknown) =>
      space
        ? request(`/spaces/${space.id}`, 'PATCH', { ...(d as object), version: space.version })
        : request('/spaces', 'POST', d),
    onSuccess: () => {
      void qc.invalidateQueries();
      toast.success('Espaço salvo');
      close();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <ResponsiveDialog
      open
      title={space ? 'Editar espaço' : 'Novo grupo'}
      onOpenChange={(v) => {
        if (!v && !m.isPending) close();
      }}
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((d) => {
          const result = spaceSchema.safeParse(d);
          if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
          }
          m.mutate(result.data);
        })}
      >
        <div>
          <Label htmlFor="space-name">Nome</Label>
          <Input id="space-name" required {...form.register('name')} />
        </div>
        <div>
          <Label htmlFor="space-currency">Moeda ISO</Label>
          <Input
            id="space-currency"
            maxLength={3}
            required
            {...form.register('currency', { setValueAs: (v) => String(v).toUpperCase() })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            A moeda não poderá mudar após o primeiro registro financeiro.
          </p>
        </div>
        <div>
          <Label htmlFor="space-timezone">Fuso horário</Label>
          <Input id="space-timezone" required {...form.register('timezone')} />
        </div>
        {m.isError && (
          <p role="alert" className="text-sm text-destructive">
            {m.error.message}
          </p>
        )}
        <Button className="w-full" disabled={m.isPending}>
          Salvar
        </Button>
      </form>
    </ResponsiveDialog>
  );
}
function Group({ space, user }: { space: Space; user: User }) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['members', space.id],
    queryFn: () =>
      request<{ id: string; name: string; role: Space['role'] }[]>(`/spaces/${space.id}/members`),
  });
  const [spaceForm, setSpaceForm] = useState<'new' | 'edit'>();
  const [value, setValue] = useState<string>();
  const [inviteRole, setInviteRole] = useState<'editor' | 'reader'>('reader');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    run: () => Promise<unknown>;
  }>();
  const invite = useMutation({
    mutationFn: () =>
      request<{ url: string }>(`/spaces/${space.id}/invites`, 'POST', {
        role: inviteRole,
        sharePersonal: space.personal,
      }),
    onSuccess: (r) => {
      setInviteOpen(false);
      setValue(r.url);
      void qc.invalidateQueries({ queryKey: ['spaces'] });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setSpaceForm('new')}>
          <Plus className="size-4" />
          Criar grupo
        </Button>
        {space.role === 'owner' && (
          <>
            <Button variant="outline" onClick={() => setSpaceForm('edit')}>
              Editar espaço atual
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                invite.reset();
                setInviteOpen(true);
              }}
            >
              <Users className="size-4" />
              Convidar pessoas
            </Button>
          </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{space.name}</CardTitle>
          <CardDescription>
            {space.currency} · {space.timezone} ·{' '}
            {space.personal ? 'Espaço pessoal privado' : 'Grupo compartilhado'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {query.isPending ? (
            <Loading />
          ) : query.isError ? (
            <ErrorState error={query.error} retry={() => void query.refetch()} />
          ) : (
            query.data.map((member) => (
              <div key={member.id} className="flex flex-wrap items-center gap-2 border-b pb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {member.name}
                    {member.id === user.id ? ' (você)' : ''}
                  </p>
                  <Badge variant="outline">
                    {{ owner: 'Dono', editor: 'Editor', reader: 'Leitor' }[member.role]}
                  </Badge>
                </div>
                {space.role === 'owner' && !space.personal && member.role !== 'owner' && (
                  <>
                    <Select
                      value={member.role}
                      onValueChange={(v) =>
                        setConfirmation({
                          title: v === 'owner' ? 'Transferir propriedade?' : 'Alterar permissão?',
                          description:
                            v === 'owner'
                              ? 'Você passará a ser editor e este membro será o novo dono do grupo.'
                              : 'A nova permissão será aplicada imediatamente, inclusive às chaves do membro.',
                          run: () =>
                            request(`/spaces/${space.id}/members/${member.id}`, 'PATCH', {
                              role: v,
                            }),
                        })
                      }
                    >
                      <SelectTrigger className="w-28" aria-label={`Papel de ${member.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reader">Leitor</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="owner">Dono</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover ${member.name}`}
                      onClick={() =>
                        setConfirmation({
                          title: 'Remover membro?',
                          description: 'O membro perderá o acesso ao grupo imediatamente.',
                          run: () => request(`/spaces/${space.id}/members/${member.id}`, 'DELETE'),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {spaceForm && (
        <SpaceForm
          space={spaceForm === 'edit' ? space : undefined}
          close={() => setSpaceForm(undefined)}
        />
      )}{' '}
      {value && (
        <ShareValue
          value={value}
          title="Convite · válido por sete dias"
          description="Envie este link à pessoa convidada. Ela poderá criar uma conta ou entrar para aceitar. O convite permite uma única aceitação."
          close={() => setValue(undefined)}
        />
      )}{' '}
      {inviteOpen && (
        <ResponsiveDialog
          open
          title="Convidar pessoas"
          onOpenChange={(open) => {
            if (!open && !invite.isPending) setInviteOpen(false);
          }}
          description={
            space.personal
              ? 'Ao criar o convite, este espaço pessoal passará a ser compartilhado. Quem aceitar terá acesso aos registros atuais e futuros deste espaço.'
              : `Quem aceitar terá acesso aos registros atuais e futuros de ${space.name}.`
          }
        >
          <div className="space-y-4">
            <div>
              <Label id="invite-role-label">Permissão</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as typeof inviteRole)}
              >
                <SelectTrigger className="mt-2 w-full" aria-labelledby="invite-role-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Somente visualizar</SelectItem>
                  <SelectItem value="editor">Pode editar</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                {inviteRole === 'reader'
                  ? 'Pode consultar os registros, sem alterá-los.'
                  : 'Pode criar, editar e excluir registros. Apenas o dono gerencia os membros.'}
              </p>
            </div>
            {invite.isError && (
              <p role="alert" className="text-sm text-destructive">
                {invite.error.message}
              </p>
            )}
            <Button className="w-full" disabled={invite.isPending} onClick={() => invite.mutate()}>
              <Link className="size-4" />
              {invite.isPending
                ? 'Criando…'
                : space.personal
                  ? 'Compartilhar e criar convite'
                  : 'Criar convite'}
            </Button>
          </div>
        </ResponsiveDialog>
      )}
      {confirmation && <Confirm {...confirmation} close={() => setConfirmation(undefined)} />}
    </div>
  );
}
function Admin() {
  const query = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => request<(User & { active: boolean })[]>('/admin/users'),
  });
  const [value, setValue] = useState<string>();
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    run: () => Promise<unknown>;
  }>();
  const reset = useMutation({
    mutationFn: (id: string) => request<{ url: string }>(`/admin/users/${id}/reset`, 'POST'),
    onSuccess: (r) => setValue(r.url),
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Gerencie as contas da instalação. As finanças pessoais continuam privadas na aplicação.
      </p>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : (
        query.data.map((u) => (
          <Card key={u.id}>
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {u.name}
                  {u.admin ? ' · Administrador' : ''}
                </p>
                <p className="break-all text-xs text-muted-foreground">{u.email}</p>
              </div>
              <Badge variant="outline">{u.active ? 'Ativo' : 'Desativado'}</Badge>
              <Button
                variant="outline"
                size="sm"
                disabled={reset.isPending}
                onClick={() => reset.mutate(u.id)}
              >
                Redefinir senha
              </Button>
              {!u.admin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setConfirmation({
                      title: u.active ? 'Desativar usuário?' : 'Reativar usuário?',
                      description: u.active
                        ? 'Sessões e chaves serão revogadas. Os dados serão preservados.'
                        : 'O usuário poderá entrar novamente. Chaves revogadas continuarão revogadas.',
                      run: () => request(`/admin/users/${u.id}`, 'PATCH', { active: !u.active }),
                    })
                  }
                >
                  {u.active ? 'Desativar' : 'Reativar'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
      {value && (
        <ShareValue
          value={value}
          title="Redefinição de senha · válida por uma hora"
          close={() => setValue(undefined)}
        />
      )}{' '}
      {confirmation && <Confirm {...confirmation} close={() => setConfirmation(undefined)} />}
    </div>
  );
}
function Audit({ space }: { space: Space }) {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ['audit', space.id, page],
    queryFn: () =>
      request<
        {
          id: string;
          actorId: string;
          operation: string;
          resource: string | null;
          result: string;
          createdAt: string;
        }[]
      >(`/spaces/${space.id}/audit?page=${page}&limit=25`),
  });
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Histórico de operações, sem valores ou descrições financeiras.
      </p>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.operation}</TableCell>
                    <TableCell>
                      {a.resource
                        ? (labels[a.resource as keyof typeof labels] ?? a.resource)
                        : 'Espaço'}
                    </TableCell>
                    <TableCell>{a.result === 'success' ? 'Concluída' : a.result}</TableCell>
                    <TableCell>{new Date(a.createdAt).toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <div className="flex gap-2">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </Button>
        <Button
          variant="outline"
          disabled={(query.data?.length ?? 0) < 25}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
function Password() {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const m = useMutation({
    mutationFn: () => request('/auth/password', 'POST', { currentPassword: current, password }),
    onSuccess: () => {
      window.location.assign('/');
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alterar senha</CardTitle>
        <CardDescription>Ao alterar, suas sessões e API keys serão revogadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="max-w-md space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate();
          }}
        >
          <div>
            <Label htmlFor="current-password">Senha atual</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {m.isError && (
            <p role="alert" className="text-destructive">
              {m.error.message}
            </p>
          )}
          <Button disabled={m.isPending}>Alterar senha</Button>
        </form>
      </CardContent>
    </Card>
  );
}
export function Settings({ space, spaces, user }: { space: Space; spaces: Space[]; user: User }) {
  const [tab, setTab] = useState('categories');
  return (
    <div className="space-y-5">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="keys">API keys</TabsTrigger>
          <TabsTrigger value="groups">Espaços</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
          {space.role === 'owner' && <TabsTrigger value="audit">Histórico</TabsTrigger>}
          {user.admin && <TabsTrigger value="admin">Usuários</TabsTrigger>}
        </TabsList>
      </Tabs>
      {tab === 'categories' ? (
        <Categories space={space} />
      ) : tab === 'keys' ? (
        <Keys spaces={spaces} />
      ) : tab === 'groups' ? (
        <Group space={space} user={user} />
      ) : tab === 'account' ? (
        <Password />
      ) : tab === 'audit' && space.role === 'owner' ? (
        <Audit space={space} />
      ) : tab === 'admin' && user.admin ? (
        <Admin />
      ) : null}
    </div>
  );
}
