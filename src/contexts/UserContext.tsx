// src/contexts/UserContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "react-oidc-context";
import { setApiAccessToken } from "../api/client";
import type { User } from "../types/user";

interface UserContextType {
  user: User | null;
  backendUser: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

type KeycloakProfile = {
  sub?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  name?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<
    string,
    {
      roles?: string[];
    }
  >;
  groups?: string[];
};

function createUserFromProfile(
  profile: KeycloakProfile | undefined,
): User | null {
  if (!profile?.sub) {
    return null;
  }

  return {
    id: profile.sub,
    username: profile.preferred_username ?? "",
    firstName: profile.given_name ?? "",
    lastName: profile.family_name ?? "",
    email: profile.email ?? "",
  };
}

function hasAdminAccess(profile: KeycloakProfile | undefined): boolean {
  const realmRoles = profile?.realm_access?.roles ?? [];

  const clientRoles = Object.values(profile?.resource_access ?? {}).flatMap(
    (clientAccess) => clientAccess.roles ?? [],
  );

  const groups = profile?.groups ?? [];

  return (
    realmRoles.includes("admin") ||
    clientRoles.includes("admin") ||
    groups.includes("admin") ||
    groups.includes("/admin") ||
    groups.some((group) => group.endsWith("/admin"))
  );
}

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const auth = useAuth();

  const [isApiTokenReady, setIsApiTokenReady] = useState(false);

  const accessToken = auth.user?.access_token;
  const profile = auth.user?.profile as KeycloakProfile | undefined;

  useEffect(() => {
    if (auth.isLoading || auth.activeNavigator) {
      setApiAccessToken(undefined);
      setIsApiTokenReady(false);
      return;
    }

    if (!auth.isAuthenticated || !accessToken) {
      setApiAccessToken(undefined);
      setIsApiTokenReady(false);
      return;
    }

    setApiAccessToken(accessToken);
    setIsApiTokenReady(true);

    return () => {
      setApiAccessToken(undefined);
      setIsApiTokenReady(false);
    };
  }, [auth.isLoading, auth.activeNavigator, auth.isAuthenticated, accessToken]);

  const user = useMemo(() => {
    if (!auth.isAuthenticated) {
      return null;
    }

    return createUserFromProfile(profile);
  }, [auth.isAuthenticated, profile]);

  const isAuthReady = useMemo(() => {
    return (
      !auth.isLoading &&
      !auth.activeNavigator &&
      auth.isAuthenticated &&
      !!accessToken &&
      isApiTokenReady
    );
  }, [
    auth.isLoading,
    auth.activeNavigator,
    auth.isAuthenticated,
    accessToken,
    isApiTokenReady,
  ]);

  const isAuthenticated = useMemo(() => {
    return isAuthReady && !!user;
  }, [isAuthReady, user]);

  const isAdmin = useMemo(() => {
    if (!isAuthenticated) {
      return false;
    }

    return hasAdminAccess(profile);
  }, [isAuthenticated, profile]);

  const value = useMemo<UserContextType>(
    () => ({
      user,
      backendUser: user,
      isAuthenticated,
      isAuthReady,
      isAdmin,
      isLoading: auth.isLoading || !isAuthReady,
    }),
    [user, isAuthenticated, isAuthReady, isAdmin, auth.isLoading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
