import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { getFeedsApiAsync } from '../src/services/slices/feedsSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer
    }
  });

describe('Тесты экшенов ленты', () => {
  describe('getFeedsApiAsync', () => {
    test('должен установить isLoading = true при pending', () => {
      const store = setupStore();
      store.dispatch({ type: getFeedsApiAsync.pending.type });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(true);
      expect(state.feed.error).toBeNull();
    });

    test('должен установить error при rejected', () => {
      const store = setupStore();
      const error = 'Network error';
      store.dispatch({
        type: getFeedsApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(false);
      expect(state.feed.error).toBe(error);
    });

    test('должен обновить orders, total и totalToday при fulfilled', () => {
      const mockedPayload = {
        success: true,
        orders: [
          {
            _id: '660e7df397ede0001d0643df',
            ingredients: [
              '643d69a5c3f7b9001cfa0943',
              '643d69a5c3f7b9001cfa093d',
              '643d69a5c3f7b9001cfa093d'
            ],
            status: 'done',
            name: 'Space флюоресцентный бургер',
            createdAt: '2024-04-04T10:16:19.376Z',
            updatedAt: '2024-04-04T10:16:19.994Z',
            number: 37593
          }
        ],
        total: 37601,
        totalToday: 45
      };

      const store = setupStore();
      store.dispatch(
        getFeedsApiAsync.fulfilled(mockedPayload, '', undefined)
      );

      const state = store.getState();
      expect(state.feed.isLoading).toBe(false);
      expect(state.feed.error).toBeNull();
      expect(state.feed.orders).toEqual(mockedPayload.orders);
      expect(state.feed.total).toBe(mockedPayload.total);
      expect(state.feed.totalToday).toBe(mockedPayload.totalToday);
    });
  });
});
