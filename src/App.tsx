import { useEffect, useRef } from "react";
import { useRoutes } from "react-router-dom";
import { useAuth, hasAuthParams } from "react-oidc-context";

import { routes } from "./AppRoutes";
import Message from "./pages/Message";

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
    return (
      <Message
        title="Checking your session"
        message="Please wait while we verify your login."
      />
    );
  }

  if (auth.activeNavigator === "signinRedirect") {
    return (
      <Message
        title="Redirecting to sign in"
        message="You are being sent to the login page."
      />
    );
  }

  if (auth.activeNavigator === "signoutRedirect") {
    return (
      <Message
        title="Signing you out"
        message="You are being redirected after sign out."
      />
    );
  }

  if (auth.isLoading) {
    return <Message title="Loading" message="Preparing your session." />;
  }

  if (auth.error) {
    return (
      <Message
        title="Login failed"
        message="Something went wrong while signing you in."
        severity="error"
        details={`${auth.error.source} caused: ${auth.error.message}`}
        actionLabel="Try again"
        onAction={() => {
          void auth.signinRedirect();
        }}
      />
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <Message
        title="Unable to log in"
        message="Your session could not be started."
        severity="warning"
        details="Please try signing in again. If the problem continues, contact support."
        actionLabel="Sign in again"
        onAction={() => {
          void auth.signinRedirect();
        }}
      />
    );
  }

  return pages;
}

export default App;
