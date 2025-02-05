
//localizar o campo de login
Cypress.Commands.add('getCampoLogin', () => {
    return cy.get('app-input-floating-label')
})

//localizar campo de senha
Cypress.Commands.add('getCampoSenha', () => {
    return cy.get('app-password-input-floating-label')
})