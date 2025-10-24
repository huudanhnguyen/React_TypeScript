import { useRouteError, Link } from "react-router-dom";
import { Button, Result } from "antd";
const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Result
        status="404"
        title="Oops!"
        // subTitle={error.statusText || error.message}
        extra={
          <Button type="primary">
            {" "}
            <Link to="/">Back to Home Page</Link>
          </Button>
        }
      />
    </>
  );
};
export default ErrorPage;
