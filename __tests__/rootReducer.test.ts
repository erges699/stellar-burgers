import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '../src/services/store';
import { userInitialState } from '../src/services/slices/userSlice';
import { feedsInitialState } from '../src/services/slices/feedsSlice';
import { ordersInitialState } from '../src/services/slices/ordersSlice';
import { ingredientsInitialState } from '../src/services/slices/ingredientsSlice';
import { constructorInitialState } from '../src/services/slices/constructorSlice';

describe('Тест корневого редьюсера', () => {
  test('Должен возвращать начальное состояние при инициализации', () => {
    const action = { type: '@@INIT' };
    const result = rootReducer(undefined, action);

    expect(result.user).toEqual(userInitialState());
    expect(result.feeds).toEqual(feedsInitialState());
    expect(result.orders).toEqual(ordersInitialState());
    expect(result.ingredients).toEqual(ingredientsInitialState());
    expect(result.burgerConstructor).toEqual(constructorInitialState());
  });

  test('Не должен изменять состояние при неизвестном действии', () => {
    const previousState = {
      user: userInitialState(),
      feeds: feedsInitialState(),
      orders: ordersInitialState(),
      ingredients: ingredientsInitialState(),
      burgerConstructor: constructorInitialState()
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(previousState, action);

    expect(result).toBe(previousState); // Проверка на отсутствие мутаций
  });
});
