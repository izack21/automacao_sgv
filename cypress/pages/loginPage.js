
class LoginPage {
  visitPageLogin() {
    cy.visit(Cypress.env('login_url'))
  }

  fillLoginForm(username, password) {
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  }
}

export default new LoginPage();
