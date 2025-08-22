// __mocks__/utils/burger-api.ts

import { jest } from '@jest/globals';
import { TLoginData, TRegisterData } from '@utils-types';

// Типы
type TUser = { email: string; name: string };
type TOrder = { _id: string };

type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

type TUserResponse = {
  success: boolean;
  user: TUser;
};

type TMessageResponse = {
  success: boolean;
  message: string;
};

type TOrdersResponse = {
  success: boolean;
  orders: TOrder;
};

// Типы функций API
type LoginApiFunction = (data: TLoginData) => Promise<TAuthResponse>;
type RegisterApiFunction = (data: TRegisterData) => Promise<TAuthResponse>;
type GetApiFunction = () => Promise<TUserResponse>;
type UpdateApiFunction = (data: Partial<TUser>) => Promise<TUserResponse>;
type LogoutApiFunction = () => Promise<TMessageResponse>;
type ForgotPasswordApiFunction = (data: {
  email: string;
}) => Promise<TMessageResponse>;
type ResetPasswordApiFunction = (data: {
  password: string;
  token: string;
}) => Promise<TMessageResponse>;
type GetOrdersApiFunction = () => Promise<TOrdersResponse>;

// Моки с правильной типизацией через jest.MockedFunction
export const loginUserApi = jest.fn() as jest.MockedFunction<LoginApiFunction>;
export const registerUserApi =
  jest.fn() as jest.MockedFunction<RegisterApiFunction>;
export const getUserApi = jest.fn() as jest.MockedFunction<GetApiFunction>;
export const updateUserApi =
  jest.fn() as jest.MockedFunction<UpdateApiFunction>;
export const logoutApi = jest.fn() as jest.MockedFunction<LogoutApiFunction>;
export const forgotPasswordApi =
  jest.fn() as jest.MockedFunction<ForgotPasswordApiFunction>;
export const resetPasswordApi =
  jest.fn() as jest.MockedFunction<ResetPasswordApiFunction>;
export const getOrdersApi =
  jest.fn() as jest.MockedFunction<GetOrdersApiFunction>;
