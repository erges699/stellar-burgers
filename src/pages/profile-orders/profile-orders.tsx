import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersApiAsync } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.user.orders);
  const loading = useSelector((state) => state.user.orderLoading);
  const error = useSelector((state) => state.user.orderError);

  useEffect(() => {
    dispatch(getOrdersApiAsync());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ProfileOrdersUI orders={orders} />
      )}
    </>
  );
};
