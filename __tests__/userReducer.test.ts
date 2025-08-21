import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  loginUserApiAsync,
  registerUserApiAsync,
  logoutUserApiAsync,
  updateUserApiAsync,
  forgotPasswordApiAsync,
  resetPasswordApiAsync,
  checkUserAuthAsync
} from '../src/services/slices/userSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Тесты экшенов клиента', () => {
  const mockSet = jest.fn();

  describe('Тесты экшена запроса логина', () => {
    test('Тест экшена ожидания ответ после запроса логина', () => {
      const store = setupStore();
      store.dispatch({ type: loginUserApiAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса логина', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: loginUserApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешного логина', () => {
      const mockedPayload = {
        accessToken:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjBhMDAyOTdlZGUwMDAxZDA2MDg1NCIsImlhdCI6MTcxMjIyODc2MywiZXhwIjoxNzEyMjI5OTYzfQ.NnIdUkIZ8gHHicj86d2Xrxxz5wxTqJyghFfyU9ZQ6E0',
        refreshToken:
          'cae7fbb0ce188f2c244e611b328ae4869b892902b1ba10c81cee99194854b1d3c192e0bfc9b90b06',
        user: {
          email: 'lleksiv@gmail.com',
          name: 'Georg Shakillow'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: loginUserApiAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });

  describe('Тест экшена запроса регистрации', () => {
    test('Тест экшена ожидания ответ после запроса регистрации', () => {
      const store = setupStore();
      store.dispatch({ type: registerUserApiAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса регистрации', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: registerUserApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешной регистрации', () => {
      const mockedPayload = {
        accessToken:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWY2YzdmNjczMDg2MDAxYmE4MzAyZSIsImlhdCI6MTc1NTc3NzY1NywiZXhwIjoxNzU1Nzc4ODU3fQ.lQepWlc5pKZTVba-t6h_VB4vXuP6ZG51gB0amNqASxw',
        refreshToken:
          '41b53c5d0992434b48507e04c0a0843b46b8a096758ee8ac92f7ee51e039e164b26912e8361f96c9',
        user: {
          email: 'test20250815@mail.ru',
          name: 'test20250815'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: registerUserApiAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      // expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });

  describe('Тест экшена запроса логаута', () => {
    test('Тест экшена ожидания ответ после запроса логаута', () => {
      const store = setupStore();
      store.dispatch({ type: logoutUserApiAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса логаута', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: logoutUserApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешного логаута', () => {
      const mockedPayload = {
        message: 'Successful logout'
      };
      const store = setupStore();
      store.dispatch({
        type: logoutUserApiAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBeFalsy();
    });
  });

  describe('Тест экшена запроса изменения данных клиента', () => {
    test('Тест экшена ожидания ответ после запроса изменения данных клиента', () => {
      const store = setupStore();
      store.dispatch({ type: updateUserApiAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса изменения данных клиента', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: updateUserApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешного изменения данных клиента', () => {
      const mockedPayload = {
        user: {
          email: 'test20250815@mail.ru',
          name: 'test20250815'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: updateUserApiAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      // expect(state.user.isAuthorized).toBeTruthy();
    });
  });

  describe('Тест экшена запроса восстановления пароля', () => {
    test('Тест экшена ожидания ответ после запроса восстановления пароля', () => {
      const store = setupStore();
      store.dispatch({ type: forgotPasswordApiAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса восстановления пароля', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: forgotPasswordApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешного восстановления пароля', () => {
      const mockedPayload = {
        message: 'Reset email sent'
      };
      const store = setupStore();
      store.dispatch({
        type: forgotPasswordApiAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBeFalsy();
    });
  });

  describe('Тест экшена запроса изменения пароля', () => {
    test('Тест экшена ожидания ответ после запроса изменения пароля', () => {
      const store = setupStore();
      store.dispatch({ type: resetPasswordApiAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса изменения пароля', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: resetPasswordApiAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешного изменения пароля', () => {
      const mockedPayload = {
        message: 'Password successfully reset'
      };
      const store = setupStore();
      store.dispatch({
        type: resetPasswordApiAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBeFalsy();
    });
  });

  describe('Тест экшена запроса данных пользователя', () => {
    test('Тест экшена ожидания ответ после запроса данных пользователя', () => {
      const store = setupStore();
      store.dispatch({ type: checkUserAuthAsync.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBeTruthy();
      expect(state.user.error).toBeNull();
    });
    test('Тест экшена ошибки после запроса данных пользователя', () => {
      const store = setupStore();
      const error = 'mocked error';
      store.dispatch({
        type: checkUserAuthAsync.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBe(error);
    });
    test('Тест экшена успешного запроса данных пользователя', () => {
      const mockedPayload = {
        user: {
          email: 'test20250815@mail.ru',
          name: 'test20250815'
        }
      };
      const store = setupStore();
      store.dispatch({
        type: checkUserAuthAsync.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBeFalsy();
      expect(state.user.error).toBeNull();
      // expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBeTruthy();
    });
  });
});
