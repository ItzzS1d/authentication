import express from "express";
import isAuth from "../utils/isAuth";
import {
  generateMFA,
  revokeMFA,
  verifyMFA,
  verifyMFAForLogin,
} from "../controllers/mfa.controller";
import { handleAsyncError } from "../utils/errorHandlers";

const router = express.Router();

router.get("/setup", isAuth, handleAsyncError(generateMFA));
router.post("/verify", isAuth, handleAsyncError(verifyMFA));
router.delete("/revoke", isAuth, handleAsyncError(revokeMFA));

router.post("/verify-login", handleAsyncError(verifyMFAForLogin));

export default router;
