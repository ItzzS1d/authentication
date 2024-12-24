import { Request, Response } from "express";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
  verifyMFALoginSchema,
  verifyMFASchema,
} from "../validaters/mfa.validator";
import { setAuthenticationCookie } from "../utils/cookie";
import SessionModel from "../models/session.model";

export const generateMFA = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = await UserModel.findById(req.users.userId);
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (user?.userPreferences.enable2FA) {
    res.status(400).json({ error: "MFA already enabled" });
    return;
  }
  let secretKey = user?.userPreferences.twoFactorSecret;
  if (!secretKey) {
    const secret = speakeasy.generateSecret({ name: "Squeezy" });
    secretKey = secret.base32;
    user.userPreferences.twoFactorSecret = secretKey;
    await user!.save();
  }
  const url = speakeasy.otpauthURL({
    secret: secretKey,
    label: user.name,
    issuer: "squeezy.com",
    encoding: "base32",
  });
  const qrImageUrl = await qrcode.toDataURL(url);
  res.status(200).json({
    message: "scan the qr code or use the setup key",
    secret: secretKey,
    qrImageUrl,
  });
};

export const verifyMFA = async (req: Request, res: Response): Promise<void> => {
  const { code, secretKey } = verifyMFASchema.parse(req.body);
  const user = await UserModel.findById(req.users.userId);

  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (user.userPreferences.enable2FA) {
    res.status(400).json({ error: "MFA is already enabled" });
    return;
  }
  const isValid = speakeasy.totp.verify({
    secret: secretKey,
    encoding: "base32",
    token: code,
  });
  if (!isValid) {
    res.status(400).json({ error: "Invalid MFA code. Please try again" });
    return;
  }
  user.userPreferences.enable2FA = true;
  await user.save();
  res.status(200).json({
    message: "MFA enabled successfully",
  });
};

export const revokeMFA = async (req: Request, res: Response): Promise<void> => {
  const user = await UserModel.findById(req.users.userId);
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!user.userPreferences.enable2FA) {
    res.status(400).json({ error: "MFA is not enabled" });
    return;
  }
  user.userPreferences.twoFactorSecret = undefined;
  user.userPreferences.enable2FA = false;
  await user.save();
  res.status(200).json({ message: "MFA revoke successfull" });
};

export const verifyMFAForLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code, email, userAgent } = verifyMFALoginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const user = await UserModel.findOne({ email }).select("-password");
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  // if (!(await bcrypt.compare(password, user.password))) {
  //   res.status(400).json({ error: "invalid email or password" });
  //   return;
  // }
  if (
    !user.userPreferences.enable2FA &&
    !user.userPreferences.twoFactorSecret
  ) {
    res.status(400).json({ eror: "MFA not enabled for this user" });
    return;
  }
  const isValid = speakeasy.totp.verify({
    secret: user.userPreferences.twoFactorSecret!,
    encoding: "base32",
    token: code,
  });
  if (!isValid) {
    res.status(400).json({ eror: "Invalid MFA code. please try again" });
    return;
  }
  const session = await SessionModel.create({ userId: user.id, userAgent });
  const accessToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    process.env.JWT_SECRET as string,
    {
      audience: ["user"],
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  const refreshToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    process.env.JWT_REFRESH_SECRET as string,
    {
      audience: ["user"],
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );
  setAuthenticationCookie({ accessToken, refreshToken, res, options: "both" });
  res.status(200).json({ message: "login successfull", user });
};
