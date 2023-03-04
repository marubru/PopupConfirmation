describe('Popup', () => {

    const pageUrl = `http://localhost:4000/`

    beforeEach(() => {
        cy.clearLocalStorage();

        // mock for happy scenarios
        cy.intercept('GET', '/popup', {
            body: {
                message: '<p>TESTMESSAGE</p>'
            },
        });
        cy.intercept('POST', '/popup/confirmation', {
            body: {
                confirmationTracked: true
            },
        });
    });

    it('should be shown when page is loaded for first time', () => {
        cy.visit(pageUrl);
        cy.get('#popup').should("exist");
    });

    it('should close once clicked on close button', () => {
        cy.visit(pageUrl);
        cy.get('#close').click();
        cy.get('#popup').should("not.be.visible");
    });

    it('should close once clicked outside the popup', () => {
        cy.visit(pageUrl);
        cy.get('#popup').click();
        cy.get('#popup').should("not.be.visible");
    });

    it('should open with message text from API', () => {
        cy.visit(pageUrl);
        cy.get('#popup').should("be.visible");
        cy.get('#message2').should('contain.html', '<p>TESTMESSAGE</p>');
    });

    it('should not open when API request fails', () => {
        cy.intercept('GET', '/popup', {
            statusCode: 500
        });

        cy.visit(pageUrl);
        cy.get('#popup').should("not.exist");
    });

    it('should close once clicked on confirm and successful API confirmation', () => {
        cy.visit(pageUrl);
        cy.get('#confirm').click();
        cy.get('#popup').should("not.be.visible");
    });

    it('should not close once clicked on confirm and failed API confirmation', () => {
        cy.intercept('POST', '/popup/confirmation', {
            statusCode: 500
        });

        cy.visit(pageUrl);
        cy.get('#popup').should("be.visible");
        cy.get('#confirm').click();
        cy.get('#popup').should("be.visible");
    });

    it('should be not shown when page is reloaded after confirmation', () => {
        cy.visit(pageUrl);
        cy.get('#popup').should("be.visible");
        cy.get('#confirm').click();
        cy.reload();
        cy.get('#popup').should("not.exist");
    });

    it('should be not shown when page is loaded but it was already confirmed in past 10 minutes', () => {
        // proper would be to inject timestamp into localStorage before visiting page
        cy.visit(pageUrl);
        cy.get('#popup').should("be.visible");
        cy.get('#confirm').click();
        cy.reload();
        cy.get('#popup').should("not.exist");
    });

    /* please implement any additional scenario you consider as needed to ensure good test coverage */
});

