import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  getOrderByNumberApiAsync
} from '../src/services/slices/ordersSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

describe('Тесты экшена getOrderByNumberApiAsync', () => {
  let store: ReturnType<typeof setupStore>;
  const orderId = 37596; // это аргумент, который передаётся в thunk
  const requestId = 'test-request-id'; // можно любую строку

  beforeEach(() => {
    store = setupStore();
  });

  test('должен установить isLoading: true при pending', () => {
    store.dispatch(getOrderByNumberApiAsync.pending(requestId, orderId));

    const state = store.getState().order;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен установить ошибку при rejected', () => {
    const error = 'Network error';
    store.dispatch(
      getOrderByNumberApiAsync.rejected(new Error(error), requestId, orderId)
    );

    const state = store.getState().order;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });

  test('должен сохранить первый заказ при fulfilled', () => {
    const mockedPayload = {
      success: true,
      orders: [
        {
          _id: '660e81bb97ede0001d0643eb',
          ingredients: [
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa093d'
          ],
          owner: '65db1c0a97ede0001d05e2d6',
          status: 'done',
          name: 'Space флюоресцентный бургер',
          createdAt: '2024-04-04T10:32:27.595Z',
          updatedAt: '2024-04-04T10:32:28.181Z',
          number: 37596
        }
      ]
    };

    store.dispatch(
      getOrderByNumberApiAsync.fulfilled(mockedPayload, requestId, orderId)
    );

    const state = store.getState().order;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orderModalData).toEqual(mockedPayload.orders[0]);
  });
});
