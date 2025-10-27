import { Outlet } from "react-router-dom";
import AppHeader from "./components/layouts/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "./services/api";
import { useCurrentApp } from "./components/context/app.context";
import { SyncLoader } from "react-spinners";

function Layout() {
  const { setUser, setIsAppLoading, isAppLoading, setIsAuthenticated } =
    useCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      setIsAppLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsAppLoading(false);
        return;
      }
      try {
        const res = await fetchAccountAPI();
        if (res.data) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsAppLoading(false);
      }
    };
    fetchAccount();
  }, []);

  if (isAppLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <SyncLoader color="#1677ff" />
      </div>
    );
  }

  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default Layout;
