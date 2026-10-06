# Validação da primeira versão

Verificações locais concluídas em 1 de outubro de 2026, com bancos e contas descartáveis. A configuração de exemplo não foi usada para publicar uma instalação real.

| Verificação                               | Resultado                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Contratos OpenAPI e cliente gerado        | Geração concluída                                                          |
| TypeScript e build de todas as aplicações | Aprovados                                                                  |
| Domínio                                   | 11 testes aprovados                                                        |
| Integração com PostgreSQL 17              | 35 testes aprovados, incluindo 13 de migrations                            |
| Navegador Chromium                        | Fluxo aprovado no desktop e em tela de 360 px                              |
| MCP remoto e adaptador stdio              | 38 ferramentas, CRUD, restrições e revogação aprovados com clientes do SDK |
| Docker Compose                            | Build, migrations, instalação limpa e healthchecks aprovados               |
| Backup e restauração                      | Login, despesa, resumo e investimento recuperados e descriptografados      |
| Rotação de chave mestra                   | Comando executado na instalação descartável; dados continuaram acessíveis  |
| Atualização da PWA                        | Nova versão detectada; atualização aplicada preservando a sessão           |

Os testes de domínio incluem representação monetária exata, moedas com diferentes escalas, meses curtos, ano bissexto, intervalos, fuso, investimentos e adulteração do conteúdo criptografado. A integração cobre cadastro inicial concorrente, isolamento, papéis, referências cruzadas, CSRF, idempotência, conflitos, chaves, convites, recorrências concorrentes, cancelamentos, categorias arquivadas, investimentos, recuperação de senha e desativação.

Os fluxos de navegador cobrem cadastro, criação e confirmação de despesa, edição, recorrência, aporte, criação e revogação de chave, temas, layout sem rolagem horizontal, manifesto, service worker, consulta ao cache, abertura offline e reconexão. Nenhuma resposta da API ou MCP foi encontrada no cache. A atualização foi verificada alterando o service worker somente dentro do contêiner descartável.

O backup foi restaurado com `pg_restore`, seguido de migrations e reinício. A rotação foi executada com a aplicação parada, preservando a chave anterior. Ambas as operações foram seguidas de login e consultas com conferência dos valores esperados.

A inicialização automática também foi validada em processos reais do backend: migrations antes da primeira resposta HTTP, reinício sem duplicações, resolução da pasta de migrations a partir de outro diretório e encerramento sem abrir a API quando uma migration falha.

A transição para migrations Drizzle foi validada em bancos novos e legados: instalação concorrente, reaplicação, equivalência de colunas/restrições/índices, preservação de contas/sessões/ciphertexts, consulta autorizada após atualização, migrations futuras, rollback, detecção de arquivos alterados e rejeição de schemas ou históricos incompatíveis, incluindo restaurações com históricos misturados.

O desenvolvimento aceita as origens locais do frontend e backend somente nas portas configuradas; origens externas e outras portas continuam bloqueadas. Testes de integração verificam também que produção exige a origem pública exata e que CSRF permanece obrigatório. O Makefile foi executado com um PATH sem pnpm global; npx forneceu a versão do projeto e executou os scripts das aplicações.

Capturas dos testes com dados sintéticos: [desktop](screenshots/desktop.png) e [celular](screenshots/mobile.png).

O workflow de CI está incluído; esta validação corresponde à execução local, não a uma execução publicada no GitHub. A instalação pelo menu do sistema e particularidades do Safari/iOS devem ser conferidas no ambiente de destino. Configure HTTPS e chaves próprias conforme o [guia de operação](operations.md).
