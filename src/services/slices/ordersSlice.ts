import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '../../utils/burger-api';

type TOrdersState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orderModalData: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

export const orderBurgerApiAsync = createAsyncThunk(
  'order/createOrder',
  orderBurgerApi
);

export const getOrderByNumberApiAsync = createAsyncThunk(
  'order/getOrderByNumber',
  getOrderByNumberApi
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: () => initialState
  },
  selectors: {},
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerApiAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(orderBurgerApiAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
        state.orderRequest = false;
      })
      .addCase(orderBurgerApiAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });

    builder
      .addCase(getOrderByNumberApiAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberApiAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumberApiAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.orders?.[0];
      });
  }
});

// export { initialState as ordersInitialState };
export default ordersSlice.reducer;
export const ordersActions = ordersSlice.actions;
export const ordersInitialState = ordersSlice.getInitialState;