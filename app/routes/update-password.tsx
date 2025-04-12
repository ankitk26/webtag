import { UpdatePasswordForm } from "~/components/auth/update-password-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/update-password")({
  component: UpdatePassword,
});

function UpdatePassword() {
  return (
    <div className="flex mt-12 w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
