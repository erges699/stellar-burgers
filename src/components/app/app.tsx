import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import React, { useEffect, useRef } from 'react';
import { getIngredientsAsync } from '../../services/slices/ingredientsSlice';
import { checkUserAuthAsync } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import {
  createBrowserRouter,
  matchPath,
  RouterProvider,
  useLocation,
  useNavigate,
  useRoutes
} from 'react-router-dom';
import { mainRoutes, modalRoutes } from './routes-config';

const AppLayout = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const isInitialRender = useRef(true);

  useEffect(() => {
    const modalPaths = modalRoutes.map((route) => route.path);
    const isModalPath = modalPaths.some((path) =>
      matchPath(path, location.pathname)
    );

    if (isModalPath && isInitialRender.current) {
      navigate(location.pathname, { replace: true, state: {} });
    }

    isInitialRender.current = false;
  }, [location, navigate]);

  const mainElement = useRoutes(mainRoutes, background ?? location);
  const modalElement = useRoutes(modalRoutes, location);

  return (
    <div className={styles.app}>
      <AppHeader />
      {mainElement}
      {background && modalElement}
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const router = createBrowserRouter([
    {
      path: '/*',
      element: <AppLayout />,
      children: mainRoutes
    }
  ]);

  useEffect(() => {
    dispatch(getIngredientsAsync());
    dispatch(checkUserAuthAsync());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
