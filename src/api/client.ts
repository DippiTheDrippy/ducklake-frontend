// src/api/client.ts
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";

let accessToken: string | undefined;

export function setApiAccessToken(token: string | undefined) {
  accessToken = token;
}

export function hasApiAccessToken(): boolean {
  return Boolean(accessToken);
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return request;
  },
};

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});

api.use(authMiddleware);
