import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <div className="flex mt-12 w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
