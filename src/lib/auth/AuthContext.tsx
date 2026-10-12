"use client";

import { createContext, useContext, useCallback } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import {
  CLIENT_PORTAL_CURRENT_USER,
  type CPUser,
  type ClientPortalCurrentUserData,
} from "@/graphql/auth/queries/currentUser";
import { CLIENT_PORTAL_LOGOUT } from "@/graphql/auth/mutations/session";

type AuthContextValue = {
  user: CPUser | null;
  loading: boolean;
  login: (token: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  login: () => {},
  logout: async () => {},
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();

  const { data, loading, refetch } = useQuery<ClientPortalCurrentUserData>(
    CLIENT_PORTAL_CURRENT_USER,
    { errorPolicy: "ignore", fetchPolicy: "network-only" }
  );

  const [logoutMutation] = useMutation(CLIENT_PORTAL_LOGOUT);

  // Token goes to sessionStorage BEFORE the refetch so the auth link sends it.
  const login = useCallback(
    (token: string, refreshToken?: string) => {
      sessionStorage.setItem("token", token);
      if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
      refetch();
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch {
      // Session may already be gone server-side; clear locally regardless.
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      await client.clearStore();
      refetch();
    }
  }, [logoutMutation, client, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: data?.clientPortalCurrentUser ?? null,
        loading,
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
