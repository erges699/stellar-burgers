// __mocks__/utils/burger-api.ts

import { jest } from '@jest/globals';
import { TLoginData, TRegisterData } from '@utils-types';

type TUser = { email: string; name: string };

type LoginApiResponse = {
 success: boolean;
 accessToken: string;
 refreshToken: string;
 user: TUser;
};

export const loginUserApi = jest.fn<Promise<LoginApiResponse>, TLoginData>();
export const registerUserApi = jest.fn<Promise<LoginApiResponse>, TRegisterData>();
export const getUserApi = jest.fn<Promise<{ success: boolean; user: TUser }>, >();
export const updateUserApi = jest.fn<Promise<{ success: boolean; user: TUser }>, Partial<TUser>>();
export const logoutApi = jest.fn<Promise<{ success: boolean; message: string }>, >();
export const forgotPasswordApi = jest.fn<Promise<{ success: boolean; message: string }>, { email: string }>();
export const resetPasswordApi = jest.fn<Promise<{ success: boolean; message: string }>, { password: string; token: string }>();
export const getOrdersApi = jest.fn<Promise<{ success: boolean; orders: TOrder }>, >();
