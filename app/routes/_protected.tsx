import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: "/login" });
    }

    return {
      user: context.authUser,
    };
  },
});
