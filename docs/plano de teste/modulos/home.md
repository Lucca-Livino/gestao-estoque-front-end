# Plano de Teste - Módulo Home

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa da página Home (Dashboard) do sistema de gestão de estoque, assegurando que a exibição de estatísticas, navegação entre módulos, redirecionamentos e interações com a interface funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para exibição de elementos da página (título, cards de estatísticas, cards de módulos), navegação e redirecionamentos, validação de sessão e autenticação.
- **Excluído**: Testes de performance, carga, segurança avançada, integração com APIs externas (exceto validação de dados exibidos) e testes manuais não automatizados.
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 90% das execuções.
- Não devem haver falhas críticas (ex.: crashes, redirecionamentos incorretos ou sessão perdida).
- Cobertura mínima de 95% dos cenários funcionais identificados.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O usuário autenticado deve visualizar o título "GarageHub" na página inicial.
- **RF02**: O sistema deve exibir um container com 4 cards de estatísticas (Categorias A, B, C e Estoque Baixo).
- **RF03**: O sistema deve exibir um container com cards de módulos disponíveis (Produtos, Fornecedores, Movimentações, Funcionários).
- **RF04**: Ao clicar em um card de categoria (A, B ou C), o usuário deve ser redirecionado para a página correspondente.
- **RF05**: Ao clicar em um card de módulo, o usuário deve ser redirecionado para a página do módulo correspondente.
- **RF06**: O usuário deve poder navegar entre páginas e retornar à home mantendo a sessão ativa.
- **RF07**: Ao clicar no título "GarageHub", a página deve ser recarregada ou permanecer na home.
- **RF08**: Apenas usuários autenticados devem acessar a página home.

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                                                    | Pré-Condições                    | Passos                                                  | Resultado Esperado                                                               | Status       | Requisito Relacionado |
| ---- | ---------------------------------------------------------- | -------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------ | --------------------- |
| CT01 | Exibir título da página                                    | Usuário autenticado, página home | 1. Verificar visibilidade do título "GarageHub".        | Título visível e contendo "GarageHub".                                           | Implementado | RF01                  |
| CT02 | Exibir container de cards de estatísticas                  | Usuário autenticado, página home | 1. Verificar visibilidade do container de stats cards.  | Container com `data-test="stats-cards-container"` visível.                       | Implementado | RF02                  |
| CT03 | Exibir container de módulos                                | Usuário autenticado, página home | 1. Verificar visibilidade do container de module cards. | Container com `data-test="module-cards-container"` visível.                      | Implementado | RF03                  |
| CT04 | Exibir todos os 4 cards de estatísticas                    | Usuário autenticado, página home | 1. Contar cards dentro do container de estatísticas.    | Exatamente 4 cards com `data-test^="stat-card-"` visíveis.                       | Implementado | RF02                  |
| CT05 | Redirecionar para Categoria A ao clicar no card            | Usuário autenticado, página home | 1. Clicar no card "Categoria A".                        | URL contém "/categoria_A".                                                       | Implementado | RF04                  |
| CT06 | Redirecionar para Categoria B ao clicar no card            | Usuário autenticado, página home | 1. Clicar no card "Categoria B".                        | URL contém "/categoria_B".                                                       | Implementado | RF04                  |
| CT07 | Redirecionar para Categoria C ao clicar no card            | Usuário autenticado, página home | 1. Clicar no card "Categoria C".                        | URL contém "/categoria_C".                                                       | Implementado | RF04                  |
| CT08 | Exibir pelo menos 1 card de módulo                         | Usuário autenticado, página home | 1. Contar cards dentro do container de módulos.         | Pelo menos 1 card com `data-test^="module-card-"` visível.                       | Implementado | RF03                  |
| CT09 | Redirecionar para Produtos ao clicar no card               | Usuário autenticado, página home | 1. Clicar no card "Produtos".                           | URL contém "/produtos".                                                          | Implementado | RF05                  |
| CT10 | Redirecionar para Fornecedores ao clicar no card           | Usuário autenticado, página home | 1. Clicar no card "Fornecedores".                       | URL contém "/fornecedores".                                                      | Implementado | RF05                  |
| CT11 | Redirecionar para Movimentações ao clicar no card          | Usuário autenticado, página home | 1. Clicar no card "Movimentações".                      | URL contém "/movimentacoes".                                                     | Implementado | RF05                  |
| CT12 | Redirecionar para Funcionários ao clicar no card           | Usuário autenticado, página home | 1. Clicar no card "Funcionários".                       | URL contém "/funcionarios".                                                      | Implementado | RF05                  |
| CT13 | Recarregar página ao clicar no título                      | Usuário autenticado, página home | 1. Clicar no título "GarageHub".                        | URL permanece em "/home", container de stats cards visível.                      | Implementado | RF07                  |
| CT14 | Manter sessão após navegação para produtos e voltar        | Usuário autenticado, página home | 1. Clicar em "Produtos".<br>2. Voltar (browser back).   | URL retorna para "/home", título "GarageHub" visível, sessão mantida.            | Implementado | RF06                  |
| CT15 | Bloquear acesso não autenticado (implícito via beforeEach) | Usuário não autenticado          | 1. Tentar acessar "/home" sem login.                    | Redirecionado para "/login" (testado implicitamente pelo fluxo de autenticação). | Implícito    | RF08                  |

