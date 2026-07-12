import { LoginForm } from "./login-form";
import { AuthLayout } from "@app/components/layouts";

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="mb-7 space-y-1">
        <h1 className="text-[25px] font-bold tracking-tight text-slate-900">Welcome Back!</h1>
        <p className="text-sm text-slate-500">Sign in to continue to your account</p>
      </div>
      <LoginForm />
    </AuthLayout>
  );
};

export { LoginPage };
