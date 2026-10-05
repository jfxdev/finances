import { useEffect, useState, lazy, Suspense } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Repeat,
  ChartNoAxesCombined,
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
  Download,
  RefreshCw,
  Menu,
  ChevronRight,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';
import type { Space } from '@finances/contracts';
import {
  request,
  setCsrf,
  spaces as getSpaces,
  localDate,
  type Session,
  ApiError,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MonthPicker } from '@/components/date-picker';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useRegisterSW } from 'virtual:pwa-register/react';
const Dashboard = lazy(() =>
  import('./components/financial-pages').then((m) => ({ default: m.Dashboard })),
);
const Transactions = lazy(() =>
  import('./components/financial-pages').then((m) => ({ default: m.Transactions })),
);
const Recurrences = lazy(() =>
  import('./components/financial-pages').then((m) => ({ default: m.Recurrences })),
);
const Investments = lazy(() =>
  import('./components/financial-pages').then((m) => ({ default: m.Investments })),
);
const Settings = lazy(() => import('./components/settings').then((m) => ({ default: m.Settings })));
import { Loading, ErrorState } from './components/common';
import { toast } from 'sonner';
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <ChartNoAxesCombined className="size-5" />
      </span>
      <span className="text-xl font-semibold tracking-tight">
        finances<span className="text-primary">.</span>
      </span>
    </div>
  );
}
function AuthPage({
  onSession,
  reset = false,
  invited = false,
}: {
  onSession: (s: Session) => void;
  reset?: boolean;
  invited?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const setup = useQuery({
    queryKey: ['setup'],
    queryFn: () => request<{ configured: boolean }>('/auth/setup'),
    enabled: !reset,
  });
  const [inviteRegistration, setInviteRegistration] = useState(true);
  const register = invited ? inviteRegistration : location.pathname === '/register';
  const initial = setup.data?.configured === false;
  const form = useForm<{ email: string; name: string; password: string; setupToken: string }>({
    defaultValues: { email: '', name: '', password: '', setupToken: '' },
  });
  const [resetDone, setResetDone] = useState(false);
  const m = useMutation({
    mutationFn: async (d: { email: string; name: string; password: string; setupToken: string }) =>
      reset
        ? request('/auth/reset', 'POST', {
            token: window.location.hash.slice(1),
            password: d.password,
          })
        : request<Session>(
            initial || register ? '/auth/register' : '/auth/login',
            'POST',
            initial || register
              ? {
                  email: d.email,
                  name: d.name,
                  password: d.password,
                  ...(initial ? { setupToken: d.setupToken } : {}),
                }
              : { email: d.email, password: d.password },
          ),
    onSuccess: (r) => {
      if (reset) {
        setResetDone(true);
        history.replaceState(null, '', '/reset');
      } else {
        onSession(r as Session);
        if (!invited) navigate('/', { replace: true });
      }
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-[#142a22] p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <ChartNoAxesCombined className="size-6 text-[#b5e6c7]" />
          finances.
        </div>
        <div className="max-w-lg">
          <span className="mb-6 inline-block rounded-full border border-white/20 px-3 py-1 text-xs text-[#b5e6c7]">
            SEU DINHEIRO, COM CLAREZA
          </span>
          <h1 className="text-5xl font-medium leading-tight tracking-tight">
            Mais consciência.
            <br />
            Mais possibilidades.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/65">
            Cuide do presente, organize suas assinaturas e acompanhe o caminho até seus objetivos.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {['Despesas', 'Ganhos', 'Objetivos'].map((t, i) => (
              <div key={t} className="rounded-2xl border border-white/15 p-4">
                <span className="text-sm text-[#b5e6c7]">0{i + 1}</span>
                <p className="mt-4 text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40">Seus dados na sua própria instalação.</p>
      </section>
      <section className="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {reset
              ? 'Uma nova senha'
              : initial
                ? 'Vamos começar'
                : register
                  ? 'Crie sua conta'
                  : 'Bem-vindo de volta'}
          </h1>
          <p className="mb-8 mt-3 text-sm text-muted-foreground">
            {reset
              ? 'Use uma senha com pelo menos 12 caracteres.'
              : initial
                ? 'Configure o administrador da sua instalação.'
                : register
                  ? 'Um espaço pessoal para suas finanças.'
                  : 'Entre para acompanhar suas finanças.'}
          </p>
          {invited && (
            <p className="mb-6 rounded-lg border bg-card p-4 text-sm">
              Você recebeu um convite para compartilhar um espaço. Crie sua conta ou entre para
              aceitar o convite.
            </p>
          )}
          {!reset && setup.isPending ? (
            <Loading />
          ) : !reset && setup.isError ? (
            <ErrorState error={setup.error} retry={() => void setup.refetch()} />
          ) : resetDone ? (
            <Card>
              <CardContent className="space-y-4 pt-6">
                <p>Senha atualizada. Entre novamente com a nova senha.</p>
                <Button asChild>
                  <Link to="/">Entrar</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form className="space-y-5" onSubmit={form.handleSubmit((d) => m.mutate(d))}>
              {!reset && (initial || register) && (
                <div>
                  <Label htmlFor="name">Seu nome</Label>
                  <Input
                    id="name"
                    className="mt-2 min-h-11"
                    required
                    maxLength={160}
                    autoComplete="name"
                    {...form.register('name')}
                  />
                </div>
              )}
              {!reset && (
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className="mt-2 min-h-11"
                    type="email"
                    required
                    autoComplete="email"
                    {...form.register('email')}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="password">{reset ? 'Nova senha' : 'Senha'}</Label>
                <Input
                  id="password"
                  className="mt-2 min-h-11"
                  type="password"
                  required
                  minLength={reset || initial || register ? 12 : 1}
                  maxLength={128}
                  autoComplete={initial || register || reset ? 'new-password' : 'current-password'}
                  {...form.register('password')}
                />
                {(reset || initial || register) && (
                  <p className="mt-2 text-xs text-muted-foreground">Pelo menos 12 caracteres.</p>
                )}
              </div>
              {initial && !reset && (
                <div>
                  <Label htmlFor="setup-token">Token de configuração</Label>
                  <Input
                    id="setup-token"
                    className="mt-2 min-h-11"
                    type="password"
                    required
                    {...form.register('setupToken')}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Configurado pelo operador ao instalar o app.
                  </p>
                </div>
              )}
              {m.isError && (
                <p role="alert" className="text-sm text-destructive">
                  {m.error.message}
                </p>
              )}
              <Button className="min-h-11 w-full" disabled={m.isPending}>
                {m.isPending
                  ? 'Aguarde…'
                  : reset
                    ? 'Atualizar senha'
                    : initial
                      ? 'Configurar instalação'
                      : register
                        ? 'Criar conta'
                        : 'Entrar'}
                <ArrowUpRight className="size-4" />
              </Button>
              {!reset && !initial && (
                <Button
                  className="w-full"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (invited) setInviteRegistration((v) => !v);
                    else navigate(register ? '/' : '/register');
                    m.reset();
                  }}
                >
                  {register ? 'Já tenho uma conta' : 'Criar uma conta'}
                </Button>
              )}
              {!reset && !initial && !register && (
                <p className="text-center text-xs text-muted-foreground">
                  Esqueceu a senha? Solicite um link ao administrador.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
const nav = [
  { path: '/', label: 'Visão geral', icon: LayoutDashboard },
  { path: '/transactions', label: 'Lançamentos', icon: ArrowLeftRight },
  { path: '/recurrences', label: 'Recorrências', icon: Repeat },
  { path: '/investments', label: 'Investimentos', icon: ChartNoAxesCombined },
  { path: '/settings', label: 'Configurações', icon: SettingsIcon },
];
function NavigationLinks({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      {nav.map((n) => (
        <SidebarMenuItem key={n.path}>
          <SidebarMenuButton asChild isActive={pathname === n.path} className="h-11">
            <Link to={n.path} onClick={() => setOpenMobile(false)}>
              <n.icon className="size-4" />
              <span>{n.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
function Invite({ onAccepted }: { onAccepted: (spaceId: string) => void }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const m = useMutation({
    mutationFn: () =>
      request<{ spaceId: string }>('/invites/accept', 'POST', {
        token: window.location.hash.slice(1),
      }),
    onSuccess: (r) => {
      onAccepted(r.spaceId);
      void qc.invalidateQueries({ queryKey: ['spaces'] });
      toast.success('Convite aceito');
      navigate('/', { replace: true });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Participar de um grupo</CardTitle>
        <CardDescription>
          Ao aceitar, você poderá acessar o espaço compartilhado conforme a permissão do convite.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {m.isError && (
          <p role="alert" className="text-destructive">
            {m.error.message}
          </p>
        )}
        <Button disabled={m.isPending} onClick={() => m.mutate()}>
          Aceitar convite
        </Button>
        <Button asChild variant="ghost">
          <Link to="/">Voltar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
export default function App() {
  const qc = useQueryClient();
  const location = useLocation();
  const reset = location.pathname === '/reset';
  const session = useQuery({
    queryKey: ['session'],
    queryFn: () => request<Session>('/auth/me'),
    retry: false,
    enabled: !reset,
  });
  const spaces = useQuery({
    queryKey: ['spaces'],
    queryFn: getSpaces,
    enabled: !!session.data && !reset,
  });
  const [selected, setSelected] = useState(() => localStorage.getItem('finances-space') ?? '');
  const [month, setMonth] = useState(localDate().slice(0, 7));
  const [online, setOnline] = useState(navigator.onLine);
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  const [install, setInstall] = useState<InstallEvent>();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  useEffect(() => {
    setCsrf(session.data?.csrf ?? '');
  }, [session.data]);
  useEffect(() => {
    const on = () => setOnline(true),
      off = () => setOnline(false),
      prompt = (e: Event) => {
        e.preventDefault();
        setInstall(e as InstallEvent);
      };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    window.addEventListener('beforeinstallprompt', prompt);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener('beforeinstallprompt', prompt);
    };
  }, []);
  const logout = useMutation({
    mutationFn: () => request('/auth/logout', 'POST'),
    onSuccess: () => {
      setCsrf('');
      qc.clear();
      history.replaceState(null, '', '/');
      window.location.reload();
    },
    onError: (e) => toast.error(e.message),
  });
  function setSession(s: Session) {
    setCsrf(s.csrf);
    qc.setQueryData(['session'], s);
    void qc.invalidateQueries({ queryKey: ['spaces'] });
  }
  if (reset) return <AuthPage reset onSession={setSession} />;
  if (!online)
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <Brand />
        <h1 className="text-2xl font-semibold">Você está sem conexão</h1>
        <p className="max-w-sm text-muted-foreground">
          Conecte-se à internet para consultar e salvar suas finanças.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </main>
    );
  if (session.isPending) return <Loading />;
  if (session.isError) {
    if (session.error instanceof ApiError && session.error.status === 401)
      return <AuthPage invited={location.pathname === '/invite'} onSession={setSession} />;
    return <ErrorState error={session.error} retry={() => void session.refetch()} />;
  }
  if (spaces.isPending) return <Loading />;
  if (spaces.isError)
    return <ErrorState error={spaces.error} retry={() => void spaces.refetch()} />;
  const space = spaces.data?.find((s) => s.id === selected) ?? spaces.data?.[0];
  if (!space) return <p>Nenhum espaço disponível.</p>;
  const current = nav.find((n) => n.path === location.pathname) ?? nav[0];
  function selectSpace(id: string) {
    setSelected(id);
    localStorage.setItem('finances-space', id);
    qc.removeQueries({
      predicate: (q) => !['session', 'spaces', 'keys'].includes(String(q.queryKey[0])),
    });
  }
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-5 py-7">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <ChartNoAxesCombined className="size-6 text-[#b5e6c7]" />
            finances.
          </div>
          <p className="mt-1 text-xs text-sidebar-foreground/60">Seu dinheiro, com clareza.</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <NavigationLinks pathname={location.pathname} />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-4 px-5 pb-6">
          <div className="rounded-xl border border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60">Um passo de cada vez</p>
            <p className="mt-2 text-sm">
              Organize hoje.
              <br />
              Construa o amanhã.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
              {session.data.user.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{session.data.user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {session.data.user.email}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Sair da conta"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger aria-label="Abrir navegação" />
            <span className="hidden text-xs text-muted-foreground sm:block">Meu espaço</span>
            <ChevronRight className="hidden size-3 text-muted-foreground sm:block" />
            <Select value={space.id} onValueChange={selectSpace}>
              <SelectTrigger
                aria-label="Espaço atual"
                className="max-w-[180px] border-0 bg-transparent shadow-none sm:max-w-[240px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spaces.data?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · {s.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {install && (
              <Button
                size="icon"
                variant="ghost"
                aria-label="Instalar aplicativo"
                onClick={() => void install.prompt().then(() => setInstall(undefined))}
              >
                <Download className="size-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
              onClick={() => setTheme(dark ? 'light' : 'dark')}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button
              size="icon"
              className="md:hidden"
              variant="ghost"
              aria-label="Sair da conta"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        {needRefresh && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-2 border-b bg-secondary px-4 py-3 text-sm"
          >
            <span>Uma nova versão está disponível. Salve suas alterações antes de atualizar.</span>
            <Button size="sm" variant="outline" onClick={() => void updateServiceWorker(true)}>
              <RefreshCw className="size-3" />
              Atualizar
            </Button>
          </div>
        )}
        <section
          aria-label={current.label}
          className="mx-auto w-full max-w-[1480px] space-y-6 p-4 safe-bottom sm:p-7 lg:p-9"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[.16em] text-muted-foreground">
                {space.name}
                {space.role === 'reader' ? ' · Somente leitura' : ''}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {location.pathname === '/invite' ? 'Convite' : current.label}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {location.pathname === '/'
                  ? 'Tudo o que importa para acompanhar seu mês.'
                  : location.pathname === '/transactions'
                    ? 'Cada lançamento ajuda a enxergar o todo.'
                    : location.pathname === '/recurrences'
                      ? 'Mais previsibilidade para sua rotina.'
                      : location.pathname === '/investments'
                        ? 'Acompanhe o caminho até seus objetivos.'
                        : 'Seu espaço, suas preferências.'}
              </p>
            </div>
            {location.pathname === '/transactions' ? (
              <MonthPicker value={month} onChange={setMonth} />
            ) : location.pathname === '/' ? (
              <Input
                type="month"
                aria-label="Mês de referência"
                value={month}
                className="w-[165px] bg-card"
                onChange={(e) => {
                  if (e.target.value) setMonth(e.target.value);
                }}
              />
            ) : null}
          </div>
          <Suspense fallback={<Loading />}>
            <div key={`${space.id}:${location.pathname}`}>
              {location.pathname === '/invite' ? (
                <Invite onAccepted={selectSpace} />
              ) : location.pathname === '/transactions' ? (
                <Transactions space={space} month={month} />
              ) : location.pathname === '/recurrences' ? (
                <Recurrences space={space} />
              ) : location.pathname === '/investments' ? (
                <Investments space={space} />
              ) : location.pathname === '/settings' ? (
                <Settings space={space} spaces={spaces.data!} user={session.data.user} />
              ) : (
                <Dashboard space={space} month={month} />
              )}
            </div>
          </Suspense>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
