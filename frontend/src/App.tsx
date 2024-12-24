import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ConfirmAccount from "./pages/ConfirmAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyMFA from "./pages/VerifyMFA";
import BaseLayout from "./layout/BaseLayout";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/Home";
import AuthRoute from "./routes/auth.route";

const App = () => {
  return (
    <div>
      {/* public routes */}
      <Toaster />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="confirm-account" element={<ConfirmAccount />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-mfa" element={<VerifyMFA />} />
          </Route>
        </Route>

        {/* private routes */}
        <Route element={<AuthRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
