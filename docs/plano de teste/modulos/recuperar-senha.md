# Plano de Teste - Módulo Recuperar Senha

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do módulo de Recuperação de Senha em um sistema de gestão de estoque, assegurando que o envio de email de recuperação, validações de formulário, estados de loading, redirecionamentos e mensagens de feedback funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para exibição de formulário, envio de email de recuperação, validações de campo, estados de loading, mensagens de sucesso/erro, navegação entre estados e redirecionamentos.
- **Excluído**: Testes de performance, carga, segurança avançada, validação real de envio de email (usa mocks), integração com APIs externas (exceto mocks básicos) e testes manuais não automatizados.
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 95% das execuções.
- Não devem haver falhas críticas (ex.: falhas no envio de formulário ou redirecionamentos incorretos).
- Cobertura mínima de 100% dos cenários funcionais identificados.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O sistema deve exibir o formulário de recuperação de senha com todos os campos e elementos necessários (email, botão enviar, link voltar).
- **RF02**: O usuário deve poder enviar um email de recuperação e receber feedback visual de sucesso.
- **RF03**: O sistema deve validar que o campo de email é obrigatório e do tipo email correto.
- **RF04**: O sistema deve exibir estado de loading durante o processamento da requisição, desabilitando os campos.
- **RF05**: O usuário deve poder enviar para outro email após sucesso, retornando ao formulário inicial.
- **RF06**: O usuário deve poder navegar de volta para a página de login a qualquer momento.
- **RF07**: O sistema deve exibir mensagens de erro apropriadas em caso de falha de conexão.
- **RF08**: O campo de email deve ser limpo após envio bem-sucedido ao clicar em "Enviar para outro email".

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                                       | Pré-Condições                       | Passos                                                                                         | Resultado Esperado                                                                                        | Status        | Requisito Relacionado |
| ---- | --------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| CT01 | Exibir formulário de recuperação completo     | Página de recuperar senha carregada | 1. Acessar página "/recuperar-senha".                                                          | Título, descrição, campo email, botão "Enviar link de recuperação" e link "Voltar para o login" visíveis. | Implementado  | RF01                  |
| CT02 | Enviar email de recuperação com sucesso       | Página de recuperar senha carregada | 1. Preencher email "teste@example.com".<br>2. Clicar em "Enviar link de recuperação".          | Mensagem de sucesso exibida com título "Email enviado!" e descrição informativa.                          | Implementado  | RF02                  |
| CT03 | Validar campo de email obrigatório            | Página de recuperar senha carregada | 1. Verificar atributos do campo email.                                                         | Campo possui atributos `required` e `type="email"`.                                                       | Implementado  | RF03                  |
| CT04 | Mostrar estado de loading ao enviar           | Página de recuperar senha carregada | 1. Preencher email.<br>2. Clicar em enviar.<br>3. Observar durante processamento lento.        | Botão exibe "Enviando..." e fica desabilitado, campo email também desabilitado.                           | Implementado  | RF04                  |
| CT05 | Permitir enviar para outro email após sucesso | Email enviado com sucesso           | 1. Enviar email com sucesso.<br>2. Clicar em "Enviar para outro email".                        | Mensagem de sucesso desaparece, formulário reaparece vazio, botão "Enviar link" visível novamente.        | Implementado  | RF05, RF08            |
| CT06 | Redirecionar para login ao clicar em voltar   | Página de recuperar senha carregada | 1. Clicar no link "Voltar para o login".                                                       | Usuário redirecionado para página "/login".                                                               | Implementado  | RF06                  |
| CT07 | Limpar campo de email após sucesso            | Email enviado com sucesso           | 1. Enviar email com sucesso.<br>2. Clicar em "Enviar para outro email".<br>3. Verificar campo. | Campo de email está vazio (value="").                                                                     | Implementado  | RF08                  |
| CT08 | Redirecionar para login após sucesso          | Email enviado com sucesso           | 1. Enviar email com sucesso.<br>2. Clicar em "Ir para o Login".                                | Usuário redirecionado para página "/login".                                                               | A implementar | RF06                  |
| CT09 | Exibir mensagem de erro em falha de conexão   | Página de recuperar senha carregada | 1. Simular erro de rede.<br>2. Preencher email.<br>3. Clicar em enviar.                        | Mensagem de erro "Erro de conexão. Tente novamente mais tarde." exibida.                                  | A implementar | RF07                  |
| CT10 | Validar formato de email inválido             | Página de recuperar senha carregada | 1. Preencher email inválido "teste".<br>2. Tentar submeter formulário.                         | Validação HTML5 impede submit ou exibe mensagem de formato inválido.                                      | A implementar | RF03                  |

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
  - Email válido: "teste@example.com"
  - Email inválido: "teste" (sem formato correto)

## 5. Riscos e Mitigações

- **Risco**: Emails reais sendo enviados durante testes. **Mitigação**: Uso de intercepts no Cypress para simular respostas da API.
- **Risco**: Falhas de rede/API. **Mitigação**: Intercepts configurados para simular tanto sucesso quanto falhas.
- **Risco**: Mudanças na UI quebrando seletores. **Mitigação**: Uso de `data-test` attributes.
- **Risco**: Timing inconsistente em testes de loading. **Mitigação**: Uso de `cy.wait()` e delays controlados nos intercepts.

## 6. Execução

- **Pré-requisitos**:

  - Ambiente Docker rodando ou acesso às URLs de produção.
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL, API_URL).

- **Modo Interativo**:

  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `recuperar-senha.cy.ts` para executar testes passo a passo.

- **Modo Headless**:

  - Comando: `npx cypress run --spec cypress/e2e/recuperar-senha/recuperar-senha.cy.ts`.
  - Executa todos os testes de recuperação de senha em modo headless com relatórios no terminal.

- **Execução Específica**:

  - Para executar apenas um teste: adicione `.only` ao bloco `it()` desejado no arquivo de teste.

## 7. Observações

- Todos os testes utilizam `cy.intercept()` para simular respostas da API, evitando envio real de emails durante testes.
- O teste CT04 (estado de loading) utiliza delay de 1000ms no intercept para garantir visualização do estado de carregamento.
- Após envio bem-sucedido, o sistema limpa o campo de email automaticamente (conforme `setEmail("")` no código).
- Os casos CT01-CT07 estão implementados e funcionais.
- Os casos CT08-CT10 foram identificados como melhorias futuras para aumentar a cobertura de testes.

## 8. Resultados Esperados

Após a execução completa da suíte de testes, espera-se:

- **7 testes implementados** passando com 100% de sucesso.
- **0 falhas críticas** em funcionalidades essenciais (envio de email, navegação, validações).
- **Cobertura de 100%** dos fluxos principais (envio, sucesso, loading, navegação).
- **Tempo médio de execução**: ~10-15 segundos para a suíte completa (devido aos delays de loading).
