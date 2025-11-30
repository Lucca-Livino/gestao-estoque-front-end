# Plano de Teste - Módulo Fornecedores

## 1. Objetivo

Validar CRUD, busca e filtros na tela de fornecedores.

## 2. Casos de Teste

### 2.1 Carregamento da Página

- **Cenário**: Usuário acessa /fornecedores.
- **Passos**: Login, navegar para fornecedores.
- **Resultado Esperado**: Página e tabela visíveis.

### 2.2 Cadastro de Fornecedor

- **Cenário**: Criar fornecedor válido.
- **Passos**: Abrir modal, preencher campos (nome, CNPJ, etc.), salvar.
- **Resultado Esperado**: Fornecedor na tabela.

### 2.3 Edição de Fornecedor

- **Cenário**: Editar fornecedor existente.
- **Passos**: Selecionar fornecedor, editar, salvar.
- **Resultado Esperado**: Dados atualizados.

### 2.4 Exclusão de Fornecedor

- **Cenário**: Excluir fornecedor.
- **Passos**: Selecionar, confirmar exclusão.
- **Resultado Esperado**: Fornecedor removido.

### 2.5 Busca e Filtros

- **Cenário**: Filtrar fornecedores.
- **Passos**: Digitar no campo de busca.
- **Resultado Esperado**: Resultados filtrados.

### 2.6 Validações Negativas

- **Cenário**: Campos obrigatórios vazios.
- **Passos**: Tentar salvar sem nome.
- **Resultado Esperado**: Erro exibido.

## 3. Critérios de Sucesso

- Todos os cenários passam em Cypress.

## 4. Dados de Teste

- Fornecedor: Nome "Teste Ltda", CNPJ "12.345.678/0001-90", etc.

## 5. Ferramentas

- Cypress, Docker.
