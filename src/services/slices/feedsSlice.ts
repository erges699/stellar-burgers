import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeedsApiAsync = createAsyncThunk('feeds/getFeeds', getFeedsApi);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsApiAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedsApiAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(getFeedsApiAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

// export { initialState as ordersInitialState };
export default feedsSlice.reducer;
export const feedsActions = feedsSlice.actions;
export const feedsInitialState = feedsSlice.getInitialState;
export const selectFeeds = (state: { feed: TFeedsState }) => state.feed;
export const selectFeedsOrders = (state: { feed: TFeedsState }) => state.feed.orders;
export const selectFeedsTotal = (state: { feed: TFeedsState }) => state.feed.total;
export const selectFeedsTotalToday = (state: { feed: TFeedsState }) => state.feed.totalToday;
export const selectFeedsLoading = (state: { feed: TFeedsState }) => state.feed.isLoading;
