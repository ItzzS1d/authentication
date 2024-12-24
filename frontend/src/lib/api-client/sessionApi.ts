import { API } from "../axios-client";

export const handleFetchAllSessions = async () => {
  const response = await API.get("/sessions/all");
  return response;
};
