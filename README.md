# Finances

Suas finanças, com clareza. Plataforma self hosted para despesas, ganhos, assinaturas, investimentos e caixinhas, com espaços pessoais e grupos compartilhados.

- Interface em português, preparada para celular e desktop, com temas claro e escuro.
- PWA instalável. Consultar e salvar finanças exige conexão; dados financeiros não são guardados offline.
- Categorias com ícones e atalhos para assinaturas comuns.
- Recorrências geram pendentes; você ou seu agente confirma pagamentos e recebimentos.
- Investimentos e metas acompanhados por aportes, resgates e avaliações manuais.
- API keys com permissões por espaço e recurso; API REST e MCP compartilham as mesmas regras.
- Senhas com Argon2id e dados financeiros criptografados com AES-256-GCM.

## Instalar

Requisitos: Docker Compose e um proxy HTTPS. Para gerar a configuração automaticamente, use também Node.js 24.

```sh
node scripts/setup-env.mjs https://finances.seudominio.com
docker compose up -d --build
```

Alternativamente, copie `.env.example` para `.env` e substitua todos os placeholders. Nunca use a chave de exemplo em uma instalação real.

Configure o proxy para encaminhar seu domínio a `127.0.0.1:3000`, preservando o cabeçalho Host. O banco não publica uma porta para a rede. A imagem executa como usuário sem privilégios; migrations são aplicadas antes de iniciar a aplicação.

Abra seu domínio e crie a primeira conta usando o `SETUP_TOKEN` do arquivo `.env`. Essa conta será administradora. Depois disso, o cadastro é público e novas contas são usuários comuns. O token de configuração não permite redefinir o administrador após a instalação.

Guarde um backup do `.env` em local seguro. **Sem as chaves mestras, o banco criptografado não pode ser recuperado.**

## Usar

1. Escolha seu espaço pessoal ou crie um grupo em **Configurações → Espaços**.
2. Cadastre despesas e ganhos. Confirme quando forem pagos ou recebidos.
3. Use **Recorrências** para assinaturas, aluguel e salário. Alterações da série preservam lançamentos confirmados.
4. Em **Investimentos**, crie investimentos ou caixinhas e registre movimentos e valores de fechamento.
5. Crie uma chave em **Configurações → API keys** para conectar agentes. O segredo aparece apenas uma vez.

Para registrar o recebimento ou pagamento de uma recorrência, confirme o item pendente em **Lançamentos**. Criar outro confirmado com a mesma descrição, categoria, valor e data prevista será bloqueado enquanto esse item estiver pendente.

Grupos têm dono, editor e leitor. Cada registro pertence a um espaço. A moeda é definida por espaço e não pode mudar após o primeiro registro financeiro; não há conversão entre moedas. O administrador gerencia contas, mas não recebe acesso automático às finanças de outros usuários na aplicação.

Novos usuários podem se cadastrar em **Criar uma conta** ou em `/register`, sem token após a configuração inicial. Para convidar alguém, abra **Configurações → Espaços → Convidar pessoas**, escolha a permissão e envie o link. O dono pode compartilhar o espaço pessoal atual ou criar um grupo separado. O convite vale por sete dias e uma única aceitação; a pessoa pode criar uma conta pelo próprio link antes de aceitar. Compartilhar um espaço dá acesso a todos os seus registros atuais e futuros.

Investimentos permitem informar produto (CDB, LCI, LCA ou outro), incidência de imposto, imposto sobre o rendimento (%), rentabilidade anual esperada (%) e vencimento. A estimativa aplica juros compostos em dias corridos, com base de 365 dias, a cada aporte a partir da sua data, desconta o imposto informado apenas sobre rendimento positivo e exibe valores bruto, imposto e líquido no vencimento. Avaliações já registradas servem como referência para a projeção; aportes futuros registrados são incluídos. Não há consulta automática de taxas ou tabela tributária. O gráfico mostra pontos a cada sete dias e inclui a data final. Sem taxa e vencimento, a estimativa não é gerada.

Investimentos e seus lançamentos não podem ser excluídos. Aportes, resgates e avaliações também não podem ser editados; o saldo e a data inicial são preservados. Registre novos movimentos compensatórios para corrigir valores. Nome, instituição, metas e parâmetros da estimativa continuam editáveis.

