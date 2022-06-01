/* eslint-disable no-undef */
/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('Inline XBRL Viewer', () => {
  before(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000/?doc=/assets/example-1/aapl-20211225.htm');
    cy.wait(3000);
  });

  it('Renders Navbar', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('#navbar-container .navbar').should('have.length', 1);

    cy.get('#navbar-container .navbar li.nav-item')
      .should('be.visible')
      .should('have.length', 8);

    cy.get('#navbar-container .navbar .nav-item .nav-link')
      .should('be.visible')
      .should('have.length', 8);

    cy.get('#navbar-container #menu-button').contains('Menu');

    cy.get('#navbar-container .navbar .nav-item .nav-link')
      .eq(1)
      .contains('Sections');

    cy.get('#navbar-container .navbar #global-search').should('have.length', 1);

    cy.get('#navbar-container .navbar .nav-item .nav-link')
      .eq(2)
      .contains('Data');

    cy.get('#navbar-container .navbar .nav-item .nav-link')
      .eq(3)
      .contains('Tags');

    cy.get('#navbar-container .navbar .nav-item .nav-link')
      .eq(4)
      .contains('More Filters');

    cy.get('#navbar-container .navbar .nav-item .nav-link')
      .eq(7)
      .contains('Facts');
  });

  it('Menu Dropdown is enabled', () => {
    cy.get('#navbar-container #menu-button').should(
      'have.not.class',
      'disabled'
    );
  });

  it('Sections button is enabled', () => {
    cy.get('#navbar-container #sections-button').should(
      'have.not.class',
      'disabled'
    );
  });

  it('Entire Search Bar is enabled', () => {
    cy.get('#navbar-container #global-search fieldset').should(
      'have.not.attr',
      'disabled'
    );
  });

  it('Data Dropdown is enabled', () => {
    cy.get('#navbar-container #data-button').should(
      'have.not.class',
      'disabled'
    );
  });

  it('Tags Dropdown is enabled', () => {
    cy.get('#navbar-container #tags-button').should(
      'have.not.class',
      'disabled'
    );
  });

  it('More Filters Dropdown is enabled', () => {
    cy.get('#navbar-container #more-filters-button').should(
      'have.not.class',
      'disabled'
    );
  });

  it('More Filters Dropdown is enabled', () => {
    cy.get('#navbar-container #more-filters-button').should(
      'have.not.class',
      'disabled'
    );
  });

  it('Reset All Filters is hidden', () => {
    cy.get('#navbar-container #reset-all-filters-button').should('be.hidden');
  });

  it('Links is hidden', () => {
    cy.get('#navbar-container #links-button').should('be.hidden');
  });

  it('Facts button is enabled', () => {
    cy.get('#navbar-container #facts-button').should(
      'have.not.class',
      'disabled'
    );
  });
});