## 4. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 13+.
  - Node.js: Versão 18+.
  - Docker: Para executar a API backend (porta 5011) e frontend (porta 3000).
- **Dados de Teste**:
  - Usuário: Matrícula "ADM0001", Senha "Admin@123" (Administrador).
  - Acesso via URL: `https://garagehub.app.fslab.dev/home`.

## 5. Riscos e Mitigações

- **Risco**: Sessão expirada durante testes. **Mitigação**: `beforeEach` realiza login antes de cada teste.
- **Risco**: Mudanças na estrutura de cards/módulos. **Mitigação**: Uso de `data-test` attributes consistentes.
- **Risco**: Falhas de rede/API ao carregar estatísticas. **Mitigação**: Testes focam em elementos da UI, não em dados específicos da API.
- **Risco**: Redirecionamentos lentos. **Mitigação**: Uso de `{ timeout: 10000 }` em asserções de URL.

## 6. Execução

- **Pré-requisitos**:

  - Ambiente Docker rodando (backend na porta 5011, frontend na porta 3000).
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL: `https://garagehub.app.fslab.dev`).

- **Modo Interativo**:

  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `home.cy.ts` para executar testes passo a passo.

- **Modo Headless**:

  - Comando: `npx cypress run --spec cypress/e2e/home/home.cy.ts`.
  - Executa todos os testes em modo headless (sem interface gráfica).

- **Execução Específica**:
  - Para executar apenas um describe, modifique o arquivo adicionando `.only`:
    ```typescript
    describe.only("Cards de Estatísticas (Stats Cards)", () => { ... });
    ```

## 7. Observações

- **Autenticação**: Todos os testes dependem de autenticação prévia via `beforeEach`, que limpa cookies/storage, faz login e aguarda redirecionamento para `/home`.
- **Cards de Módulos**: O número de cards exibidos pode variar conforme permissões do usuário (ex.: Administrador vê todos os 4 módulos).
- **Performance**: Testes utilizam timeouts generosos (10s) para acomodar latência de rede em ambiente de produção.
- **Manutenção**: Caso novos cards ou módulos sejam adicionados, atualizar os casos de teste CT04 e CT08 com as novas expectativas.

## 8. Resultados Esperados

Ao executar o conjunto completo de testes, espera-se:

- **14 testes passando** (incluindo verificações implícitas de autenticação).
- **0 falhas** em condições normais de rede e backend funcional.
- **Cobertura**: 100% dos elementos críticos da página home (título, containers, cards, redirecionamentos).
