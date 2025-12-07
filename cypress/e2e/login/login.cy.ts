describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("https://garagehub.app.fslab.dev/login");
  });

  it("Deve mostrar o formulário de login", () => {
    cy.getByData("matricula").should("be.visible");
    cy.getByData("senha").should("be.visible");
    cy.getByData("manter-logado").should("be.visible");
    cy.getByData("login-button").should("be.visible");
  });

  it("Deve fazer login com sucesso com credenciais válidas", () => {
    cy.getByData("matricula").type("ADM0001");
    cy.getByData("senha").type("Admin@123");
    cy.getByData("login-button").click();
    cy.url().should("include", "/home");
  });

  it("Deve mostrar erro em credenciais inválidas", () => {
    cy.getByData("matricula").type("INVALID");
    cy.getByData("senha").type("invalid");
    cy.getByData("login-button").click();
    cy.getByData("error-message")
      .should("be.visible")
      .and("contain", "Credenciais inválidas");
  });

  it("Deve marcar o checkbox manter logado", () => {
    cy.getByData("manter-logado").check();
    cy.getByData("manter-logado").should("be.checked");
  });

  it("Deve redirecionar para página de recuperar senha ao clicar em 'clique aqui'", () => {
    cy.get('a').contains('Clique aqui').should("be.visible").click();
    cy.url().should("include", "/recuperar-senha");
  });
});
