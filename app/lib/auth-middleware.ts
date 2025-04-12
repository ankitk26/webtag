import { createMiddleware } from "@tanstack/react-start";
import { fetchUser } from "./supabase/fetch-user-server-fn";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await fetchUser();
  if (!user) {
    throw new Error("Unauthorized request");
  }

  return next({ context: { user } });
});
