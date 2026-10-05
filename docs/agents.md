# API REST e MCP

Crie uma chave na interface, escolhendo os espaços, recursos e operações. Uma chave não pode conceder acesso maior que o usuário possui. Remoção do grupo, alteração de papel, desativação da conta, expiração e revogação são aplicadas em cada operação.

API: `/api/v1`. Contrato: `/api/v1/openapi.json`.

## REST

Use `Authorization: Bearer <API_KEY>`. Nunca coloque chaves na URL. As chaves financeiras não administram usuários, membros ou outras chaves.

Recursos por espaço: `categories`, `expenses`, `incomes`, `recurrences`, `investments`, `movements` e `valuations`.

```sh
# Defina FINANCES_URL e FINANCES_API_KEY no ambiente do seu agente.
curl "$FINANCES_URL/api/v1/spaces" \
  -H "Authorization: Bearer $FINANCES_API_KEY"

curl "$FINANCES_URL/api/v1/spaces/$SPACE_ID/expenses?from=2026-10-01&to=2026-10-31&page=1&limit=25" \
  -H "Authorization: Bearer $FINANCES_API_KEY"
```

Criação de uma despesa:

```json
{
  "description": "Netflix",
  "amount": "39.90",
  "categoryId": "UUID da categoria deste espaço",
  "dueDate": "2026-10-10",
  "status": "pending",
  "effectiveDate": null,
  "notes": ""
}
```

Valores são strings decimais positivas, datas são `YYYY-MM-DD` e IDs são UUIDs. Valores de saldo inicial e avaliação podem ser zero. Campos inesperados são rejeitados. A moeda e o fuso vêm do espaço.

- `POST /spaces/{spaceId}/{resource}` cria. O cabeçalho `Idempotency-Key` permite repetir a mesma criação sem duplicar. Uma chave reutilizada com conteúdo diferente retorna `409`.
- `GET /spaces/{spaceId}/{resource}` lista com paginação, período e filtros de categoria, investimento e estado.
- `GET /spaces/{spaceId}/{resource}/{id}` consulta um registro e sua versão.
- `PATCH /spaces/{spaceId}/{resource}/{id}` recebe `{ "version": 1, "data": { ...dados completos... } }`.
- `DELETE /spaces/{spaceId}/{resource}/{id}` recebe `{ "version": 1 }`.
- `GET /spaces/{spaceId}/summary?month=2026-10` retorna o resumo permitido pela chave. Campos de recursos sem leitura ficam nulos; resultado líquido exige leitura de despesas e ganhos.
- `GET /spaces/{spaceId}/investments/{id}/report` exige leitura de investimentos, movimentos e avaliações. Retorna `history` semanal, `forecast` semanal e `projection` (vencimento, bruto, rendimento, imposto e líquido). `projection` é nulo sem `expectedAnnualReturn` e `maturityDate`. Os campos `product`, `taxable` e `taxRate` descrevem o produto e o imposto percentual sobre o rendimento, sem tabela tributária automática.

Confirme despesas e ganhos usando `status: "confirmed"` e `effectiveDate`. Para editar uma série, envie também `effectiveFrom` junto com `version` e `data`. Só pendentes serão atualizados, e a data inicial original da série permanece fixa. Pausar impede geração; retomar recupera os períodos ainda não gerados. Excluir uma ocorrência recorrente deixa um marcador para impedir recriação.

Uma avaliação é o fechamento do dia, incluindo os movimentos daquela data. Há uma avaliação por investimento/dia. Movimentos que gerem saldo negativo são rejeitados. Investimentos, movimentos e avaliações não podem ser excluídos (`IMMUTABLE_INVESTMENT_ENTRY`). Movimentos e avaliações também não podem ser alterados. O saldo inicial e a data inicial do investimento são imutáveis (`IMMUTABLE_PRINCIPAL`); correções exigem novos movimentos compensatórios. Lançamentos posteriores ao vencimento não entram na estimativa daquele vencimento.

Erros têm formato `{ "error": { "code": "VERSION_CONFLICT", "message": "..." } }`. Em conflitos de versão, consulte o registro novamente antes de alterar. Não repita automaticamente uma alteração usando uma versão nova sem revisar o conteúdo atual.

## MCP remoto

URL: `https://seu-dominio/mcp`. Transporte: Streamable HTTP sem sessão, com respostas JSON. Envie o Bearer token em toda requisição. O endpoint aceita POST; não usa o transporte SSE legado.

Os clientes precisam permitir configurar o cabeçalho Authorization. OAuth e descoberta OAuth não estão implementados nesta versão.

Ferramentas:

- `list_spaces`, `get_summary`, `get_investment_report`.
- `list_<resource>`, `get_<resource>`, `create_<resource>`, `update_<resource>` e `delete_<resource>` para todos os recursos financeiros.

As ferramentas recebem `spaceId`; operações em um registro também recebem `id`. Criação aceita `idempotencyKey`; alterações e exclusões exigem `version`. Exclusões têm indicação `destructiveHint`. As permissões são verificadas pelo servidor independentemente dessas indicações.

## MCP stdio

Depois de `pnpm build`, configure seu cliente local:

```json
{
  "mcpServers": {
    "finances": {
      "command": "node",
      "args": ["/caminho/finances/apps/mcp/dist/main.js"],
      "env": {
        "FINANCES_URL": "https://finances.seudominio.com",
        "FINANCES_API_KEY": "sua-chave"
      }
    }
  }
}
```

O adaptador encaminha as ferramentas ao mesmo MCP remoto e aplica suas regras de autorização. Não escreve mensagens de aplicação em stdout, reservado ao protocolo. Guarde a configuração do cliente com acesso restrito.
