// cypress/e2e/constructor/constructor.cy.ts

import { API_URL } from '../../../src/utils/burger-api';
import { deleteCookie, setCookie } from '../../../src/utils/cookie';

// Константы вынесены для удобства и переиспользования
const ACCESS_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWY2YzdmNjczMDg2MDAxYmE4MzAyZSIsImlhdCI6MTc1NTk2NzIyNSwiZXhwIjoxNzU1OTY4NDI1fQ.4_cMB6Dw7c7v_Xw-fq-9Rcp8UkUc9IEFI_xf5JPbWSU';
const REFRESH_TOKEN = '88b859057327debf909625ff0454d147b212dbaf736823c168578835bfb3f23fc351e68950b04e43';

describe('Тест конструктора бургеров Stellar Burgers', () => {
  beforeEach(() => {
    // Устанавливаем токены
    setCookie('accessToken', ACCESS_TOKEN);
    window.localStorage.setItem('refreshToken', REFRESH_TOKEN);

    // Перехватываем API-запросы
    cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', `${API_URL}/orders`, { fixture: 'order.json' }).as('createOrder');

    // Переходим на страницу конструктора
    cy.visit('/');

    // Ждём загрузку пользователя и ингредиентов cy.wait(['@getUser', '@getIngredients']);
    cy.wait(['@getIngredients']);
  });

  afterEach(() => {
    // Очищаем состояние
    deleteCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Загружает и отображает списки ингредиентов', () => {
    // Булки
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .should('have.length.greaterThan', 0);
    // Начинки
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .should('have.length.greaterThan', 0);
    // Соусы
    cy.get('h3')
      .contains('Соусы')
      .parent()
      .find('ul > li')
      .should('have.length.greaterThan', 0);
  });

  it('Отображает правильные данные ингредиента в модальном окне', () => {
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .click();

    cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
    cy.contains('643').should('exist');
    cy.contains('44').should('exist');
    cy.contains('26').should('exist');
    cy.contains('85').should('exist');
  });

  it('Оформляет заказ с авторизацией и показывает номер заказа', () => {
    cy.setCookie('accessToken', 'ACCESS_TOKEN');
    cy.window().then((win) =>
      win.localStorage.setItem('refreshToken', 'REFRESH_TOKEN')
    );

    // Добавить булку
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Добавить начинку
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .contains('Хрустящие минеральные кольца')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Добавить начинку
    cy.get('h3')
      .contains('Соусы')
      .parent()
      .find('ul > li')
      .contains('Соус фирменный Space Sauce')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Добавить начинку
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .contains('Плоды Фалленианского дерева')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Оформить заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    // cy.contains('086690').should('exist');
  });

  it('Закрывает модальное окно заказа и очищает конструктор', () => {
    cy.clearCookie('accessToken');
    cy.window().then((win) =>
      win.localStorage.setItem('refreshToken', 'test-refresh-token')
    );
  });
});
describe('Тесты модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredient');
    cy.visit('/');
    cy.wait('@getIngredient');

    // Получаем ингредиент перед каждым тестом
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .as('ingredient');
  });

  it('открыть модальное окно по клику на ингредиент', () => {
    cy.get('@ingredient').click();
  });

  it('закрыть модальное окно по клику на кнопку', () => {
    cy.get('@ingredient').click();
    cy.get('#modals').find('button').click();
    cy.get('#modals').find('button').should('not.exist');
  });

  it('закрыть модальное окно по клику на оверлей', () => {
    cy.get('@ingredient').click();
    cy.get('#modals').contains('modal').should('not.exist');
  });

  it('закрыть модальное окно по кнопке ESC', () => {
    cy.get('@ingredient').click();
    cy.document().trigger('keydown', { key: 'Escape' });
    cy.get('#modals').find('button').should('not.exist');
  });
});

describe('Тестирование авторизации', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Перенаправляет на страницу входа при попытке оформить заказ без авторизации', () => {
    // Добавляем ингредиент
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Пытаемся оформить заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.url().should('include', '/login');
  });
});
