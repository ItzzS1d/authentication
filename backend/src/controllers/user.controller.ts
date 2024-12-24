import { Request, Response, NextFunction } from "express";
import { LoginDto, RegisterDto } from "../../interfaces/auth.interface";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification.model";
import { VerificationEnum } from "../enum/verification-code.enum";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
  verificationEmailSchema,
} from "../validaters/auth.validater";
import {
  anHourFromNow,
  fourtyFiveFromNow,
  threeMinutesAgo,
} from "../utils/date-time";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model";
import { setAuthenticationCookie } from "../utils/cookie";
import { verifyEmailTemplate } from "../mailers/templets/verifyEmailTemplate";
import { sendMail } from "../mailers/mailer";
import { passwordResetTemplate } from "../mailers/templets/passwordResetTemplate";

export const profile = async (req: Request, res: Response): Promise<void> => {
  const user = await UserModel.findById(req.users.userId);
  console.log(user);
  res.status(200).json({ message: "User fetched successfully", user });
};
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password }: RegisterDto = registerSchema.parse(req.body);
  if (await UserModel.exists({ email })) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }
  const newUser = await UserModel.create({ email, name, password });
  const verification = await VerificationCodeModel.create({
    type: VerificationEnum.EMAIL_VERIFICATION,
    userId: newUser._id,
    expiresAt: fourtyFiveFromNow(),
  });
  // send email link
  const verificationUrl = `http://localhost:5173/confirm-account?code=${verification.code}`;
  sendMail({
    to: newUser.email,
    ...verifyEmailTemplate(verificationUrl),
  });
  res.status(201).json({ message: "Verify your email address" });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginDto = loginSchema.parse(req.body);

  const userAgent = req.headers["user-agent"];
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "invalid email or password" });
    return;
  }
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ error: "invalid email or password" });
    return;
  }
  if (user.userPreferences.enable2FA) {
    res.status(400).json({ error: "mfa required" });
    return;
  }
  const session = await SessionModel.create({ userId: user.id, userAgent });
  const accessToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    process.env.JWT_SECRET as string,
    {
      audience: ["user"],
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    process.env.JWT_REFRESH_SECRET as string,
    {
      audience: ["user"],
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }
  );
  setAuthenticationCookie({ accessToken, refreshToken, res, options: "both" });
  res.status(200).json({ message: "user login successfully" });
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.cookies;
  const userAgent = req.headers["user-agent"];
  if (!refreshToken) {
    res.status(403).json({ error: "user not authorized" });
    return;
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  );
  const session = await SessionModel.findOne({
    _id: req.users.sessionId,
    userId: req.users.userId,
  });

  if (!session) {
    // If the session is not found, invalidate the refresh token
    res.status(403).json({ error: "Session not found or expired" });
    return;
  }
  if (session.userAgent !== userAgent) {
    // Optionally, you could invalidate the session if the user agent doesn't match
    res.status(403).json({ error: "Invalid session or device" });
    return;
  }

  const accessToken = jwt.sign(
    { userId: req.users.userId, sessionId: req.users.sessionId },
    process.env.JWT_SECRET as string,
    {
      audience: ["user"],
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  const refreshTokenNew = jwt.sign(
    { userId: req.users.userId, sessionId: req.users.sessionId },
    process.env.JWT_REFRESH_SECRET as string,
    {
      audience: ["user"],
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }
  );
  setAuthenticationCookie({
    res,
    options: "both",
    accessToken,
    refreshToken: refreshTokenNew,
  });
  res.status(200).json({ message: "success" });
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = verificationEmailSchema.parse(req.body);
  const validCode = await VerificationCodeModel.findOne({
    code,
    type: VerificationEnum.EMAIL_VERIFICATION,
    expiresAt: { $gt: new Date() },
  });
  if (!validCode) {
    res.status(400).json({ error: "Invalid or expired verification code" });
    return;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      isEmailVerified: true,
    },
    { new: true }
  );
  if (!updatedUser) {
    res.status(500).json({ error: "Unable to verify email address" });
    return;
  }
  await validCode.deleteOne();
  res.status(200).json({ message: "email verification successfull" });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const email = emailSchema.parse(req.body.email);
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  // check mail rate limit is 2 emails per 3 or 10 min
  let timeAgo = threeMinutesAgo();
  const maxAttempts = 2;

  const count = await VerificationCodeModel.countDocuments({
    userId: user.id,
    type: VerificationEnum.PASSWORD_RESET,
    createdAt: { $gt: timeAgo },
  });
  if (count >= maxAttempts) {
    res.status(400).json({ error: "too many requests,try again later " });
    return;
  }
  const expiresAt = anHourFromNow();
  const validCode = await VerificationCodeModel.create({
    userId: user.id,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt,
  });
  const resetLink = `http://localhost:5173/reset-password?code=${
    validCode.code
  }&exp=${expiresAt.getTime()}`;

  sendMail({ to: user.email, ...passwordResetTemplate(resetLink) });

  res.status(200).json({ message: "verification email sent" });
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { password, verificationCode } = resetPasswordSchema.parse(req.body);
  const validCode = await VerificationCodeModel.findOne({
    code: verificationCode,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt: { $gt: new Date() },
  });
  if (!validCode) {
    res.status(400).json({ error: "Invalid or expired verification code" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await UserModel.findByIdAndUpdate(validCode?.userId, {
    password: hashedPassword,
  });
  if (!updatedUser) {
    res.status(500).json({ error: "failed to reset password" });
    return;
  }
  await validCode?.deleteOne();
  await SessionModel.deleteMany({
    userId: updatedUser?.id,
  });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "password reset succesfull" });
};

export const logOut = async (req: Request, res: Response): Promise<void> => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken || !refreshToken) {
    res.status(400).json({ error: "user is not logged in" });
    return;
  }
  await SessionModel.findByIdAndDelete(req.users.sessionId);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
  res.status(200).json({ message: "logout success" });
};
