import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getSessionToken, hasSession, clearSessionToken } from "@/lib/session";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export function useAuth() {
  const sessionToken = getSessionToken();
  const user = useQuery(
    api.users.getUserBySession,
    sessionToken ? { sessionToken } : "skip"
  );
  const navigate = useNavigate();

  const signOut = useCallback(() => {
    clearSessionToken();
    navigate("/");
  }, [navigate]);

  return {
    isLoading: user === undefined && hasSession(),
    isAuthenticated: hasSession() && user !== null,
    user,
    sessionToken,
    signOut,
  };
}