import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const AuthRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[rgba(255,255,255,.2)] text-2xl">
        <Loader size="30px" className="animate-spin" />
        Loading Squeezy...
      </div>
    );
  }
  return user?.email ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoute;
