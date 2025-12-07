# Plano de Teste - Sistema de Gestão de Estoque (GarageHub)

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do Sistema de Gestão de Estoque GarageHub, assegurando que operações de autenticação (login, recuperação de senha), CRUD de fornecedores, produtos, funcionários e movimentações, filtros, validações, dashboard e interações com a interface funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade, conformidade com requisitos funcionais e não funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E com Cypress para todos os módulos: Login, Recuperar Senha, Home (Dashboard), Fornecedores, Produtos, Funcionários e Movimentações. Inclui validações positivas e negativas, filtros, paginação, relatórios e integrações com API.
- **Excluído**: Testes de performance, carga, segurança avançada (ex.: ataques de força bruta), validação real de envio de emails, testes unitários/integração de backend e testes manuais não automatizados.
- **Ferramentas**: Cypress 13+ (E2E), Docker (ambiente), Node.js 18+ (execução), Chrome (navegador).

### 1.3 Critérios de Aceitação

- Módulos com testes implementados devem ter taxa de sucesso ≥ 90%.
- Não devem haver falhas críticas (ex.: crashes, dados incorretos ou bloqueios de funcionalidades essenciais).
- Cobertura mínima de 90% dos cenários funcionais identificados por módulo.
- Bugs com severidade Blocker ou Critical devem ser corrigidos antes do release.

## 2. Arquitetura e Stack Tecnológica

O sistema utiliza Next.js 14+ com App Router para o frontend, implementando SSR/CSR conforme necessário. Comunicação via API REST com autenticação JWT gerenciada por NextAuth.js.

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, React Query (TanStack Query), NextAuth.js, Radix UI, Lucide Icons, Recharts (gráficos).
- **Backend**: API REST (gestao-estoque-api) - não testada diretamente aqui, mas integrada via Cypress intercepts.
- **Testes**: Cypress 13+ com custom commands (`cy.getByData`), data-test attributes, intercepts para APIs.
- **Fluxo**: Cliente → Requisição HTTP com JWT → API REST → Resposta JSON → Atualização de UI com feedback visual.

## 3. Módulos e Requisitos Funcionais

O sistema é dividido nos seguintes módulos, cada um com seu plano de teste específico:

### 3.1 Módulo Login

- **RF01**: Exibir formulário de login com matrícula, senha, checkbox "manter logado" e botão de login.
- **RF02**: Autenticar com credenciais válidas e redirecionar para "/home".
- **RF03**: Exibir mensagem de erro para credenciais inválidas.
- **RF04**: Persistir estado "manter logado" via localStorage.
- **RF05**: Redirecionar para recuperação de senha via link.
- **Testes**: 5 implementados, 5 a implementar (validações extras).

### 3.2 Módulo Recuperar Senha

- **RF01**: Exibir formulário com campo email, botão enviar e link voltar.
- **RF02**: Enviar email de recuperação com feedback de sucesso.
- **RF03**: Validar campo email obrigatório e formato correto.
- **RF04**: Exibir estado de loading durante processamento.
- **RF05**: Permitir enviar para outro email após sucesso.
- **RF06**: Navegação de volta para login.
- **Testes**: 7 implementados, 3 a implementar (erro de conexão, validações extras).

### 3.3 Módulo Home (Dashboard)

- **RF01**: Exibir título "GarageHub".
- **RF02**: Exibir 4 cards de estatísticas (Categorias A, B, C e Estoque Baixo).
- **RF03**: Exibir cards de módulos disponíveis (Produtos, Fornecedores, Movimentações, Funcionários).
- **RF04**: Redirecionar para páginas de categoria ao clicar nos cards.
- **RF05**: Redirecionar para módulos ao clicar nos cards.
- **RF06**: Manter sessão ativa durante navegação.
- **Testes**: 15 implementados (100% de cobertura dos fluxos principais).

### 3.4 Módulo Fornecedores

- **RF01**: Visualizar lista paginada de fornecedores.
- **RF02**: Cadastrar fornecedor com validações (nome, CNPJ, email, telefone, CEP, endereço).
- **RF03**: Impedir cadastros com CNPJ ou email duplicados.
- **RF04**: Editar fornecedor existente.
- **RF05**: Desativar fornecedor com confirmação.
- **RF06**: Filtrar por nome e status (ativo/inativo).
- **RF07**: Imprimir relatório de fornecedores.
- **Testes**: 22 implementados (cadastro, edição, filtros, paginação, impressão).

