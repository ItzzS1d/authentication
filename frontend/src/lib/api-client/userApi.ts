import { LoginFormData } from "../../pages/auth/Login";
import { SignupFormData } from "../../pages/auth/Signup";
import { Email } from "../../pages/ForgotPassword";
import { ResetPWTypes } from "../../pages/ResetPassword";
import { API } from "../axios-client";

export const handleLogin = async (formData: LoginFormData) => {
  const response = await API.post("/auth/login", formData);
  return response;
};

export const handleRegister = async (formData: SignupFormData) => {
  const response = await API.post("/auth/register", formData);
  return response;
};

export const handleConfirmAccount = async (code: string) => {
  const response = await API.post("/auth/verify/email", { code });
  return response;
};

export const handleForgotPassword = async (email: Email) => {
  const response = await API.post("/auth/password/forgot", email);
  return response;
};

export const handleResetPassword = async (formData: ResetPWTypes) => {
  const response = await API.post("/auth/password/reset", formData);
  return response;
};

export const fetchCurrentUser = async () => {
  const response = await API.get("/auth/profile");
  return response;
};

export const handleLogout = async () => {
  const response = await API.delete("/auth/logout");
  return response;
};
