import { API } from "../axios-client";

export const handleMFASetup = async () => {
  const response = await API.get("/mfa/setup");
  return response;
};
export const handleMFAVerify = async (code: string, secretKey: string) => {
  const response = await API.post("/mfa/verify", { code, secretKey });
  return response;
};
export const handleRevokeAccess = async () => {
  const response = await API.delete("/mfa/revoke");
  return response;
};
export const handleVerifyMFALOGIN = async (code: string, email: string) => {
  const response = await API.post("/mfa/verify-login", { code, email });
  return response;
};