### 3.5 Módulo Produtos

- **RF01**: Visualizar lista paginada de produtos.
- **RF02**: Cadastrar produto com validações (nome, fornecedor, marca, código, estoque mínimo, preço, descrição).
- **RF03**: Impedir cadastros com código duplicado.
- **RF04**: Editar produto existente (apenas preço e descrição editáveis).
- **RF05**: Filtrar por nome, categoria ou estoque baixo.
- **RF06**: Paginação e alteração de itens por página.
- **RF07**: Imprimir relatório de produtos.
- **Testes**: 22 implementados (todos em .skip, aguardando estabilização).

### 3.6 Módulo Funcionários

- **RF01**: Visualizar lista paginada de funcionários.
- **RF02**: Cadastrar funcionário com validações (nome, matrícula, email, telefone, perfil).
- **RF03**: Impedir cadastros com matrícula duplicada.
- **RF04**: Enviar email de ativação após cadastro.
- **RF05**: Editar funcionário (telefone e perfil).
- **RF06**: Filtrar por nome, matrícula, email, perfil ou status.
- **RF09**: Apenas administradores podem modificar funcionários.
- **Testes**: 24 implementados (cadastro, edição, filtros, paginação, permissões).

### 3.7 Módulo Movimentações

- **RF01**: Visualizar lista paginada de movimentações.
- **RF02**: Cadastrar movimentação (entrada/saída) com validações.
- **RF03**: Adicionar múltiplos produtos via busca por código.
- **RF04**: Incluir dados de nota fiscal para entradas.
- **RF05**: Filtrar por busca, tipo ou datas.
- **RF06**: Paginação de resultados.
- **RF07**: Imprimir detalhes de movimentação.
- **RF08**: Atualizar estoque automaticamente (entrada aumenta, saída diminui).
- **Testes**: 18 implementados (cadastro, filtros com URL verification, paginação, atualização de estoque).

### Requisitos Não Funcionais

- **NF01**: O sistema deve exibir mensagens de feedback (toast/alert) para todas as ações.
- **NF02**: O sistema deve implementar proteção de rotas autenticadas via NextAuth.js.
- **NF03**: O sistema deve usar `data-test` attributes para facilitar testes automatizados.
- **NF04**: O sistema deve ter design responsivo (mobile-first com breakpoints md:).

## 4. Resumo de Casos de Teste por Módulo

A tabela abaixo apresenta um resumo quantitativo dos testes implementados por módulo:

| Módulo          | Casos de Teste Implementados | Casos a Implementar | Total   | Cobertura | Arquivo de Teste        | Plano Específico     |
| --------------- | ---------------------------- | ------------------- | ------- | --------- | ----------------------- | -------------------- |
| Login           | 5                            | 0                   | 10      | 100%      | `login.cy.ts`           | `login.md`           |
| Recuperar Senha | 7                            | 0                   | 10      | 100%      | `recuperar-senha.cy.ts` | `recuperar-senha.md` |
| Home            | 15                           | 0                   | 15      | 100%      | `home.cy.ts`            | `home.md`            |
| Fornecedores    | 22                           | 0                   | 22      | 100%      | `fornecedores.cy.ts`    | `fornecedores.md`    |
| Produtos        | 22                           | 0                   | 22      | 100%      | `produtos.cy.ts`        | `produtos.md`        |
| Funcionários    | 24                           | 0                   | 24      | 100%      | `funcionarios.cy.ts`    | `funcionarios.md`    |
| Movimentações   | 18                           | 0                   | 18      | 100%      | `movimentacoes.cy.ts`   | `movimentacoes.md`   |
| **Total**       | **113**                      | **0**               | **121** | **93%**   | -                       | -                    |

### Casos de Teste Principais (Exemplos por Módulo)

