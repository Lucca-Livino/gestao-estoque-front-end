describe("Recuperar Senha Page", () => {
  beforeEach(() => {
    cy.visit("https://garagehub.app.fslab.dev/recuperar-senha");
  });

  it("Deve mostrar o formulário de recuperação de senha", () => {
    cy.contains("Recuperar Senha").should("be.visible");
    cy.contains("Enviaremos um link para redefinir sua senha").should(
      "be.visible"
    );
    cy.getByData("email-recuperacao").should("be.visible");
    cy.getByData("btn-enviar-recuperacao")
      .should("be.visible")
      .and("contain", "Enviar link de recuperação");
    cy.getByData("link-voltar-login")
      .should("be.visible")
      .and("contain", "Voltar para o login");
  });

  it("Deve enviar email de recuperação com sucesso", () => {
    cy.intercept("POST", "**/recuperar-senha", {
      statusCode: 200,
      body: { message: "Email enviado com sucesso" },
    }).as("recuperarSenha");

    cy.getByData("email-recuperacao").type("teste@example.com");
    cy.getByData("btn-enviar-recuperacao").click();

    cy.wait("@recuperarSenha");
    cy.wait(500);

    cy.getByData("mensagem-sucesso").should("exist");
    cy.contains("Email enviado!").should("exist");
    cy.contains("Se existir uma conta com este email").should("exist");
  });

  it("Deve validar campo de email obrigatório", () => {
    cy.getByData("email-recuperacao").should("have.attr", "required");
    cy.getByData("email-recuperacao").should("have.attr", "type", "email");
  });

  it("Deve mostrar estado de loading ao enviar", () => {
    cy.intercept("POST", "**/recuperar-senha", (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: { message: "Email enviado" },
      });
    }).as("recuperarSenhaLenta");

    cy.getByData("email-recuperacao").type("teste@example.com");
    cy.getByData("btn-enviar-recuperacao").click();
    cy.getByData("btn-enviar-recuperacao")
      .should("contain", "Enviando...")
      .and("be.disabled");
    cy.getByData("email-recuperacao").should("be.disabled");
  });

  it("Deve permitir enviar para outro email após sucesso", () => {
    cy.intercept("POST", "**/recuperar-senha", {
      statusCode: 200,
      body: { message: "Email enviado" },
    }).as("recuperarSenha");

    cy.getByData("email-recuperacao").type("teste@example.com");
    cy.getByData("btn-enviar-recuperacao").click();
    cy.wait("@recuperarSenha");
    cy.wait(500);

    cy.getByData("btn-enviar-outro-email").click();

    cy.getByData("mensagem-sucesso").should("not.exist");
    cy.getByData("btn-enviar-recuperacao").should("be.visible");
  });

  it("Deve redirecionar para login ao clicar em 'Voltar para o login'", () => {
    cy.getByData("link-voltar-login").click();
    cy.url().should("include", "/login");
  });
});
