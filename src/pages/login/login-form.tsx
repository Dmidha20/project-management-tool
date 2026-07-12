import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@app/components/ui";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = () => {
    console.log(formData);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800">Email Address</label>
        <div className="relative">
          <Icon icon="mdi:email-outline" width={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800">Password</label>
        <div className="relative">
          <Icon icon="mdi:lock-outline" width={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          >
            <Icon icon={showPassword ? "mdi:eye" : "mdi:eye-off"} width={18} />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-0.5">
        <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          Forgot Password?
        </button>
      </div>

      <Button type="button" onClick={handleLogin} className="h-11 w-full rounded-lg bg-indigo-600 text-sm hover:bg-indigo-700">
        Sign In
      </Button>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button
        type="button"
        variant="outlined"
        icon={<Icon icon="flat-color-icons:google" width={18} />}
        className="h-10 w-full rounded-lg border-slate-200 text-xs font-medium"
      >
        Sign in with Google
      </Button>

      <p className="pt-1 text-center text-xs text-slate-600">
        Don&apos;t have an account?{" "}
        <button type="button" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign up
        </button>
      </p>
    </div>
  );
};

export { LoginForm };
