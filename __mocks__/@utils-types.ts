// __mocks__/@utils-types.ts

export type TUser = { email: string; name: string };
export type TOrder = { _id: string };
export type TLoginData = { email: string; password: string };
export type TRegisterData = TLoginData & { name: string };
