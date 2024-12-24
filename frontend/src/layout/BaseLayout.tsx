import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="lg:w-1/5">
        <Outlet />
      </div>
    </div>
  );
};

export default BaseLayout;
