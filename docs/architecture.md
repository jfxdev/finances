# Arquitetura

- `apps/web`: React/Vite, shadcn/ui oficial, React Hook Form, Zod, TanStack Query/Table e gráficos Recharts via Chart do shadcn.
- `apps/api`: Fastify, autenticação, autorização, serviços financeiros e MCP Streamable HTTP.
- `apps/mcp`: ponte stdio para o MCP remoto.
- `packages/contracts`: schemas Zod, tipos e OpenAPI gerado.

## Modelo de dados

O schema TypeScript em `apps/api/src/schema.ts` é a fonte de verdade do banco. Drizzle ORM realiza as consultas e Drizzle Kit gera migrations versionadas, snapshots e journal. Os arquivos SQL em `apps/api/migrations` são artefatos gerados do schema, conforme o [fluxo de migrations do Drizzle](https://orm.drizzle.team/docs/migrations).

Usuários, sessões, chaves, espaços, membros, convites, redefinições, auditoria e idempotência possuem tabelas próprias. Registros financeiros usam uma tabela compartilhada, com tipo de recurso, versão, metadados indexáveis e payload criptografado. Essa representação permite aplicar o mesmo isolamento, criptografia e controle de versão a todos os recursos.

O banco impõe referências compostas `(space_id, id)` para categorias, investimentos e recorrências. A camada de serviços também valida o tipo de cada referência, o estado de categorias e as permissões. O banco garante apenas um dono por espaço e apenas uma ocorrência por recorrência/data.

O migrador oficial registra o histórico em `drizzle.__drizzle_migrations`. Um bloqueio no PostgreSQL serializa executores concorrentes; hashes detectam alterações em arquivos já aplicados. A primeira configuração é inicializada pelo ORM sem sobrescrever o estado existente.

O ponto de entrada do backend aguarda as migrations antes de criar o servidor, verificar as chaves dos espaços e abrir a porta HTTP. O gerador de recorrências inicia somente depois disso. Falhas de migrations encerram o processo; os comandos de desenvolvimento e o contêiner seguem o mesmo fluxo.

Instalações anteriores com `0001_initial.sql` são reconhecidas pelo histórico legado e conferidas contra o snapshot inicial. A adoção registra a migration equivalente no histórico Drizzle e remove somente a tabela antiga de controle. Contas, sessões, membros e dados financeiros permanecem intactos. Históricos desconhecidos e schemas divergentes interrompem a atualização.

Exclusões financeiras são lógicas e não aparecem em consultas nem resumos. Isso mantém referências históricas, auditoria e marcadores de ocorrências. Excluir categoria em uso a arquiva; lançamentos existentes continuam editáveis na categoria, mas novos lançamentos não podem escolhê-la.

## Criptografia

Cada espaço tem uma chave aleatória de 32 bytes. A chave mestra, fornecida pelo operador e identificada por versão, protege a chave do espaço. Títulos de espaços e payloads financeiros usam AES-256-GCM, nonce aleatório de 96 bits e tag de autenticação.

O contexto autenticado inclui espaço, recurso e ID do registro; mover um ciphertext entre registros falha. Rotação da chave mestra reempacota as chaves dos espaços em uma transação. Uma alteração de senha não muda nem perde a chave do espaço.

Permanecem em claro: identidades de login e perfil, IDs, membros/papéis, moeda, fuso, tipos, datas, estados, versões e metadados operacionais. Valores, descrições, observações, categorias, nomes de investimentos e metas ficam criptografados. Os índices permitem selecionar um período antes de descriptografar e agregar no backend. Gráficos usam números apenas para desenho; cálculos monetários usam inteiros `bigint` na escala da moeda.

Essa proteção impede leitura financeira de um dump isolado. Não protege contra um operador que controla o processo e suas chaves, nem contra comprometimento do servidor em execução. Permissões da aplicação restringem o acesso do administrador pela interface/API/MCP.

## Consistência e agentes

Mutações bloqueiam o espaço durante a transação para serializar referências e cálculos relacionados. Leituras autorizam o usuário e sua participação; chaves têm suas permissões atuais verificadas. Versões detectam alterações concorrentes. Idempotência é vinculada ao usuário, à chave e ao conteúdo da criação.

Recorrências mantêm revisões da série, dia original e cursor de geração. Edições recompõem pendentes a partir da data escolhida; ocorrências confirmadas e canceladas preservam seus dados. O gerador usa bloqueio transacional global e unicidade no banco.

Não há Redis nem fila externa na primeira versão. A frequência de processamento é de um minuto. Uma criação de recorrência já gera os primeiros pendentes na própria transação.

## Limites da primeira versão

Cadastro público após configuração inicial. Não há OAuth, SMTP, integração bancária, cotações automáticas, conversão cambial, lançamentos offline, cálculo anualizado de rentabilidade ou divisão de dívidas entre membros. Grupos compartilham os registros completos do espaço.

Recorrências aceitam início nos últimos dez anos, para limitar recuperação histórica. Avaliações representam fechamento diário. A chave mestra não pode ser recuperada por senha ou pelo token de configuração.
