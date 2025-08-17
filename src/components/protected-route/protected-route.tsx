import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { checkUserAuthAsync } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';

type ProtectedRouteProps = {
  onlyUnAuthorized?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuthorized,
  children
}: ProtectedRouteProps) => {
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const loading = useSelector((state) => state.user.isLoading);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthorized && getCookie('accessToken')) {
      dispatch(checkUserAuthAsync());
    }
  }, [dispatch, isAuthorized]);

  if (loading) {
    return <Preloader />;
  }

  if (!onlyUnAuthorized && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuthorized && isAuthorized) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
