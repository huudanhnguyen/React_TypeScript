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
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
    };
    fetchAccount();
  }, []);
  return (
    <>
      {isAppLoading === false ? (
        <div>
          <AppHeader />
          <Outlet />
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <SyncLoader />
        </div>
      )}
    </>
  );
}

export default Layout;
