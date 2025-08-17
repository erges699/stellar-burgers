import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import { ModalWithNavigation } from '../modal/modal-with-navigation';

export const mainRoutes = [
  {
    path: '*',
    element: <NotFound404 />
  },
  {
    path: '',
    element: <ConstructorPage />
  },
  {
    path: 'register',
    element: (
      <ProtectedRoute onlyUnAuthorized>
        <Register />
      </ProtectedRoute>
    )
  },
  {
    path: 'login',
    element: (
      <ProtectedRoute onlyUnAuthorized>
        <Login />
      </ProtectedRoute>
    )
  },
  {
    path: 'forgot-password',
    element: (
      <ProtectedRoute onlyUnAuthorized>
        <ForgotPassword />
      </ProtectedRoute>
    )
  },
  {
    path: 'reset-password',
    element: (
      <ProtectedRoute onlyUnAuthorized>
        <ResetPassword />
      </ProtectedRoute>
    )
  },
  {
    path: 'profile',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        )
      },
      {
        path: 'orders/:number',
        element: (
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: 'feed',
    element: <Feed />
  },
  {
    path: 'feed/:number',
    element: <OrderInfo />
  },
  {
    path: 'ingredients/:id',
    element: <IngredientDetails title={'Детали ингредиента'} />
  }
];

export const modalRoutes = [
  {
    path: 'feed/:number',
    element: (
      <ModalWithNavigation>
        <OrderInfo isModal />
      </ModalWithNavigation>
    )
  },
  {
    path: 'ingredients/:id',
    element: (
      <ModalWithNavigation>
        <IngredientDetails title={'Детали ингредиента'} isModal />
      </ModalWithNavigation>
    )
  },
  {
    path: 'profile/orders/:number',
    element: (
      <ProtectedRoute>
        <ModalWithNavigation>
          <OrderInfo isModal />
        </ModalWithNavigation>
      </ProtectedRoute>
    )
  }
];
