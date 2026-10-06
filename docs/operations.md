# Operar o Finances

## HTTPS

Use seu proxy existente e mantenha `PUBLIC_URL` igual à origem acessada no navegador, sem caminho adicional. Exemplo com Caddy instalado no host:

```caddyfile
finances.seudominio.com {
    reverse_proxy 127.0.0.1:3000
}
```

Preserve Host, origem e cabeçalhos de autenticação. O MCP remoto valida o Host e, quando presente, Origin. O backend não confia em `X-Forwarded-For` arbitrário: o limitador utiliza o endereço conectado ao backend. Se o proxy reunir usuários em um único endereço, esse limite será compartilhado.

Produção exige HTTPS. Para avaliação restrita ao localhost, use `NODE_ENV=development` e `PUBLIC_URL=http://localhost:3000`. Não exponha essa configuração à internet.

## Backup

O backup completo inclui o banco **e** uma cópia separada e protegida das chaves presentes em `MASTER_KEYS`, da versão ativa e da configuração. Tokens de API, sessões e convites ficam no banco somente como hashes; senhas usam Argon2id.

```sh
docker compose exec -T db pg_dump -U finances -d finances -Fc > finances.dump
```

Guarde o dump e as chaves em locais com acesso restrito. Não armazene as chaves apenas no mesmo local do dump. Evite registrar `.env` em Git ou incluir segredos em imagens.

## Restaurar

A restauração abaixo substitui os dados da instalação de destino. Use uma instalação exclusiva ou faça backup do destino antes.

1. Prepare `.env` com as chaves que criptografaram o backup.
2. Inicie somente o banco e aguarde sua disponibilidade.
3. Restaure o dump e inicie a aplicação; as migrations são aplicadas durante a inicialização.

```sh
docker compose stop app
docker compose up -d db
# Aguarde o healthcheck do banco ficar saudável.
docker compose exec -T db pg_restore -U finances -d finances --clean --if-exists --no-owner < finances.dump
docker compose up -d app
```

Confirme `/health/ready`, entre com uma conta do backup e consulte lançamentos e investimentos. O estado da primeira configuração é restaurado com o banco; não há criação de um novo administrador durante a restauração.

Para backups anteriores à adoção do Drizzle, use um banco de destino vazio. `pg_restore --clean` remove apenas os objetos presentes no dump; ele não remove o histórico Drizzle de um destino já atualizado. O migrador rejeita a coexistência dos dois históricos para impedir que migrations necessárias sejam ignoradas.

## Atualizar

Faça backup antes. Preserve volumes e `.env`; nunca use `docker compose down -v` para atualizar.

```sh
docker compose stop app
docker compose build
docker compose up -d app
```

A PWA informa quando uma nova versão está disponível. Salve os formulários antes de atualizar. O navegador armazena apenas arquivos estáticos, não respostas financeiras.

## Rotacionar a chave mestra

1. Faça backup do banco e das chaves atuais.
2. Gere uma nova chave de 32 bytes e acrescente uma nova versão a `MASTER_KEYS`, preservando a anterior. Defina `ACTIVE_MASTER_KEY` para a nova versão.
3. Pare a aplicação e reempacote as chaves dos espaços com o comando abaixo.
4. Recrie a aplicação usando a nova configuração.

```sh
docker compose stop app
docker compose run --rm --no-deps app node dist/rotate-keys.js
docker compose up -d --force-recreate app
```

A operação é transacional e não altera os valores financeiros criptografados. As chaves antigas continuam necessárias para backups anteriores; não as destrua. Não troque apenas o valor de uma versão existente: cada versão identifica uma chave imutável.

## Diagnóstico

```sh
docker compose ps
docker compose logs app
```

`/health/live` indica que o processo responde. `/health/ready` verifica o acesso ao banco e ao esquema inicial. O gerador de recorrências roda na inicialização e a cada minuto, recuperando períodos não processados e usando bloqueio no PostgreSQL para evitar concorrência entre processos.

O backend aplica migrations pendentes a cada inicialização, antes de abrir a porta HTTP ou iniciar o gerador de recorrências. Falhas impedem a inicialização, inclusive em desenvolvimento e ao reiniciar o contêiner. Para aplicar migrations manualmente sem iniciar o servidor, use `pnpm db:migrate` ou `docker compose run --rm migrate`; o serviço de manutenção não roda no fluxo normal do Compose.

Falhas de geração aparecem nos logs sem incluir valores ou descrições. Corrija a causa e reinicie a aplicação para uma nova tentativa. Migrações concluídas ficam registradas em `drizzle.__drizzle_migrations`, com hash e identificador temporal. Uma migration aplicada e depois editada impede a atualização; restaure o arquivo original e gere uma nova migration para mudanças adicionais.

Na primeira atualização de uma instalação que usava `0001_initial.sql`, o migrador reconhece e valida o schema legado antes de adotar o histórico Drizzle. Não recria tabelas nem redefine a conta administradora. Faça o backup usual antes de atualizar. Se o histórico ou o schema tiverem alterações manuais incompatíveis, a adoção é interrompida para revisão.
