import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  orderBurgerApiAsync,
  ordersSlice
} from '../../services/slices/ordersSlice';
import { constructorSlice } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const isAuthorized = useSelector((state) => state.user.isAuthorized);

  const { orderModalData, orderRequest } = useSelector((state) => state.orders);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (constructorItems.bun && !isAuthorized) {
      return navigate('/login');
    }
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];
    dispatch(orderBurgerApiAsync(ingredientsId));
  };

  const closeOrderModal = () => {
    dispatch(constructorSlice.actions.clearConstructor());
    dispatch(ordersSlice.actions.clearOrder());
  };

  useEffect(() => {
    dispatch(ordersSlice.actions.clearOrder());
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
