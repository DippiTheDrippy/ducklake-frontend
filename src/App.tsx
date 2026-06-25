import { useEffect, useRef } from "react";
import { useRoutes } from "react-router-dom";
import { useAuth, hasAuthParams } from "react-oidc-context";
import { routes } from "./AppRoutes";

function App() {
  const auth = useAuth();
  const pages = useRoutes(routes);
  const hasTriedSignin = useRef(false);

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !hasTriedSignin.current
    ) {
      hasTriedSignin.current = true;
      void auth.signinRedirect();
    }
  }, [
    auth.isLoading,
    auth.isAuthenticated,
    auth.activeNavigator,
    auth.signinRedirect,
  ]);

  if (auth.activeNavigator === "signinSilent") {
    return null;
  }

  if (auth.activeNavigator === "signinRedirect") {
    return null;
  }

  if (auth.activeNavigator === "signoutRedirect") {
    return null;
  }

  if (auth.isLoading) {
    return null;
  }

  if (auth.error) {
    return (
      <div>
        Oops… {auth.error.source} caused {auth.error.message}
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <div>Unable to log in</div>;
  }

  return pages;
}

export default App;
