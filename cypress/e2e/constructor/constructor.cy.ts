// cypress/e2e/constructor/constructor.cy.ts

import { API_URL } from '../../../src/utils/burger-api';
import { deleteCookie, setCookie } from '../../../src/utils/cookie';

// Константы вынесены для удобства и переиспользования
const ACCESS_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjBhMDAyOTdlZGUwMDAxZDA2MDg1NCIsImlhdCI6MTcxMjMxMDE2NiwiZXhwIjoxNzEyMzExMzY2fQ.v7kdecJvLfdmlBsvf_BySvsfnXX3K0Er__GNYw-NRLM';
const REFRESH_TOKEN = '9cbdd5b777edfb92bd9183a7cf2372a12b545c045a9796f94c1afd0b9d374a8794aa15bee20a7556';

describe('Тест конструктора бургеров', () => {
  beforeEach(() => {
    // Устанавливаем токены
    setCookie('accessToken', ACCESS_TOKEN);
    window.localStorage.setItem('refreshToken', REFRESH_TOKEN);

    // Перехватываем API-запросы
    cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', `${API_URL}/orders`, { fixture: 'order.json' }).as('createOrder');

    // Переходим на страницу конструктора
    cy.visit('http://localhost:4000');

    // Ждём загрузку пользователя и ингредиентов
    cy.wait(['@getUser', '@getIngredients']);
  });

  afterEach(() => {
    // Очищаем состояние
    deleteCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Тест отображения ингредиентов и добавления в конструктор', () => {
    // Проверяем, что ингредиенты загружены
    cy.get('[data-cy="ingredient-item"]')
      .should('have.length.greaterThan', 0)
      .first()
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем, что булка добавилась сверху и снизу
    cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');

    // Добавляем начинку
    cy.get('[data-cy="ingredient-item"]').contains('Биокотлета из марсианской Магнолии').click();
    cy.get('[data-cy="constructor-filling"]').should('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('Тест открытия и закрытия модального окна ингредиента', () => {
    // Открываем модальное окно по клику
    cy.get('[data-cy="ingredient-item"]').first().click();

    // Проверяем видимость модалки и содержимое
    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
        cy.get('[data-cy="modal-close"]').click();
      });

    // Проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');

    // Повторно открываем
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем кликом по оверлею
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Тест создания заказа', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-item"]').contains('Краторная булка N-200i').click();
    cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');

    // Добавляем начинку
    cy.get('[data-cy="ingredient-item"]').contains('Биокотлета из марсианской Магнолии').click();
    cy.get('[data-cy="constructor-filling"]').should('contain', 'Биокотлета из марсианской Магнолии');

    // Нажимаем "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();

    // Ждём успешного запроса на создание заказа
    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    // Проверяем, что модальное окно заказа открылось и содержит номер
    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .within(() => {
        cy.contains('37865').should('be.visible');
        cy.get('[data-cy="modal-close"]').click();
      });

    // Проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился (кроме булок — они остаются, но начинки убираются)
    cy.get('[data-cy="constructor-filling"]').should('not.exist');
  });
});
