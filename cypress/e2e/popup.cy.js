describe('Popup', () => {

    const pageUrl = `http://localhost:4000/`

    it('should be shown when page is loaded for first time', async () => {
        cy.visit(pageUrl);
        cy.get('#popup').should("exist");
    });

    it('should close once clicked on close button', async () => {
        cy.visit(pageUrl);
        cy.get('#close').click();
        cy.get('#popup').should("not.exist");
    });

    it('should close once clicked outside the popup', async () => {
       cy.visit(pageUrl);
       cy.get('#popup').click();
       cy.get('#popup').should("not.exist");
    });


    it('should be not shown when page is reloaded after confirmation', async () => {
        cy.visit(pageUrl);
        cy.get('#confirm').click();
        cy.reload();
        cy.get('#popup').should("not.exist");
    });

    it('should be not shown when page is loaded but it was already confirmed in past 10 minutes', async () => {
        cy.visit(pageUrl);
        cy.get('#confirm').click();
        cy.reload();
        cy.get('#popup').should("not.exist");
    });

    /* please implement any additional scenario you consider as needed to ensure good test coverage */
});

