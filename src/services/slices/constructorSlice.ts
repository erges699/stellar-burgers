import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {},
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const payload =
          ingredient.type === 'bun'
            ? ingredient
            : { ...ingredient, id: nanoid() };

        return { payload };
      },
      reducer: (
        state,
        action: PayloadAction<TIngredient | TConstructorIngredient>
      ) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          // Утверждаем, что у начинки есть id
          state.ingredients.push(action.payload as TConstructorIngredient);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    upIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0) {
        state.ingredients.splice(
          index - 1,
          0,
          state.ingredients.splice(index, 1)[0]
        );
      }
    },
    downIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        state.ingredients.splice(
          index + 1,
          0,
          state.ingredients.splice(index, 1)[0]
        );
      }
    },
    clearConstructor: () => initialState
  }
});

// export { initialState as constructorInitialState };
export const {
  // addBun,
  addIngredient,
  removeIngredient,
  downIngredient,
  upIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
export const constructorActions = constructorSlice.actions;
export const constructorInitialState = constructorSlice.getInitialState;
