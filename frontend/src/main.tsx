import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "@/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "pages/client/error.tsx";
import LoginPage from "pages/client/auth/login.tsx";
import RegisterPage from "pages/client/auth/register.tsx";
import BookPage from "pages/client/book.tsx";
import UserPage from "pages/client/user.tsx";
import "styles/global.scss";
import { App } from "antd";
import { AppProvider } from "components/context/app.context";
import PrivateRoute from "./routes/privateRoute";

const router = createBrowserRouter([
  // 🔹 Layout mặc định cho người dùng (có Header)
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/users", element: <UserPage /> },
      { path: "/books", element: <BookPage /> },
      {
        path: "/checkout",
        element: (
          <PrivateRoute requiredRole="user">
            <div>Checkout content</div>
          </PrivateRoute>
        ),
      },
    ],
  },

  // 🔹 Admin route riêng biệt (không kế thừa Header)
  {
    path: "/admin",
    element: (
      <PrivateRoute requiredRole="admin">
        <div>admin page</div>
      </PrivateRoute>
    ),
  },

  // 🔹 Auth routes
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </AppProvider>
  </StrictMode>
);