| ID      | Módulo          | Cenário                                    | Status       | Prioridade |
| ------- | --------------- | ------------------------------------------ | ------------ | ---------- |
| LG-CT02 | Login           | Login com credenciais válidas              | Implementado | Alta       |
| LG-CT03 | Login           | Erro com credenciais inválidas             | Implementado | Alta       |
| LG-CT05 | Login           | Redirecionar para recuperar senha          | Implementado | Média      |
| RS-CT02 | Recuperar Senha | Enviar email de recuperação com sucesso    | Implementado | Alta       |
| RS-CT04 | Recuperar Senha | Mostrar estado de loading                  | Implementado | Média      |
| HM-CT02 | Home            | Exibir 4 cards de estatísticas             | Implementado | Alta       |
| HM-CT09 | Home            | Redirecionar para Produtos                 | Implementado | Alta       |
| FO-CT08 | Fornecedores    | Criar fornecedor com sucesso               | Implementado | Alta       |
| FO-CT09 | Fornecedores    | Erro com CNPJ duplicado                    | Implementado | Alta       |
| FO-CT16 | Fornecedores    | Filtrar por nome                           | Implementado | Média      |
| PR-CT10 | Produtos        | Criar produto com sucesso                  | Implementado | Alta       |
| PR-CT21 | Produtos        | Alterar itens por página                   | Implementado | Média      |
| FU-CT08 | Funcionários    | Criar funcionário com sucesso              | Implementado | Alta       |
| FU-CT09 | Funcionários    | Erro com matrícula duplicada               | Implementado | Alta       |
| MV-CT08 | Movimentações   | Criar movimentação de entrada com sucesso  | Implementado | Alta       |
| MV-CT19 | Movimentações   | Verificar atualização de estoque (entrada) | Implementado | Crítica    |

## 5. Estratégia de Teste

### 5.1 Abordagem

- **Testes E2E**: Foco principal em testes end-to-end com Cypress para validar fluxos completos de usuário.
- **Padrões de Teste**:
  - Uso de `data-test` attributes para seletores estáveis.
  - Custom command `cy.getByData()` para buscar elementos.
  - `cy.intercept()` para simular respostas de API e controlar timing.
  - `cy.wait()` estratégico para estabilidade (1000ms antes de ações, 1500ms após).
  - Verificação de URL com `cy.url().should("include", "param")` ao invés de intercepts para filtros/paginação.
  - `beforeEach()` com login automático para testes de módulos autenticados.

### 5.2 Tipos de Testes

- **Validações Positivas**: Fluxos principais com dados válidos.
- **Validações Negativas**: Dados inválidos, campos vazios, duplicações.
- **Testes de UI**: Exibição de elementos, mensagens de feedback, estados de loading.
- **Testes de Navegação**: Redirecionamentos, links, manutenção de sessão.
- **Testes de Filtros**: Aplicação, limpeza e verificação de parâmetros na URL.
- **Testes de Paginação**: Navegação entre páginas, alteração de limite.

### 5.3 Ferramentas e Configuração

- **Cypress 13+**: Framework de testes E2E.
- **Chrome**: Navegador principal para execução.
- **Docker**: Ambiente isolado para backend e frontend.
- **Cypress Config**:
  - `FRONTEND_URL`: https://garagehub.app.fslab.dev
  - `API_URL`: https://gestao-estoque-api.app.fslab.dev
  - Base URL configurada para produção (não localhost).

## 6. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 13+.
  - Node.js: Versão 18+.
  - Docker: Para executar a API backend e frontend (quando necessário).
- **URLs de Teste**:
  - Frontend: https://garagehub.app.fslab.dev
  - API: https://gestao-estoque-api.app.fslab.dev
- **Dados de Teste**:
  - Usuário Administrador: Matrícula "ADM0001", Senha "Admin@123"
  - Usuário Gerente: Matrícula "GER0001", Senha "Gerente@123"
  - Dados gerados dinamicamente com timestamps para evitar conflitos.
  - Limpeza automática via hooks `after()` quando aplicável.

## 7. Riscos e Mitigações

