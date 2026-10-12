"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import {
  CLIENT_PORTAL_CURRENT_USER,
  type CPUser,
  type ClientPortalCurrentUserData,
} from "@/graphql/auth/queries/currentUser";
import { CLIENT_PORTAL_LOGOUT } from "@/graphql/auth/mutations/session";
import { DEMO_CUSTOMER, DEMO_TOKEN } from "./demoCustomer";

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

// The demo session lives in sessionStorage; components re-read it when it changes.
const demoListeners = new Set<() => void>();
const subscribeDemo = (cb: () => void) => {
  demoListeners.add(cb);
  return () => demoListeners.delete(cb);
};
const notifyDemo = () => demoListeners.forEach((cb) => cb());
const readDemo = () => sessionStorage.getItem("token") === DEMO_TOKEN;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  const isDemo = useSyncExternalStore(subscribeDemo, readDemo, () => false);

  const { data, loading, refetch } = useQuery<ClientPortalCurrentUserData>(
    CLIENT_PORTAL_CURRENT_USER,
    { errorPolicy: "ignore", fetchPolicy: "network-only", skip: isDemo }
  );

  const [logoutMutation] = useMutation(CLIENT_PORTAL_LOGOUT);

  // Token goes to sessionStorage BEFORE the refetch so the auth link sends it.
  const login = useCallback(
    (token: string, refreshToken?: string) => {
      sessionStorage.setItem("token", token);
      if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
      notifyDemo();
      if (token !== DEMO_TOKEN) refetch();
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    try {
      if (!readDemo()) await logoutMutation();
    } catch {
      // Session may already be gone server-side; clear locally regardless.
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      notifyDemo();
      await client.clearStore();
      refetch();
    }
  }, [logoutMutation, client, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: isDemo ? DEMO_CUSTOMER : data?.clientPortalCurrentUser ?? null,
        loading: isDemo ? false : loading,
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
