// src/contexts/UserContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "react-oidc-context";
import { register as registerApi } from "../api/security";
import { setApiAccessToken } from "../api/client";
import type { User } from "../types/user";

interface UserContextType {
  backendUser: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isRegistering: boolean;
  registrationError: unknown;
  registerBackendUser: (force?: boolean) => Promise<User | undefined>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

// Prevent duplicate register calls in React StrictMode/dev.
let lastRegisterKey: string | null = null;
let registerPromise: Promise<User> | null = null;

function resetRegisterCache() {
  lastRegisterKey = null;
  registerPromise = null;
}

function registerOnce(registerKey: string): Promise<User> {
  if (registerPromise && lastRegisterKey === registerKey) {
    return registerPromise;
  }

  lastRegisterKey = registerKey;

  registerPromise = registerApi()
    .then((user) => user as User)
    .catch((error) => {
      if (lastRegisterKey === registerKey) {
        resetRegisterCache();
      }

      throw error;
    });

  return registerPromise;
}

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const auth = useAuth();

  const [backendUser, setBackendUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<unknown>(null);

  const accessToken = auth.user?.access_token;
  const userSubject = auth.user?.profile.sub;

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAdmin = useMemo(() => {
    const profile = auth.user?.profile as
      | {
          realm_access?: {
            roles?: string[];
          };
          groups?: string[];
        }
      | undefined;

    const roles = profile?.realm_access?.roles ?? [];
    const groups = profile?.groups ?? [];

    return roles.includes("admin") || groups.includes("admin");
  }, [auth.user?.profile]);

  const registerBackendUser = useCallback(
    async (force = false): Promise<User | undefined> => {
      if (
        auth.isLoading ||
        auth.activeNavigator ||
        !auth.isAuthenticated ||
        !accessToken
      ) {
        return undefined;
      }

      const registerKey = userSubject ?? accessToken;

      if (force) {
        resetRegisterCache();
      }

      try {
        setIsRegistering(true);
        setRegistrationError(null);

        setApiAccessToken(accessToken);

        const registeredUser = await registerOnce(registerKey);
        setIsAuthenticated(true);
        setIsAuthReady(true);

        setBackendUser(registeredUser);

        return registeredUser;
      } catch (error) {
        console.error("registerBackendUser:", error);
        setRegistrationError(error);
        throw error;
      } finally {
        setIsRegistering(false);
      }
    },
    [
      auth.isLoading,
      auth.activeNavigator,
      auth.isAuthenticated,
      accessToken,
      userSubject,
    ],
  );

  useEffect(() => {
    setApiAccessToken(accessToken);

    if (!accessToken || !auth.isAuthenticated) {
      setBackendUser(null);
      setRegistrationError(null);
      resetRegisterCache();
      return;
    }

    void registerBackendUser();
  }, [accessToken, auth.isAuthenticated, registerBackendUser]);

  const value = useMemo<UserContextType>(
    () => ({
      backendUser,
      isAuthenticated: isAuthenticated,
      isAuthReady: isAuthReady,
      isLoading: auth.isLoading,
      isRegistering,
      registrationError,
      registerBackendUser,
      isAdmin: isAdmin,
    }),
    [
      backendUser,
      auth.isAuthenticated,
      auth.isLoading,
      isRegistering,
      registrationError,
      registerBackendUser,
      isAdmin,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
