import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}

function SignupPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm />
    </div>
  );
}

export { LoginPage, SignupPage };
