import { Request, Response } from "express";
import SessionModel from "../models/session.model";
import { z } from "zod";
export const getAllSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, sessionId } = req.users;
  const sessions = await SessionModel.find(
    { userId, expiredAt: { $gt: Date.now() } },
    {
      userId: 1,
      userAgent: 1,
      createdAt: 1,
      expiredAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  const modifySessions = sessions.map((session) => ({
    ...session.toObject(),
    ...(session.id === sessionId && {
      isCurrent: true,
    }),
  }));

  res.status(200).json({
    message: "Retrieved all sessions successfully",
    sessions: modifySessions,
  });
};

export const getSingleSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sessionId } = req.users;
  const session = await SessionModel.findById(sessionId)
    .populate({
      path: "userId",
      select: "-password -expiresAt",
    })
    .select("-createdAt -updatedAt");

  res.status(200).json({ message: "Session retrived successfully", session });
};

export const deleteSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sessionId = z.string().parse(req.params.id);
  const userId = req.users.userId;
  const deleteSession = await SessionModel.findOneAndDelete({
    id: sessionId,
    userId,
  });
  if (!deleteSession) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.status(200).json({ message: "session deleted successfully" });
};
