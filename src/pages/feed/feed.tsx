import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsApiAsync } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feeds.orders);
  const isLoading: boolean = useSelector((state) => state.feeds.isLoading);

  const getFeeds = () => {
    dispatch(getFeedsApiAsync());
  };

  useEffect(() => {
    getFeeds();
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI orders={orders} handleGetFeeds={getFeeds} />
      )}
    </>
  );
};
