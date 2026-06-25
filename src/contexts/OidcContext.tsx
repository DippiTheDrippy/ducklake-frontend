import { AuthProvider } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { oidcConfig } from "../oidc";

export function OidcProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const navigate = useNavigate();

  const onSigninCallback = () => {
    globalThis.history.replaceState({}, document.title, "/");
    navigate("/", { replace: true });
  };

  return (
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      {children}
    </AuthProvider>
  );
}
