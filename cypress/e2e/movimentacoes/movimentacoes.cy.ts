describe("Movimentações", () => {
  const frontendUrl = Cypress.env("FRONTEND_URL") || "http://localhost:3000";
  const apiUrl = Cypress.env("API_URL") || "http://localhost:5011";
  const matricula = "ADM0001";
  const senha = "Admin@123";

  let movimentacaoIdCriada: string;
  const destinoMovimentacao = `Destino Teste ${Date.now()}`;
  const observacoesMovimentacao = "Observações de teste";

  beforeEach(() => {
    cy.intercept("GET", `${apiUrl}/movimentacoes*`).as("getMovimentacoes");
    cy.intercept("POST", `${apiUrl}/movimentacoes`).as("createMovimentacao");
    cy.intercept("GET", `${apiUrl}/produtos*`).as("getProdutos");

    cy.on("uncaught:exception", (err) => {
      if (
        err.message.includes(
          "ResizeObserver loop completed with undelivered notifications"
        )
      ) {
        return false;
      }
    });

    cy.login(matricula, senha);
  });

  describe("Cadastrar movimentação", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");

      cy.getByData("btn-abrir-cadastro").click();

      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it.skip("Deve exibir pop-up de cadastro ao clicar em cadastrar", () => {
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
      cy.contains("Cadastro de movimentações").should("be.visible");
    });

    it.skip("Deve exibir todos os campos obrigatórios do formulário", () => {
      cy.getByData("select-tipo").should("be.visible");
      cy.getByData("input-destino").should("be.visible");
      cy.getByData("btn-adicionar-produto").should("be.visible");
    });

    it.skip("Deve validar campo tipo obrigatório", () => {
      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
      cy.contains("Preencha todos os campos obrigatórios").should("be.visible");
    });

    it.skip("Deve validar campo destino obrigatório", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();

      cy.getByData("btn-salvar").click();
      cy.contains("Preencha todos os campos obrigatórios").should("be.visible");

      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it.skip("Deve validar que pelo menos um produto é obrigatório", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();
      cy.getByData("input-destino").type(destinoMovimentacao);

      cy.getByData("btn-salvar").click();

      cy.contains("Preencha todos os campos obrigatórios").should("be.visible");
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it.skip("Deve permitir adicionar produto", () => {
      cy.getByData("btn-adicionar-produto").click();

      cy.getByData("input-codigo-0").should("be.visible");
      cy.getByData("input-nome-0").should("be.visible");
      cy.getByData("input-valor-0").scrollIntoView().should("be.visible");
      cy.getByData("input-quantidade-0").should("be.visible");
    });

    it.skip("Deve buscar produto por código", () => {
      cy.getByData("btn-adicionar-produto").click();

      cy.intercept("GET", `${apiUrl}/produtos?codigo_produto=TEST*`, {
        statusCode: 200,
        body: {
          data: {
            docs: [
              {
                _id: "produto-id-123",
                nome_produto: "Produto Teste",
                codigo_produto: "TEST123",
              },
            ],
          },
        },
      }).as("buscarProduto");

      cy.getByData("input-codigo-0").type("TEST123");

      cy.wait("@buscarProduto");

      cy.getByData("input-nome-0").should("have.value", "Produto Teste");
    });

    //TODO: verificar
    it("Deve criar movimentação de entrada com sucesso", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();
      cy.getByData("input-destino").type(destinoMovimentacao);
      cy.getByData("textarea-observacoes").type(observacoesMovimentacao);

      cy.getByData("btn-adicionar-produto").click();

      cy.intercept("GET", `${apiUrl}/produtos?codigo_produto=TEST*`, {
        statusCode: 200,
        body: {
          data: {
            docs: [
              {
                _id: "produto-id-123",
                nome_produto: "Produto Teste",
                codigo_produto: "TEST123",
              },
            ],
          },
        },
      }).as("buscarProduto");

      cy.getByData("input-codigo-0").type("TEST123");
      cy.wait("@buscarProduto");
      cy.getByData("input-valor-0").type("100");
      cy.getByData("input-quantidade-0").type("10");

      cy.getByData("btn-salvar").click();

      cy.wait("@createMovimentacao").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.eq(201);
        movimentacaoIdCriada = createInterception.response?.body._id;
      });

      cy.getByData("dialog-cadastro-movimentacao").should("not.exist");
      cy.contains("Movimentação cadastrada com sucesso!").should("be.visible");
    });

    it.skip("Deve criar movimentação de saída com sucesso", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-saida").click();
      cy.getByData("input-destino").type(destinoMovimentacao);
      cy.getByData("textarea-observacoes").type(observacoesMovimentacao);

      cy.getByData("btn-adicionar-produto").click();

      cy.intercept("GET", `${apiUrl}/produtos?codigo_produto=TEST*`, {
        statusCode: 200,
        body: {
          data: {
            docs: [
              {
                _id: "produto-id-123",
                nome_produto: "Produto Teste",
                codigo_produto: "TEST123",
              },
            ],
          },
        },
      }).as("buscarProduto");

      cy.getByData("input-codigo-0").type("TEST123");
      cy.wait("@buscarProduto");
      cy.getByData("input-valor-0").type("150");
      cy.getByData("input-quantidade-0").type("5");

      cy.getByData("btn-salvar").click();

      cy.wait("@createMovimentacao");

      cy.getByData("dialog-cadastro-movimentacao").should("not.exist");
      cy.contains("Movimentação cadastrada com sucesso!").should("be.visible");
    });

    it.skip("Deve exibir campos de nota fiscal para entrada", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();

      cy.getByData("input-nf-numero").should("be.visible");
      cy.getByData("input-nf-serie").should("be.visible");
      cy.getByData("input-nf-chave").should("be.visible");
      cy.getByData("input-nf-data").should("be.visible");
    });

    it.skip("Deve dar erro ao criar movimentação com produto inválido", () => {
      // Similar to duplicate, but for invalid product
    });
  });

  describe("Filtrar movimentações", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");
    });

    it.skip("Deve filtrar movimentações por busca", () => {
      cy.getByData("input-busca-movimentacao").type("teste");

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("busca=teste");
      });
    });

    it.skip("Deve filtrar movimentações por tipo", () => {
      cy.getByData("select-tipo-movimentacao").click();
      cy.getByData("select-item-entrada").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("tipo=entrada");
      });
    });

    it.skip("Deve filtrar movimentações por data inicial", () => {
      cy.getByData("calendar-data-inicial").click();
      cy.get(".rdp-day").first().click();

      cy.wait("@getMovimentacoes");
    });

    it.skip("Deve limpar filtros de movimentações", () => {
      cy.getByData("input-busca-movimentacao").type("teste");
      cy.getByData("btn-limpar-filtros-movimentacao").click();

      cy.getByData("input-busca-movimentacao").should("have.value", "");
    });
  });

  describe("Paginação de movimentações", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");
    });

    it.skip("Deve navegar para a próxima página", () => {
      cy.getByData("btn-proxima-pagina").should("be.visible").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("page=2");
      });
    });

    it.skip("Deve navegar para a página anterior", () => {
      cy.getByData("btn-proxima-pagina").click();
      cy.wait("@getMovimentacoes");

      cy.getByData("btn-pagina-anterior").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("page=1");
      });
    });

    it.skip("Deve alterar o número de itens por página", () => {
      cy.getByData("select-itens-por-pagina").click();
      cy.getByData("select-item-20").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("limite")).to.eq("20");
      });
    });
  });

  describe("Imprimir movimentações", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");
    });

    it.skip("Deve permitir clicar no botão de impressão sem erros", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-movimentacao").should("be.visible");

      cy.getByData("btn-imprimir").click();

      cy.getByData("dialog-listagem-movimentacao").should("be.visible");
    });
  });

  after(() => {
    if (movimentacaoIdCriada) {
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/movimentacoes/${movimentacaoIdCriada}`,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        failOnStatusCode: false,
      });
    }
  });
});
