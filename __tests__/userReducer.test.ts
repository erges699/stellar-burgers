// __tests__/userReducer.test.ts

import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  registerUserApiAsync,
  loginUserApiAsync,
  logoutUserApiAsync,
  updateUserApiAsync,
  forgotPasswordApiAsync,
  resetPasswordApiAsync,
  checkUserAuthAsync
} from '../src/services/slices/userSlice';

// 🔽 Импортируем мокируемые функции — важно для TypeScript
import { setCookie, deleteCookie } from '../__mocks__/utils/cookie';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../src/utils/burger-api';

// Утилиты для моков
const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Тесты экшенов клиента', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks(); // Сбрасываем моки перед каждым тестом
  });

  // Тесты для логина
  describe('Тесты экшена запроса логина', () => {
    test('Тест экшена успешного логина', async () => {
      // Настраиваем мок API
      loginUserApi.mockResolvedValue({
        success: true,
        accessToken: 'Bearer fake-jwt',
        refreshToken: 'fake-refresh-123',
        user: { email: 'test@mail.ru', name: 'test' }
      });

      // Диспатчим асинхронный экшен
      await store.dispatch(
        loginUserApiAsync({ email: 'test@mail.ru', password: '123' }) as any
      );

      const state = store.getState().user;

      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual({ email: 'test@mail.ru', name: 'test' });
      expect(state.isAuthorized).toBeTruthy();

      // Проверяем побочные эффекты
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'Bearer fake-jwt');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'fake-refresh-123'
      );
    });

    test('Тест экшена ошибки при логине', async () => {
      loginUserApi.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        store.dispatch(
          loginUserApiAsync({ email: 'wrong', password: 'wrong' }) as any
        )
      ).rejects.toThrow();

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe('Invalid credentials');
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });

  // Тесты для регистрации
  describe('Тест экшена запроса регистрации', () => {
    test('Тест экшена успешной регистрации', async () => {
      registerUserApi.mockResolvedValue({
        success: true,
        accessToken: 'Bearer fake-jwt',
        refreshToken: 'fake-refresh-123',
        user: { email: 'new@mail.ru', name: 'new' }
      });

      await store.dispatch(
        registerUserApiAsync({
          email: 'new@mail.ru',
          password: '123',
          name: 'new'
        }) as any
      );

      const state = store.getState().user;

      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual({ email: 'new@mail.ru', name: 'new' });
      expect(state.isAuthorized).toBeTruthy();

      expect(setCookie).toHaveBeenCalledWith('accessToken', 'Bearer fake-jwt');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'fake-refresh-123'
      );
    });

    test('Тест экшена ошибки при регистрации', async () => {
      registerUserApi.mockRejectedValue(new Error('Email already exists'));

      await expect(
        store.dispatch(
          registerUserApiAsync({
            email: 'exists@mail.ru',
            password: '123',
            name: 'test'
          }) as any
        )
      ).rejects.toThrow();

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe('Email already exists');
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });

  // Тесты для логаута
  describe('Тест экшена запроса логаута', () => {
    test('Тест экшена успешного логаута', async () => {
      logoutApi.mockResolvedValue({ success: true, message: 'Logout OK' });

      // Предварительно авторизуем пользователя
      store.dispatch({
        type: loginUserApiAsync.fulfilled.type,
        payload: {
          accessToken: 'fake',
          refreshToken: 'fake',
          user: { email: 'test@mail.ru', name: 'test' }
        }
      });

      await store.dispatch(logoutUserApiAsync() as any);

      const state = store.getState().user;
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
      expect(state.isLoading).toBeFalsy();

      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  // Тесты для обновления профиля
  describe('Тест экшена запроса изменения данных клиента', () => {
    test('Тест экшена успешного изменения данных клиента', async () => {
      updateUserApi.mockResolvedValue({
        success: true,
        user: { email: 'updated@mail.ru', name: 'updated' }
      });

      // Предварительная авторизация
      store.dispatch({
        type: loginUserApiAsync.fulfilled.type,
        payload: {
          accessToken: 'fake',
          refreshToken: 'fake',
          user: { email: 'old@mail.ru', name: 'old' }
        }
      });

      await store.dispatch(
        updateUserApiAsync({ email: 'updated@mail.ru', name: 'updated' }) as any
      );

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.user).toEqual({ email: 'updated@mail.ru', name: 'updated' });
      expect(state.isAuthorized).toBeTruthy();
    });
  });

  // Тесты для восстановления пароля
  describe('Тест экшена запроса восстановления пароля', () => {
    test('Тест экшена успешного восстановления пароля', async () => {
      forgotPasswordApi.mockResolvedValue({
        success: true,
        message: 'Reset email sent'
      });

      await store.dispatch(
        forgotPasswordApiAsync({ email: 'test@mail.ru' }) as any
      );

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });

  // Тесты для сброса пароля
  describe('Тест экшена запроса изменения пароля', () => {
    test('Тест экшена успешного изменения пароля', async () => {
      resetPasswordApi.mockResolvedValue({
        success: true,
        message: 'Password reset'
      });

      await store.dispatch(
        resetPasswordApiAsync({
          password: 'new123',
          token: 'reset-token'
        }) as any
      );

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });

  // Тесты для проверки авторизации
  describe('Тест экшена запроса данных пользователя', () => {
    test('Тест экшена успешного запроса данных пользователя', async () => {
      // Мокаем наличие токена
      (getCookie as jest.Mock).mockReturnValue('Bearer fake-jwt');
      getUserApi.mockResolvedValue({
        success: true,
        user: { email: 'test@mail.ru', name: 'test' }
      });

      await store.dispatch(checkUserAuthAsync() as any);

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual({ email: 'test@mail.ru', name: 'test' });
      expect(state.isAuthorized).toBeTruthy();
    });

    test('Тест экшена при отсутствии токена', async () => {
      (getCookie as jest.Mock).mockReturnValue(undefined);

      await store.dispatch(checkUserAuthAsync() as any);

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });
});
