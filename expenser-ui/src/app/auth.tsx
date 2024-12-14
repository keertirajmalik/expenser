import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen w-full items-center justify-center px-4">
    {children}
  </div>
);

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}

export { LoginPage, SignupPage };
