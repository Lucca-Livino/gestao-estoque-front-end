describe("Página de Perfil", () => {
  beforeEach(() => {
    cy.login("ADM0001", "Admin@123");
    cy.visit("https://garagehub.app.fslab.dev/perfil");
  });

  describe("Visualização inicial", () => {
    it.skip("Deve carregar todos os elementos da página", () => {
      cy.url().should("include", "/perfil");
      cy.getByData("titulo-informacoes-conta").should("be.visible");
    
      cy.getByData("avatar-usuario").should("be.visible");
    
      cy.getByData("nome-usuario-exibido").should("be.visible");

      cy.getByData("perfil-usuario").should("be.visible");

      cy.getByData("btn-alterar-foto").should("be.visible");

      cy.getByData("input-nome-usuario").should("be.disabled");
      cy.getByData("input-email").should("be.disabled");
      cy.getByData("input-telefone").should("be.disabled");

      cy.getByData("btn-editar-salvar").should("be.visible").and("contain", "Editar");
    });
  });

  describe("Validação de campos", () => {
    beforeEach(() => {
      cy.getByData("btn-editar-salvar").click();
    });

    it.skip("Deve validar nome com menos de 3 caracteres", () => {
      cy.getByData("input-nome-usuario").clear().type("AB");
      cy.getByData("btn-editar-salvar").click();
      
      cy.contains("Nome deve ter pelo menos 3 caracteres").should("be.visible");
    });

    it.skip("Deve validar email inválido", () => {
      cy.getByData("input-email").clear().type("emailinvalido");
      cy.getByData("btn-editar-salvar").click();
      
      cy.contains("Email inválido").should("be.visible");
    });

    it.skip("Deve validar formato de telefone incorreto", () => {
      cy.getByData("input-telefone").clear().type("123456789");
      cy.getByData("btn-editar-salvar").click();
      
      cy.contains("Telefone deve estar no formato").should("be.visible");
    });

    it.skip("Deve aceitar nome válido com 3 ou mais caracteres", () => {
      cy.getByData("input-nome-usuario").clear().type("João Silva Santos");
      cy.getByData("input-nome-usuario").should("have.value", "João Silva Santos");
    });

    it.skip("Deve aceitar email válido", () => {
      cy.getByData("input-email").clear().type("teste@email.com");
      cy.getByData("input-email").should("have.value", "teste@email.com");
    });

    it.skip("Deve limitar telefone a 15 caracteres", () => {
      cy.getByData("input-telefone").clear().type("699999123456789");
      cy.getByData("input-telefone").invoke("val").then((val) => {
        expect(val?.toString().length).to.be.lte(15);
      });
    });
  });

  describe("Alteração de foto de perfil", () => {
    it("Deve abrir seletor de arquivo ao clicar em Alterar foto", () => {
      cy.getByData("input-foto-perfil").as("fileInput");
      cy.getByData("btn-alterar-foto").click();
      cy.get("@fileInput").should("exist");
    });

    it("Deve fazer upload de foto de perfil com sucesso", () => {
      const API_URL = Cypress.env("API_URL") || "https://gestao-estoque-api.app.fslab.dev";
      const novaFotoUrl = `${API_URL}/uploads/perfil/test-foto.jpg`;

      cy.intercept("POST", "**/usuarios/**/foto-perfil", {
        statusCode: 200,
        body: {
          data: {
            foto_perfil: "/uploads/perfil/test-foto.jpg",
            message: "Foto atualizada com sucesso"
          }
        }
      }).as("uploadFoto");

      cy.intercept("GET", "**/usuarios/**", (req) => {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              nome_usuario: "Administrador",
              email: "admin@email.com",
              telefone: "(69) 99999-9999",
              foto_perfil: "/uploads/perfil/test-foto.jpg"
            }
          }
        });
      }).as("getDadosUsuario");

      cy.getByData("input-foto-perfil").then(($input) => {
        const blob = new Blob([new Uint8Array(1024)], { type: "image/jpeg" });
        const file = new File([blob], "foto-perfil.jpg", { type: "image/jpeg" });
        
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      cy.wait("@uploadFoto");

      cy.contains("Foto de perfil atualizada com sucesso!").should("be.visible");

      cy.getByData("btn-alterar-foto").should("contain", "Alterar foto");

      cy.window().then((win) => {
        const storedFoto = win.localStorage.getItem("foto_perfil_ADM0001");
        expect(storedFoto).to.equal(novaFotoUrl);
      });

      cy.wait(1500);

      cy.getByData("avatar-usuario").should("be.visible").then(($avatar) => {
        const img = $avatar.find("img");
        if (img.length > 0) {
          expect(img.attr("src")).to.include("test-foto.jpg");
        }
      });
    });

    it("Deve exibir erro ao tentar upload de arquivo muito grande", () => {
      const largeFileName = "foto-grande.jpg";
      const largeFileSize = 6 * 1024 * 1024; // 6MB

      cy.getByData("input-foto-perfil").then(($input) => {
        const dataTransfer = new DataTransfer();
        const file = new File(["x".repeat(largeFileSize)], largeFileName, {
          type: "image/jpeg"
        });
        dataTransfer.items.add(file);
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      cy.contains("O arquivo deve ter no máximo 5MB").should("be.visible");
    });

    it("Deve exibir erro ao tentar upload de formato inválido", () => {
      const invalidFileName = "documento.pdf";
      
      cy.getByData("input-foto-perfil").then(($input) => {
        const dataTransfer = new DataTransfer();
        const file = new File(["conteudo"], invalidFileName, {
          type: "application/pdf"
        });
        dataTransfer.items.add(file);
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      cy.contains("Formato de arquivo não suportado").should("be.visible");
    });
  });


  describe("Atualização de perfil", () => {
    it.skip("Deve exibir toast de sucesso ao atualizar perfil", () => {
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("input-nome-usuario").clear().type("Teste Nome Atualizado");
      cy.getByData("input-email").clear().type("teste@email.com");
      cy.getByData("input-telefone").clear().type("69999991234");
      
      cy.intercept("PATCH", "**/usuarios/**", {
        statusCode: 200,
        body: { data: { message: "Perfil atualizado" } }
      }).as("updateProfile");
      
      cy.getByData("btn-editar-salvar").click();
      cy.wait("@updateProfile");
      
      cy.contains("Perfil atualizado com sucesso!").should("be.visible");
    });

    it.skip("Deve atualizar o nome no header após salvar", () => {
      const novoNome = "João Silva Atualizado";
      
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("input-nome-usuario").clear().type(novoNome);
      cy.getByData("input-email").clear().type("joao.silva@email.com");
      cy.getByData("input-telefone").clear().type("69999991234");
      
      cy.intercept("PATCH", "**/usuarios/**", {
        statusCode: 200,
        body: { data: { message: "Perfil atualizado" } }
      }).as("updateProfile");
      
      cy.getByData("btn-editar-salvar").click();
      cy.wait("@updateProfile");
      
      cy.contains("Perfil atualizado com sucesso!").should("be.visible");
      
      // Verificar se o nome foi atualizado no nome exibido na página
      cy.getByData("nome-usuario-exibido").should("contain", novoNome);
      
      // Verificar se o nome foi atualizado no header/menu do usuário
      cy.wait(500); // Aguardar atualização do contexto
      cy.get("header").should("contain", novoNome);
    });

    it.skip("Deve desabilitar botões durante o salvamento", () => {
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("input-nome-usuario").clear().type("Teste Nome");
      cy.getByData("input-email").clear().type("teste@email.com");
      cy.getByData("input-telefone").clear().type("69999991234");
      
      cy.intercept("PATCH", "**/usuarios/**", (req) => {
        req.reply((res) => {
          res.delay = 1000;
          res.send({ data: { message: "Perfil atualizado" } });
        });
      }).as("updateProfile");
      
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("btn-editar-salvar").should("be.disabled");
      cy.getByData("btn-cancelar").should("be.disabled");
    });

    it.skip("Deve exibir toast de erro ao falhar atualização", () => {
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("input-nome-usuario").clear().type("Teste Nome");
      cy.getByData("input-email").clear().type("teste@email.com");
      cy.getByData("input-telefone").clear().type("69999991234");
      
      cy.intercept("PATCH", "**/usuarios/**", {
        statusCode: 400,
        body: { error: { message: "Erro ao atualizar dados" } }
      }).as("updateProfileError");
      
      cy.getByData("btn-editar-salvar").click();
      cy.wait("@updateProfileError");
      
      cy.contains("Erro ao atualizar").should("be.visible");
    });
  });


  describe("Integração com dados do usuário", () => {
    it.skip("Deve exibir dados do usuário logado", () => {
      cy.getByData("input-nome-usuario").should("not.have.value", "");
      cy.getByData("input-email").should("not.have.value", "");
    });

    it.skip("Deve manter o formato do telefone ao carregar", () => {
      cy.getByData("input-telefone").invoke("val").then((telefone) => {
        if (telefone && telefone.toString().length > 0) {
          expect(telefone).to.match(/^\(\d{2}\)\s\d{4,5}-\d{4}$/);
        }
      });
    });
  });

  describe("Estados de erro", () => {
    it.skip("Não deve salvar com campos vazios", () => {
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("input-nome-usuario").clear();
      cy.getByData("btn-editar-salvar").click();
      
      cy.get('[data-sonner-toast]').should("be.visible");
    });

    it.skip("Deve manter modo de edição após erro de validação", () => {
      cy.getByData("btn-editar-salvar").click();
      cy.getByData("input-nome-usuario").clear().type("AB");
      cy.getByData("btn-editar-salvar").click();
      
      cy.contains("Nome deve ter pelo menos 3 caracteres").should("be.visible");
      cy.getByData("input-nome-usuario").should("not.be.disabled");
    });
  });
});
