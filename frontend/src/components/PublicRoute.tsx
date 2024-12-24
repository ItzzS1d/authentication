import { Outlet } from "react-router-dom";

const PublicRoute = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PublicRoute;
