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

// Мокаем API и утилиты
jest.mock('../src/utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

jest.mock('../src/utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

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
    jest.clearAllMocks();
  });

  describe('Тесты экшена запроса логина', () => {
    test('Тест экшена ожидания ответ после запроса логина', async () => {
      const mockLoginApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'loginUserApi'
      );
      mockLoginApi.mockResolvedValue({
        success: true,
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user: { email: 'test@mail.ru', name: 'test' }
      });

      await store.dispatch(
        loginUserApiAsync({ email: 'test@mail.ru', password: '123' }) as any
      );

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy(); // pending → fulfilled
    });

    test('Тест экшена ошибки после запроса логина', async () => {
      const mockLoginApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'loginUserApi'
      );
      mockLoginApi.mockRejectedValue(new Error('Invalid credentials'));

      // Диспатчим асинхронный экшен
      const action = loginUserApiAsync({ email: 'wrong', password: 'wrong' });
      const result = await store.dispatch(action);

      // Проверяем, что экшен вернул rejectWithValue
      expect(result.type).toBe('user/loginUser/rejected');
      expect(result.error?.message).toBe('Invalid credentials');

      // Проверяем состояние
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe('Invalid credentials');
    });

    test('Тест экшена успешного логина', async () => {
      const mockLoginApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'loginUserApi'
      );
      const mockSetCookie = jest.spyOn(
        require('../src/utils/cookie'),
        'setCookie'
      );
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');

      const mockResponse = {
        success: true,
        accessToken: 'Bearer fake-jwt',
        refreshToken: 'fake-refresh-123',
        user: { email: 'test@mail.ru', name: 'test' }
      };

      mockLoginApi.mockResolvedValue(mockResponse);

      await store.dispatch(
        loginUserApiAsync({ email: 'test@mail.ru', password: '123' }) as any
      );

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockResponse.user);
      expect(state.isAuthorized).toBeTruthy();

      // Проверяем побочные эффекты
      expect(mockSetCookie).toHaveBeenCalledWith(
        'accessToken',
        'Bearer fake-jwt'
      );
      expect(mockSetItem).toHaveBeenCalledWith(
        'refreshToken',
        'fake-refresh-123'
      );
    });
  });

  describe('Тест экшена запроса регистрации', () => {
    test('Тест экшена ожидания ответ после запроса регистрации', async () => {
      const mockRegisterApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'registerUserApi'
      );
      mockRegisterApi.mockResolvedValue({
        success: true,
        accessToken: 'fake-access',
        refreshToken: 'fake-refresh',
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
    });

    test('Тест экшена ошибки после запроса регистрации', async () => {
      const mockRegisterApi = jest.spyOn(require('../src/utils/burger-api'), 'registerUserApi');
      mockRegisterApi.mockRejectedValue(new Error('Email already exists'));

      const action = registerUserApiAsync({
        email: 'exists@mail.ru',
        password: '123',
        name: 'test'
      });

      const result = await store.dispatch(action);

      if (result.type === 'user/register/rejected') {
        // В этом блоке TypeScript знает, что есть error
        expect(result.error?.message).toBe('Email already exists');
      }

      // Проверка типа действия
      expect(result.type).toBe('user/registerUser/rejected');

      // Проверка состояния
      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBe('Email already exists');
    });

    test('Тест экшена успешной регистрации', async () => {
      const mockRegisterApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'registerUserApi'
      );
      const mockSetCookie = jest.spyOn(
        require('../src/utils/cookie'),
        'setCookie'
      );
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');

      const mockResponse = {
        success: true,
        accessToken: 'Bearer fake-jwt',
        refreshToken: 'fake-refresh-123',
        user: { email: 'new@mail.ru', name: 'new' }
      };

      mockRegisterApi.mockResolvedValue(mockResponse);

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
      expect(state.user).toEqual(mockResponse.user);
      expect(state.isAuthorized).toBeTruthy();

      expect(mockSetCookie).toHaveBeenCalledWith(
        'accessToken',
        'Bearer fake-jwt'
      );
      expect(mockSetItem).toHaveBeenCalledWith(
        'refreshToken',
        'fake-refresh-123'
      );
    });
  });

  describe('Тест экшена запроса логаута', () => {
    test('Тест экшена успешного логаута', async () => {
      const mockLogoutApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'logoutApi'
      );
      const mockDeleteCookie = jest.spyOn(
        require('../src/utils/cookie'),
        'deleteCookie'
      );
      const mockRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');
      const mockClear = jest.spyOn(Storage.prototype, 'clear');

      mockLogoutApi.mockResolvedValue({ success: true, message: 'Logout OK' });

      // Предварительно авторизуем
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

      expect(mockDeleteCookie).toHaveBeenCalledWith('accessToken');
      expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');
      expect(mockClear).toHaveBeenCalled();
    });
  });

  describe('Тест экшена запроса изменения данных клиента', () => {
    test('Тест экшена успешного изменения данных клиента', async () => {
      const mockUpdateApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'updateUserApi'
      );
      const mockResponse = {
        success: true,
        user: { email: 'updated@mail.ru', name: 'updated' }
      };

      mockUpdateApi.mockResolvedValue(mockResponse);

      // Предварительно авторизуем
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
      expect(state.user).toEqual(mockResponse.user);
      expect(state.isAuthorized).toBeTruthy(); // isAuthorized не сбрасывается
    });
  });

  describe('Тест экшена запроса восстановления пароля', () => {
    test('Тест экшена успешного восстановления пароля', async () => {
      const mockForgotApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'forgotPasswordApi'
      );
      mockForgotApi.mockResolvedValue({
        success: true,
        message: 'Reset email sent'
      });

      await store.dispatch(
        forgotPasswordApiAsync({ email: 'test@mail.ru' }) as any
      );

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.user).toBeNull(); // не авторизован
      expect(state.isAuthorized).toBeFalsy();
    });
  });

  describe('Тест экшена запроса изменения пароля', () => {
    test('Тест экшена успешного изменения пароля', async () => {
      const mockResetApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'resetPasswordApi'
      );
      mockResetApi.mockResolvedValue({
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

  describe('Тест экшена запроса данных пользователя', () => {
    test('Тест экшена успешного запроса данных пользователя', async () => {
      const mockGetUserApi = jest.spyOn(
        require('../src/utils/burger-api'),
        'getUserApi'
      );
      const mockGetCookie = jest.spyOn(
        require('../src/utils/cookie'),
        'getCookie'
      );
      mockGetCookie.mockReturnValue('Bearer fake-jwt');
      mockGetUserApi.mockResolvedValue({
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

    test('Тест экшена ошибки при отсутствии токена', async () => {
      const mockGetCookie = jest.spyOn(
        require('../src/utils/cookie'),
        'getCookie'
      );
      mockGetCookie.mockReturnValue(undefined);

      await store.dispatch(checkUserAuthAsync() as any);

      const state = store.getState().user;
      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull(); // не устанавливается, но user = null
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBeFalsy();
    });
  });
});