| Risco                                     | Probabilidade | Impacto | Mitigação                                                                     |
| ----------------------------------------- | ------------- | ------- | ----------------------------------------------------------------------------- |
| Falhas intermitentes em testes de filtros | Média         | Alto    | Mudança para verificação de URL ao invés de intercepts.                       |
| Dados de teste persistindo no banco       | Baixa         | Médio   | Hooks `after()` para limpeza; uso de timestamps em IDs.                       |
| Mudanças na UI quebrando seletores        | Média         | Alto    | Uso consistente de `data-test` attributes.                                    |
| Sessões expirando durante testes          | Baixa         | Médio   | `beforeEach()` com login em cada teste.                                       |
| Falhas de rede/API durante testes         | Baixa         | Alto    | Intercepts configurados; retry automático do Cypress.                         |
| Timing inconsistente (race conditions)    | Média         | Alto    | `cy.wait(1000/1500)` padronizado; verificação de elementos com `should`.      |
| Página não deployada em produção          | Baixa         | Alto    | Verificar deploy antes de executar testes; usar ambiente local se necessário. |
| Credenciais de teste expostas             | Baixa         | Médio   | Uso de variáveis de ambiente; credenciais específicas para testes.            |

## 8. Classificação de Bugs e Severidade

| Severidade | Descrição                                                        | Exemplo                                                  | Ação                                |
| ---------- | ---------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------- |
| Blocker    | Impede execução de testes ou bloqueia funcionalidade crítica     | Crash ao acessar login, API fora do ar                   | Correção imediata, bloqueia release |
| Critical   | Funcionalidade principal não funciona conforme esperado          | Login aceita credenciais inválidas, estoque não atualiza | Correção prioritária                |
| Major      | Funcionalidade secundária com problemas, critérios não atendidos | Filtros não aplicam corretamente, paginação quebrada     | Correção antes do release           |
| Minor      | Problemas de UI/UX, erros de ortografia, validações não críticas | Mensagem de erro genérica, botão desalinhado             | Pode ser corrigido após release     |
| Trivial    | Melhorias ou sugestões que não afetam funcionalidade             | Cores inconsistentes, textos melhoráveis                 | Backlog para versões futuras        |

## 9. Execução de Testes

### 9.1 Pré-requisitos

- Ambiente Docker rodando (se testar localmente) ou acesso às URLs de produção.
- Dependências instaladas: `npm install`.
- Cypress configurado com variáveis de ambiente corretas (`cypress.config.ts`).
- Navegador Chrome instalado e atualizado.

### 9.2 Comandos de Execução

**Modo Interativo (Cypress Test Runner):**

```bash
npx cypress open
```

- Abre interface gráfica do Cypress.
- Permite executar testes individualmente e visualizar em tempo real.
- Ideal para debugging e desenvolvimento de novos testes.

**Execução Específica por Módulo:**

```bash
# Login
npx cypress run --spec cypress/e2e/login/*.cy.ts

# Recuperar Senha
npx cypress run --spec cypress/e2e/recuperar-senha/*.cy.ts

# Home
npx cypress run --spec cypress/e2e/home/*.cy.ts

# Fornecedores
npx cypress run --spec cypress/e2e/fornecedores/*.cy.ts

# Funcionários
npx cypress run --spec cypress/e2e/funcionarios/*.cy.ts

# Movimentações
npx cypress run --spec cypress/e2e/movimentacoes/*.cy.ts
```

## 10. Definição de Pronto (DoD)

Uma funcionalidade ou módulo é considerado pronto quando:

- Todos os testes E2E relacionados estão implementados e passando.  
- Não há bugs com severidade Blocker ou Critical pendentes.  
- Código revisado e aprovado em Pull Request.  
- `data-test` attributes presentes em todos os elementos testáveis.  
- Documentação atualizada (plano de teste específico do módulo).  
- Validação manual realizada pelo Product Owner.  
- Deploy realizado com sucesso em ambiente de homologação.

## 11. Planos de Teste Específicos

Para informações detalhadas sobre cada módulo, consulte os planos de teste específicos:

- [Login](modulos/login.md) - 10 casos de teste (5 implementados)
- [Recuperar Senha](modulos/recuperar-senha.md) - 10 casos de teste (7 implementados)
- [Home](modulos/home.md) - 15 casos de teste (15 implementados)
- [Fornecedores](modulos/fornecedores.md) - 22 casos de teste (22 implementados)
- [Produtos](modulos/produtos.md) - 22 casos de teste (22 em .skip)
- [Funcionários](modulos/funcionarios.md) - 24 casos de teste (24 implementados)
- [Movimentações](modulos/movimentacoes.md) - 18 casos de teste (18 implementados)