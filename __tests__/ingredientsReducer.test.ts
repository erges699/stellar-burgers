import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { getIngredientsAsync } from '../src/services/slices/ingredientsSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {}
        }
      })
  });

describe('Тесты экшенов ингредиентов', () => {
  describe('Тесты экшена получения ингредиентов', () => {
    test('Тест экшена pending — установка состояния загрузки', () => {
      const store = setupStore();
      store.dispatch(getIngredientsAsync.pending('', undefined));
      const state = store.getState().ingredients;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('Тест экшена rejected — установка ошибки', () => {
      const store = setupStore();
      const error = 'Не удалось загрузить ингредиенты';
      store.dispatch(
        getIngredientsAsync.rejected(new Error(error), '', undefined, { message: error })
      );
      const state = store.getState().ingredients;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });

    test('Тест экшена fulfilled — успешная загрузка ингредиентов', () => {
      const mockedPayload = [
        {
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
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        }
      ];

      const store = setupStore();
      store.dispatch(getIngredientsAsync.fulfilled(mockedPayload, '', undefined));
      const state = store.getState().ingredients;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockedPayload);
    });
  });
});
