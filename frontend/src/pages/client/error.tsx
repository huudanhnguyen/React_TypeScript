import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";
import { Button, Result } from "antd";
import React from "react";

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  console.error(error);

  // 🧠 Xử lý an toàn: tránh lỗi khi error không có statusText / message
  let title = "Oops!";
  let subTitle = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    // Đây là lỗi từ react-router (ví dụ: 404, 401, 500)
    title = `Error ${error.status}`;
    subTitle = error.statusText;
  } else if (error instanceof Error) {
    // Lỗi JS thông thường
    subTitle = error.message;
  }

  return (
    <Result
      status="404"
      title={title}
      subTitle={subTitle}
      extra={
        <Button type="primary">
          <Link to="/">Back to Home Page</Link>
        </Button>
      }
    />
  );
};

export default ErrorPage;
