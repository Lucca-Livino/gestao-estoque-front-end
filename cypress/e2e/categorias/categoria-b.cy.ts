describe("Categoria B", () => {
  beforeEach(() => {
    cy.login("ADM0001", "Admin@123");
    cy.visit("https://garagehub.app.fslab.dev/categoria_B");
  });

  it("Deve exibir o título da categoria corretamente", () => {
    cy.getByData("titulo-categoria").should("be.visible");
    cy.getByData("titulo-categoria").should("contain", "Categoria B - Produtos de Médio Valor");
  });

  it("Deve exibir os cards de estatísticas", () => {
    cy.getByData("secao-stats").should("be.visible", { timeout: 10000 });
    cy.getByData("stats-cards").should("be.visible");
    cy.getByData("card-total-produtos").should("be.visible");
    cy.getByData("card-total-entradas").should("be.visible");
    cy.getByData("card-total-saidas").should("be.visible");
  });

  it("Deve exibir valores nos cards de estatísticas", () => {
    cy.getByData("secao-stats").should("be.visible", { timeout: 10000 });
    cy.getByData("valor-total-produtos").should("exist");
    cy.getByData("valor-total-entradas").should("exist");
    cy.getByData("valor-total-saidas").should("exist");
  });

  it("Deve exibir o gráfico de movimentações", () => {
    cy.getByData("chart-movimentacoes").should("be.visible");
    cy.getByData("titulo-chart").should("contain", "Movimentações de Produtos - Categoria B");
    cy.getByData("descricao-chart").should("contain", "Entradas e saídas dos últimos meses");
  });

  it("Deve exibir a seção de lista de produtos", () => {
    cy.getByData("secao-lista-produtos").should("be.visible");
    cy.getByData("titulo-lista-produtos").should("contain", "Lista de Produtos");
  });


});
