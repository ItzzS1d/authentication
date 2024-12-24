import express from "express";
import {
  forgotPassword,
  login,
  logOut,
  profile,
  refreshToken,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/user.controller";
import { handleAsyncError } from "../utils/errorHandlers";
import isAuth from "../utils/isAuth";
const router = express.Router();

router.get("/profile", isAuth, handleAsyncError(profile));
router.post("/register", handleAsyncError(register));
router.post("/login", handleAsyncError(login));
router.post("/verify/email", handleAsyncError(verifyEmail));
router.post("/password/forgot", handleAsyncError(forgotPassword));
router.post("/password/reset", handleAsyncError(resetPassword));
router.delete("/logout", isAuth, handleAsyncError(logOut));

router.get("/refresh", isAuth, handleAsyncError(refreshToken));

export default router;
