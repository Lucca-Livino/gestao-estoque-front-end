# Plano de Teste - Módulo Login

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do módulo de Login em um sistema de gestão de estoque, assegurando que a autenticação, validações de formulário, redirecionamentos e funcionalidades de recuperação de senha funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para exibição de formulário, autenticação com credenciais válidas/inválidas, funcionalidade "manter logado", redirecionamentos e navegação para recuperação de senha.
- **Excluído**: Testes de performance, carga, segurança avançada (ex.: ataques de força bruta), integração com APIs externas (exceto mocks básicos) e testes manuais não automatizados.
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 95% das execuções.
- Não devem haver falhas críticas (ex.: falhas de autenticação ou redirecionamentos incorretos).
- Cobertura mínima de 100% dos cenários funcionais identificados.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O sistema deve exibir o formulário de login com todos os campos e elementos necessários (matrícula, senha, checkbox "manter logado", botão de login).
- **RF02**: O usuário deve poder fazer login com credenciais válidas e ser redirecionado para a página "/home".
- **RF03**: O sistema deve exibir mensagem de erro apropriada ao tentar login com credenciais inválidas.
- **RF04**: O usuário deve poder marcar/desmarcar o checkbox "manter logado" e o estado deve ser persistido.
- **RF05**: O usuário deve poder acessar a página de recuperação de senha clicando no link "Clique aqui".
- **RF06**: O sistema deve prevenir acesso não autorizado e manter a integridade da sessão.

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                                        | Pré-Condições                        | Passos                                                                                         | Resultado Esperado                                                                      | Status        | Requisito Relacionado |
| ---- | ---------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------- | --------------------- |
| CT01 | Exibir formulário de login completo            | Página de login carregada            | 1. Acessar página "/login".                                                                    | Campos matrícula, senha, checkbox "manter logado" e botão de login visíveis.            | Implementado  | RF01                  |
| CT02 | Login com credenciais válidas                  | Página de login carregada            | 1. Preencher matrícula "ADM0001".<br>2. Preencher senha "Admin@123".<br>3. Clicar em "Entrar". | Usuário autenticado e redirecionado para "/home".                                       | Implementado  | RF02                  |
| CT03 | Erro ao fazer login com credenciais inválidas  | Página de login carregada            | 1. Preencher matrícula "INVALID".<br>2. Preencher senha "invalid".<br>3. Clicar em "Entrar".   | Mensagem de erro "Credenciais inválidas" exibida, usuário permanece na página de login. | Implementado  | RF03                  |
| CT04 | Marcar checkbox "manter logado"                | Página de login carregada            | 1. Clicar no checkbox "manter logado".                                                         | Checkbox marcado e estado persistido.                                                   | Implementado  | RF04                  |
| CT05 | Redirecionar para recuperação de senha         | Página de login carregada            | 1. Clicar no link "Clique aqui" abaixo de "Esqueceu a senha?".                                 | Usuário redirecionado para página "/recuperar-senha".                                   | Implementado  | RF05                  |
| CT06 | Validar campo matrícula obrigatório            | Página de login carregada            | 1. Deixar matrícula vazia.<br>2. Preencher senha.<br>3. Clicar em "Entrar".                    | Validação HTML5 impede submit ou mensagem de campo obrigatório exibida.                 | A implementar | RF01                  |
| CT07 | Validar campo senha obrigatório                | Página de login carregada            | 1. Preencher matrícula.<br>2. Deixar senha vazia.<br>3. Clicar em "Entrar".                    | Validação HTML5 impede submit ou mensagem de campo obrigatório exibida.                 | A implementar | RF01                  |
| CT08 | Validar conversão de matrícula para maiúsculas | Página de login carregada            | 1. Digitar matrícula em minúsculas "adm0001".                                                  | Campo exibe "ADM0001" (texto convertido automaticamente).                               | A implementar | RF01                  |
| CT09 | Validar estado de loading ao fazer login       | Página de login carregada            | 1. Preencher credenciais válidas.<br>2. Clicar em "Entrar".<br>3. Observar botão.              | Botão exibe "Entrando..." e fica desabilitado durante o processo.                       | A implementar | RF02                  |
| CT10 | Persistir sessão com "manter logado" ativo     | Login realizado com checkbox marcado | 1. Fazer login com "manter logado" marcado.<br>2. Fechar navegador.<br>3. Reabrir.             | Usuário permanece autenticado e é redirecionado para "/home".                           | A implementar | RF04                  |

## 4. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 13+.
  - Node.js: Versão 18+.
  - Docker: Para executar a API backend e frontend.
- **URLs de Teste**:
  - Frontend: https://garagehub.app.fslab.dev
  - API: https://gestao-estoque-api.app.fslab.dev
- **Dados de Teste**:
  - Usuário válido: Matrícula "ADM0001", Senha "Admin@123"
  - Usuário inválido: Matrícula "INVALID", Senha "invalid"

## 5. Riscos e Mitigações

- **Risco**: Credenciais de teste expostas. **Mitigação**: Uso de variáveis de ambiente e credenciais específicas para ambiente de teste.
- **Risco**: Falhas de rede/API. **Mitigação**: Intercepts no Cypress para simular respostas quando necessário.
- **Risco**: Mudanças na UI quebrando seletores. **Mitigação**: Uso de `data-test` attributes.
- **Risco**: Sessões persistindo entre testes. **Mitigação**: Limpeza de cookies e localStorage via `beforeEach()` quando necessário.

## 6. Execução

- **Pré-requisitos**:

  - Ambiente Docker rodando ou acesso às URLs de produção.
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL, API_URL).

- **Modo Interativo**:

  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `login.cy.ts` para executar testes passo a passo.

- **Modo Headless**:

  - Comando: `npx cypress run --spec cypress/e2e/login/login.cy.ts`.
  - Executa todos os testes de login em modo headless com relatórios no terminal.

- **Execução Específica**:

  - Para executar apenas um teste: adicione `.only` ao bloco `it()` desejado no arquivo de teste.

## 7. Observações

- O teste CT05 (redirecionamento para recuperação de senha) utiliza seletor por texto `cy.get('a').contains('Clique aqui')` ao invés de `data-test` attribute devido à estrutura atual do componente.
- Todos os testes atualmente implementados (CT01-CT05) estão passando com sucesso.
- Os casos CT06-CT10 foram identificados como melhorias futuras para aumentar a cobertura de testes e validações.

## 8. Resultados Esperados

Após a execução completa da suíte de testes, espera-se:

- **5 testes implementados** passando com 100% de sucesso.
- **0 falhas críticas** em funcionalidades essenciais (autenticação, redirecionamento).
- **Cobertura de 100%** dos fluxos principais (login válido, inválido, recuperação de senha, manter logado).
- **Tempo médio de execução**: ~8-10 segundos para a suíte completa.
