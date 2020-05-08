describe('Test Movie Voting App', () => {
  it('renders without an issue', () => {
    cy.visit('/')
  })

  it('renders 3 movies with 4 vote buttons', () => {
    cy.get('.card').should('have.length', 3)
    cy.get('.card button').should('have.length', 4)
  })

  it('is able to make api call', () => {
    cy.request(Cypress.env('apiUrl')).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})