Avaliações de investimentos representam o valor **ao final do dia**, incluindo os movimentos daquela data. Aportes e resgates posteriores ajustam o valor atual. Movimentos de investimentos não geram despesas ou ganhos automaticamente.

Para recuperar uma senha, o administrador pode gerar um link temporário em **Configurações → Usuários**. Alterar ou redefinir a senha revoga as sessões e todas as API keys da conta.

## Desenvolver

Requisitos: Node.js 24 com npm/npx, Make e Docker Compose. Não é necessário instalar pnpm globalmente: o Makefile usa `npx` para executar a versão definida em `package.json` (atualmente 11.19.0). A primeira execução precisa de internet para baixar essa versão e as dependências. Para os exemplos com `pnpm` fora do Makefile, use `npx --yes pnpm@11.19.0 <comando>`.

```sh
make dev
```

O comando cria `.env` de desenvolvimento se ele não existir, instala as dependências, inicia PostgreSQL 17 em um volume separado e inicia frontend e backend juntos, com recarga automática. O backend aplica as migrations durante sua inicialização, antes de atender requisições; uma falha interrompe a inicialização. Um `.env` de desenvolvimento existente é preservado; configurações de produção não são sobrescritas.

```sh
# Opcional: gerar apenas o .env de desenvolvimento.
make dev-env
# Aplicar novamente as migrations.
make dev-migrate
# Gerar uma migration após alterar o schema TypeScript.
make dev-generate
# Parar o banco sem excluir os dados.
make dev-stop
```

Frontend: `http://localhost:5173`. Backend: `http://localhost:3000`. PostgreSQL: `localhost:54329`. Acesse o frontend pelo endereço HTTP; abrir `apps/web/index.html` diretamente não executa a aplicação. Use o `SETUP_TOKEN` do `.env` para criar a primeira conta. `Ctrl+C` encerra frontend e backend; `make dev-stop` para o banco. A PWA é validada no build de produção.

Em desenvolvimento, as origens locais do frontend e backend aceitam `localhost`, `127.0.0.1` e `::1` nas portas configuradas. Para recarga automática da interface, use a porta 5173. Em produção, somente a origem definida em `PUBLIC_URL` é aceita.

Os segredos do `.env` são gerados aleatoriamente e o arquivo fica fora do Git, com acesso restrito ao usuário. Para usar PostgreSQL próprio, ajuste `DATABASE_URL` e execute `pnpm dev`; as migrations são aplicadas automaticamente.

```sh
pnpm generate:client
pnpm db:check
pnpm typecheck
pnpm test
TEST_DATABASE_URL=postgres://usuario:senha@localhost:5432/finances_test pnpm test:integration
pnpm build
```

Os testes de integração **limpam o banco informado** e recusam nomes que não terminem em `_test`. Use um banco exclusivo e vazio. Para testes de navegador, prepare outra instalação exclusiva, inicie o backend compilado com `NODE_ENV=test` e informe `E2E_BASE_URL` e `E2E_SETUP_TOKEN`:

```sh
pnpm exec playwright install chromium
E2E_BASE_URL=http://localhost:3000 E2E_SETUP_TOKEN=token-da-instalacao-de-testes pnpm test:e2e
```

O contrato OpenAPI é gerado dos schemas compartilhados. Não edite `packages/contracts/openapi.json` nem `apps/web/src/lib/api.generated.ts` manualmente. CI valida a geração, tipos, testes, build, navegador e imagem Docker.

O schema do banco é definido em `apps/api/src/schema.ts`, incluindo índices, checks e referências. Após alterá-lo, execute `pnpm db:generate`, revise e versione os arquivos gerados em `apps/api/migrations`, depois execute `pnpm db:migrate`. Drizzle Kit gera SQL, snapshots e journal; o migrador oficial do ORM aplica apenas migrations pendentes. Não edite migrations já aplicadas. O `make dev` e o Docker Compose usam esse mesmo migrador.

As migrations também são aplicadas em cada inicialização do backend, inclusive com `pnpm --filter @finances/api start` ou ao reiniciar o contêiner. A API e o gerador de recorrências só iniciam após a conclusão. Execuções concorrentes usam o bloqueio já existente no PostgreSQL.

Guias: [operação e backups](docs/operations.md), [API e MCP](docs/agents.md), [arquitetura e proteção dos dados](docs/architecture.md) e [validação](docs/validation.md).
