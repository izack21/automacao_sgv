import LoginPage from '../pages/loginPage';


describe('Login', () => {
  beforeEach(() => {
    LoginPage.visitPageLogin();
    cy.injectAxe()
    //cy.visit('http://sgv2.otimizasistemas.com.br/#/login')
  });


  it('CT-01-1-Verifica o titulo da aplicação', () => {
    cy.title().should('be.equal', 'SGV')
  })
  it('CT-02-1-Verifica elementos da tela', () => {
    //Validar presença da logo
    cy.get('img').should('have.attr', 'src', 'assets/images/logo.svg')
    //Validar titulo do formulário
    cy.get('app-public').within(() => {
      cy.contains('Seja bem-vindo(a) ao SGV')
        .should('be.visible')
    })
    //Validar presença do campo de Login
    cy.getCampoLogin().within(() => {
      cy.get('input').should('have.attr', 'type', 'text')
      cy.contains('label', 'Login')
        .should('be.visible')
    })

    //Validar presença do campo de Senha
    cy.getCampoSenha().within(() => {
      cy.get('input').should('have.attr', 'type', 'password')
      cy.contains('label', 'Senha')
        .should('be.visible')
    })

    //Validar presença do botão para deixar senha visivel
    cy.getCampoSenha().within(() => {
      cy.get('button').should('be.visible')
    })

    //Validar presença do checkbox de Lembrar
    cy.get('input[id="lembrar-dados"]')
      .should('be.visible')
      .should('not.be.checked')
    cy.get('label[for="lembrar-dados"]')
      .contains('Lembrar')
      .should('be.visible')

    //Validar presença do link esqueci senha
    cy.get('[routerlink="/login/recuperar-senha"]')
      .contains(' Esqueci minha senha ')
      //.should('have.attr', 'href', '#/login/recuperar-senha')
      .should('be.visible')

    //Validar presença do botão Entrar
    cy.get('app-btn-primary').first().within(() => {
      cy.get('button').should('have.attr', 'type', 'button')
      cy.should('have.text', ' Entrar ')
      cy.should('be.visible')
    })
    //Validar presença do rodapé
    cy.get('footer')
      .contains('Copyright © 2024 Otimiza UGC. Todos os direitos reservados.')
      .should('be.visible')
  })

  it('CT-02-2-Validar lembrar dados', () => {
    cy.get('input[id="lembrar-dados"]')
      .should('be.visible')
      .should('not.be.checked')
      .click()
      .should('be.checked')
      .click()
      .should('not.be.checked')
  })

  it('CT-02-3-Validar link esqueci a senha', () => {
    cy.get('button[routerlink="/login/recuperar-senha"]')
      .click()
    cy.url().should('eq', 'http://sgv2.otimizasistemas.com.br/#/login/recuperar-senha')
  })

  it('CT-03-1-Login e Senha obrigatorios', () => {
    cy.get('app-btn-primary').first().within(() => {
      cy.get('button').click()
    })
    cy.get('app-input-floating-label').within(() => {
      //cy.get('.error-message')
      cy.xpath('/html/body/app-root/app-login/div/app-public/div/div/div/div/div[2]/div/div[2]/app-input-floating-label/div[2]')
        .contains('Campo obrigatório')
        .should('be.visible')
    })
    cy.get('app-password-input-floating-label').within(() => {
      //cy.get('.error-message')
      cy.xpath('/html/body/app-root/app-login/div/app-public/div/div/div/div/div[2]/div/div[3]/app-password-input-floating-label/div[2]')
        .contains('Campo obrigatório')
        .should('be.visible')
    })
  })

  it('CT-03-2-Senha Obritória', () => {
    cy.getCampoLogin().within(() => {
      cy.get('input').type('izack.sc')
    })
    cy.get('app-btn-primary').first().within(() => {
      cy.get('button').click()
    })
    cy.getCampoSenha().within(() => {
      cy.xpath('/html/body/app-root/app-login/div/app-public/div/div/div/div/div[2]/div/div[3]/app-password-input-floating-label/div[2]')
        .contains('Campo obrigatório')
        .should('be.visible')
    })
  })

  it('CT-03-3-Login Obritório', () => {
    cy.getCampoSenha().within(() => {
      cy.get('input').type('Otimiza@1')
    })
    cy.get('app-btn-primary').first().within(() => {
      cy.get('button').click()
    })
    cy.getCampoLogin().within(() => {
      cy.xpath('/html/body/app-root/app-login/div/app-public/div/div/div/div/div[2]/div/div[2]/app-input-floating-label/div[2]')
        .contains('Campo obrigatório')
        .should('be.visible')
    })
  })

  it('CT-03-4-Login ou Senha Incorreto', () => {

    cy.fixture("dadosLogin").then((dados) => {

      const loginValido = dados.loginValido;
      const senhaErrada = { ...dados.loginValido, password: 'Otm@1' }
      cy.getCampoLogin().within(() => {
        cy.get('input').type(loginValido.username)
      })
      cy.getCampoSenha().within(() => {
        cy.get('input').type(senhaErrada.password)
      })
      cy.get('app-btn-primary').first().within(() => {
        cy.get('button').click()
      })
      cy.get('div').contains('Usuário não autorizado a realizar a migração. (1463056)').should('be.visible')

      //validação da resposta da API
      cy.request({
        method: 'GET',
        url: 'http://sgvapi-homologacao2.otimizasistemas.com.br/autenticacao/login',
        qs: senhaErrada,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      })


    })
  })

  it('CT-03-5-Usuario não existe', () => {
    cy.getCampoLogin().within(() => {
      cy.get('input').type('sgvusuario')
    })
    cy.getCampoSenha().within(() => {
      cy.get('input').type('Otimiza@1')
    })
    cy.get('app-btn-primary').first().within(() => {
      cy.get('button').click()
    })
    cy.get('div').contains('O usuário não foi encontrado no banco de dados. Verifique os dados informados. (1463018)').should('be.visible')
  })

  it('CT-04-1-Login com Sucesso', () => {
    cy.getCampoLogin().within(() => {
      cy.get('input').type('izack.sc')
    })
    cy.getCampoSenha().within(() => {
      cy.get('input').type('Otimiza@1')
    })
    cy.get('app-btn-primary').first().within(() => {
      cy.get('button').click()
    })
    cy.url().should('eq', 'http://sgv2.otimizasistemas.com.br/#/pages/videos/videos')
  })

/*  it.only('CT-05-Verificar Acessibilidade',()=>{
    cy.checkA11y()
  })*/
});
