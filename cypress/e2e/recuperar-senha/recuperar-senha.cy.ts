describe("Recuperar Senha", () => {
  beforeEach(() => {
    cy.visit("https://garagehub.app.fslab.dev/recuperar-senha");
  });

  it("Deve exibir todos os elementos da página", () => {
    cy.contains("GarageHub").should("be.visible");
    cy.contains("Recuperar Senha").should("be.visible");
    cy.contains("Enviaremos um link para redefinir sua senha").should("be.visible");
    cy.getByData("email-recuperacao").should("be.visible");
    cy.getByData("btn-enviar-recuperacao").should("be.visible");
    cy.getByData("link-voltar-login").should("be.visible");
  });


  it("Deve enviar email de recuperação com sucesso", () => {
    cy.intercept("POST", "**/recuperar-senha", {
      statusCode: 200,
      body: {
        message: "Email enviado com sucesso"
      }
    }).as("recuperarSenha");

    cy.getByData("email-recuperacao").type("usuario@example.com");
    cy.getByData("btn-enviar-recuperacao").click();

    cy.wait("@recuperarSenha");

    cy.getByData("mensagem-sucesso").should("exist");
    cy.contains("Email enviado!").should("exist");
    cy.getByData("btn-ir-para-login").should("exist").scrollIntoView().should("be.visible");
    cy.getByData("btn-enviar-outro-email").should("exist");
  });

  it("Deve exibir erro em caso de falha no envio", () => {
    cy.intercept("POST", "**/recuperar-senha", {
      forceNetworkError: true
    }).as("recuperarSenhaErro");

    cy.getByData("email-recuperacao").type("erro@example.com");
    cy.getByData("btn-enviar-recuperacao").click();

    cy.wait("@recuperarSenhaErro");
    cy.wait(500);

    cy.contains("Erro de conexão").should("exist");
  });

  it("Deve redirecionar para login ao clicar no botão após sucesso", () => {
    cy.intercept("POST", "**/recuperar-senha", {
      statusCode: 200,
      body: { message: "Email enviado" }
    }).as("recuperarSenha");

    cy.getByData("email-recuperacao").type("usuario@example.com");
    cy.getByData("btn-enviar-recuperacao").click();
    cy.wait("@recuperarSenha");

    cy.getByData("btn-ir-para-login").click();
    cy.url().should("include", "/login");
  });

  it("Deve permitir enviar outro email após sucesso", () => {
    cy.intercept("POST", "**/recuperar-senha", {
      statusCode: 200,
      body: { message: "Email enviado" }
    }).as("recuperarSenha");

    cy.getByData("email-recuperacao").type("primeiro@example.com");
    cy.getByData("btn-enviar-recuperacao").click();
    cy.wait("@recuperarSenha");

    cy.getByData("btn-enviar-outro-email").scrollIntoView().click();

    cy.getByData("email-recuperacao").should("exist").and("have.value", "");
    cy.getByData("btn-enviar-recuperacao").should("exist");
  });

});
