import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import 'styles/global.scss'
import HomePage from 'pages/client/home';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import DashBoardPage from 'pages/admin/dashboard';
import ManageBookPage from 'pages/admin/manage.book';
import ManageOrderPage from 'pages/admin/manage.order';
import ManageUserPage from 'pages/admin/manage.user';
import LayoutAdmin from 'components/layouts/layout.admin';
import PrivateRoute from './routes/privateRoute';
import Layout from './Layout';
import enUS from 'antd/locale/en_US';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <div>checkout page</div>
          </PrivateRoute>
        ),
      }
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashBoardPage />
          </PrivateRoute>
        )
      },
      {
        path: "book",
        element: (
          <PrivateRoute>
            <ManageBookPage />
          </PrivateRoute>
        )
      },
      {
        path: "order",
        element: (
          <PrivateRoute>
            <ManageOrderPage />
          </PrivateRoute>
        )
      },
      {
        path: "user",
        element: (
          <PrivateRoute>
            <ManageUserPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute>
            <div>admin page</div>
          </PrivateRoute>
        ),
      },

    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
