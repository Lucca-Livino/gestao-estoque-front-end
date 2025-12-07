describe("Home Page", () => {
  beforeEach(() => {
    // Faz login antes de cada teste
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://garagehub.app.fslab.dev/login");
    
    cy.getByData("matricula").type("ADM0001");
    cy.getByData("senha").type("Admin@123");
    cy.getByData("login-button").click();
    
    cy.url().should("include", "/home", { timeout: 10000 });
    cy.getByData("titulo-garagehub").should("be.visible");
  });

  describe("Elementos da Página", () => {
    it("Deve exibir o título da página", () => {
      cy.getByData("titulo-garagehub")
        .should("be.visible")
        .and("contain", "GarageHub");
    });

    it("Deve exibir o container de cards de estatísticas", () => {
      cy.getByData("stats-cards-container").should("be.visible");
    });

    it("Deve exibir o container de módulos", () => {
      cy.getByData("module-cards-container").should("be.visible");
    });
  });

  describe("Cards de Estatísticas (Stats Cards)", () => {
    it("Deve exibir todos os 4 cards de estatísticas", () => {
      cy.getByData("stats-cards-container")
        .find('[data-test^="stat-card-"]')
        .should("have.length", 4);
    });

    it("Deve redirecionar para Categoria A ao clicar no card", () => {
      cy.getByData("stat-card-categoria-a").click();
      cy.url().should("include", "/categoria_A", { timeout: 10000 });
    });

    it("Deve redirecionar para Categoria B ao clicar no card", () => {
      cy.getByData("stat-card-categoria-b").click();
      cy.url().should("include", "/categoria_B", { timeout: 10000 });
    });

    it("Deve redirecionar para Categoria C ao clicar no card", () => {
      cy.getByData("stat-card-categoria-c").click();
      cy.url().should("include", "/categoria_C", { timeout: 10000 });
    });
  });

  describe("Cards de Módulos (Module Cards)", () => {
    it("Deve exibir cards de módulos disponíveis", () => {
      cy.getByData("module-cards-container")
        .find('[data-test^="module-card-"]')
        .should("have.length.at.least", 1);
    });
    it("Deve redirecionar para página de Produtos ao clicar", () => {
      cy.getByData("module-card-produtos").click();
      cy.url().should("include", "/produtos", { timeout: 10000 });
    });

    it("Deve redirecionar para página de Fornecedores ao clicar", () => {
      cy.getByData("module-card-fornecedores").click();
      cy.url().should("include", "/fornecedores", { timeout: 10000 });
    });

    it("Deve redirecionar para página de Movimentações ao clicar", () => {
      cy.getByData("module-card-movimentações").click();
      cy.url().should("include", "/movimentacoes", { timeout: 10000 });
    });

    it("Deve redirecionar para página de Funcionários ao clicar", () => {
      cy.getByData("module-card-funcionários").click();
      cy.url().should("include", "/funcionarios", { timeout: 10000 });
    });
  });
;


  describe("Navegação", () => {
    it("Deve recarregar a página ao clicar no título", () => {
      cy.getByData("titulo-garagehub").click();
      cy.url().should("include", "/home");
      cy.getByData("stats-cards-container").should("be.visible");
    });

    it("Deve manter a sessão após navegação para produtos e voltar", () => {
      cy.getByData("module-card-produtos").click();
      cy.url().should("include", "/produtos", { timeout: 10000 });
      
      cy.go("back");
      cy.url().should("include", "/home");
      cy.getByData("titulo-garagehub").should("be.visible");
    });
  });
});
