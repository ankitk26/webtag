import { SignUpForm } from "~/components/auth/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: SignUp,
});

function SignUp() {
  return (
    <div className="flex mt-12 w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
