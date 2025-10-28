import { useCurrentApp } from "@/components/context/app.context";
import { useLocation, Link } from "react-router-dom";
import { Button, Result } from "antd";
import { SyncLoader } from "react-spinners";

interface IProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const PrivateRoute = ({ children, requiredRole }: IProps) => {
  const { isAuthenticated, user, isAppLoading } = useCurrentApp();
  const location = useLocation();

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

  if (!isAuthenticated) {
    return (
      <Result
        status="403"
        title="403 - Not logged in"
        subTitle="You must be logged in to access this page."
        extra={
          <Button type="primary">
            <Link to="/login" state={{ from: location.pathname }}>
              Go to Login
            </Link>
          </Button>
        }
      />
    );
  }

  if (requiredRole === "admin" && user?.role?.toLowerCase() !== "admin") {
    return (
      <Result
        status="403"
        title="403 - Forbidden"
        subTitle="You are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link to="/">Back to Home</Link>
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
