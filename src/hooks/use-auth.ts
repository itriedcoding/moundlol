import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getSessionToken, hasSession } from "@/lib/session";

export function useAuth() {
  const sessionToken = getSessionToken();
  const user = useQuery(
    api.users.getUserBySession,
    sessionToken ? { sessionToken } : "skip"
  );

  return {
    isLoading: user === undefined && hasSession(),
    isAuthenticated: hasSession() && user !== null,
    user,
    sessionToken,
  };
}
