import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/Layout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from 'pages/client/error.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import BookPage from 'pages/client/book.tsx';
import UserPage from 'pages/client/user.tsx';
import 'styles/global.scss'
import { App } from 'antd';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/users",
        element:<UserPage/>
      },
      {
        path: "/books",
        element:<BookPage/>
      },
    ],
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
    <RouterProvider router={router} />
    </App>
  </StrictMode>,
)
