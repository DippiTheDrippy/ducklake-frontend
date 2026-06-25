export const oidcConfig = {
  authority: `${import.meta.env.VITE_OIDC_URL}/realms/${import.meta.env.VITE_OIDC_REALM}`,
  client_id: `${import.meta.env.VITE_OIDC_CLIENT_ID}`,

  redirect_uri: `${import.meta.env.VITE_REDIRECT_URI}/auth/callback`,
  post_logout_redirect_uri: `${import.meta.env.VITE_REDIRECT_URI}`,

  response_type: "code",
  scope: "openid profile email",

  metadataUrl: `${import.meta.env.VITE_OIDC_URL}/realms/${import.meta.env.VITE_OIDC_REALM}/.well-known/openid-configuration`,
};
