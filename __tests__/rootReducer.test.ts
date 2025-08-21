import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '../src/services/store';
import ingredientsInitialState from '../src/services/slices/ingredientsSlice';
import constructorInitialState from '../src/services/slices/constructorSlice';
import feedsInitialState from '../src/services/slices/feedsSlice';
import ordersInitialState from '../src/services/slices/ordersSlice';
import userInitialState from '../src/services/slices/userSlice';

describe('Тест корневого редьюсера', () => {
  const initialState = {
    user: { ...userInitialState },
    feed: { ...feedsInitialState },
    order: { ...ordersInitialState },
    ingredients: { ...ingredientsInitialState },
    constructorbg: { ...constructorInitialState }
  };
  test('Тест инициализации корневого редьюсера', () => {
    const action = { type: 'UNKNOW_ACTION' };
    const newState = rootReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });
});
