describe("Fornecedores", () => {
  beforeEach(() => {
    cy.login("ADM0001", "Admin@123");
    cy.visit("http://localhost:3000/fornecedores");
  });

  it.skip("Deve carregar a página de fornecedores", () => {
    cy.getByData("pagina-fornecedores").should("be.visible");
    cy.getByData("tabela-fornecedores").should("be.visible");
  });

  it.skip("Deve abrir o modal de cadastro de fornecedor", () => {
    cy.getByData("btn-abrir-cadastro").click();
    cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
  });

  it.skip("Deve cadastrar um novo fornecedor", () => {
    cy.getByData("btn-abrir-cadastro").click();
    cy.getByData("input-nome-fornecedor").type("Fornecedor Teste");
    cy.getByData("input-cnpj").type("12.345.678/0001-90");
    cy.getByData("input-telefone").type("(11) 99999-9999");
    cy.getByData("input-email").type("teste@empresa.com");
    cy.getByData("input-cep").type("01000-000");
    cy.getByData("input-bairro").type("Centro");
    cy.getByData("input-logradouro").type("Rua Teste, 123");
    cy.getByData("input-cidade").type("São Paulo");
    cy.getByData("select-estado").click();
    cy.contains("SP - São Paulo").click();
    cy.getByData("btn-salvar").click();
    // Verificar se o fornecedor foi adicionado (assumindo que aparece na tabela)
    cy.getByData("tabela-fornecedores").should("contain", "Fornecedor Teste");
  });

  it.skip("Deve visualizar detalhes de um fornecedor", () => {
    // Assumindo que há pelo menos um fornecedor na tabela
    cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
    cy.getByData("dialog-listagem-fornecedor").should("be.visible");
  });

  it.skip("Deve editar um fornecedor", () => {
    cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
    cy.getByData("btn-editar-fornecedor").click();
    cy.getByData("dialog-edicao-fornecedor").should("be.visible");
    cy.getByData("input-nome-fornecedor").clear().type("Fornecedor Editado");
    cy.getByData("btn-salvar").click();
    // Verificar se foi editado
    cy.getByData("tabela-fornecedores").should("contain", "Fornecedor Editado");
  });

  it.skip("Deve excluir um fornecedor", () => {
    cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
    cy.getByData("btn-excluir-fornecedor").click();
    cy.getByData("btn-confirmar-excluir").click();
    // Verificar se foi removido (pode precisar de reload ou check)
  });

  it.skip("Deve filtrar fornecedores", () => {
    cy.getByData("input-busca-fornecedor").type("Fornecedor editado");
    // Assumir que há botão de submit ou enter
    cy.getByData("input-busca-fornecedor").type("{enter}");
    // Verificar resultados
  });
});
