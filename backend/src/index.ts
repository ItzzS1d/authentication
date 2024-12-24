import express, { NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/user.route";
import sessionRoute from "./routes/session.route";
import mfaRoute from "./routes/mfa.route";

import connectToMongoDB from "./utils/db";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/sessions", sessionRoute);
app.use("/api/v1/mfa", mfaRoute);

app.use((err: any, req: any, res: any, next: NextFunction) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json(message);
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectToMongoDB();
});
