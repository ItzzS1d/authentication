import express from "express";
import { handleAsyncError } from "../utils/errorHandlers";
import {
  deleteSession,
  getAllSessions,
  getSingleSession,
} from "../controllers/session.controller";
import isAuth from "../utils/isAuth";
const router = express.Router();

router.get("/all", isAuth, handleAsyncError(getAllSessions));
router.get("/single", isAuth, handleAsyncError(getSingleSession));
router.delete("/:id", isAuth, handleAsyncError(deleteSession));
export default router;
