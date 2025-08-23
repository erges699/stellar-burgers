import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  upIngredient,
  downIngredient,
  clearConstructor
} from '../src/services/slices/constructorSlice';
import type { TConstructorState } from '../src/services/slices/constructorSlice';
import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../src/utils/types';

// Мокаем nanoid для предсказуемости
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => 'mockedID')
}));

describe('Тест редьюсера конструктора бургера', () => {
  const mockBun: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: '0'
  };

  const mockSauce: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    id: '1'
  };

  const mockMain: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: '2'
  };

  const startState: TConstructorState = {
    bun: mockBun,
    ingredients: [mockSauce, mockMain]
  };

  describe('Тест экшена addIngredient', () => {
    test('Добавление булки не генерирует id', () => {
      const newBun = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R1',
        type: 'bun',
        proteins: 40,
        fat: 16,
        carbohydrates: 42,
        calories: 370,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      };

      const newState = constructorReducer(startState, addIngredient(newBun));

      expect(nanoid).not.toHaveBeenCalled();
      expect(newState.bun?.name).toBe(newBun.name);
    });

    test('Добавление начинки добавляет её с уникальным id', () => {
      const newIngredient = {
        _id: '643d69a5c3f7b9001cfa093e',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
      };

      const newState = constructorReducer(
        startState,
        addIngredient(newIngredient)
      );

      expect(nanoid).toHaveBeenCalled();
      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[2]).toEqual({
        ...newIngredient,
        id: 'mockedID'
      });
    });
  });

  describe('Тест экшена removeIngredient', () => {
    test('Удаление ингредиента по id', () => {
      const newState = constructorReducer(startState, removeIngredient('1'));

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].id).toBe('2');
    });
  });

  describe('Тест экшенов изменения порядка ингредиентов', () => {
    test('Перемещение ингредиента вверх по индексу', () => {
      const index = 1; // Перемещаем элемент с индексом 1 вверх
      const expectedState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockMain, mockSauce] // Поменяли местами
      };

      const newState = constructorReducer(startState, upIngredient(index));

      expect(newState).toEqual(expectedState);
    });

    test('Перемещение ингредиента вниз по индексу', () => {
      const index = 0; // Перемещаем элемент с индексом 0 вниз
      const expectedState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockMain, mockSauce]
      };

      const newState = constructorReducer(startState, downIngredient(index));

      expect(newState).toEqual(expectedState);
    });

    test('Нельзя переместить первый элемент вверх', () => {
      const index = 0;
      const newState = constructorReducer(startState, upIngredient(index));

      expect(newState).toEqual(startState); // Состояние не изменилось
    });

    test('Нельзя переместить последний элемент вниз', () => {
      const index = 1; // последний индекс (в массиве длины 2)
      const newState = constructorReducer(startState, downIngredient(index));

      // Ожидаем, что состояние НЕ изменилось
      expect(newState).toEqual(startState);
    });

    test('Нельзя переместить единственный ингредиент вниз', () => {
      const singleState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockSauce]
      };

      const newState = constructorReducer(singleState, downIngredient(0));

      expect(newState).toEqual(singleState); // Состояние не изменилось
    });
  });

  describe('Тест экшена clearConstructor', () => {
    test('Сброс состояния конструктора до начального', () => {
      const newState = constructorReducer(startState, clearConstructor());

      expect(newState).toEqual({
        bun: null,
        ingredients: []
      });
    });
  });
});
