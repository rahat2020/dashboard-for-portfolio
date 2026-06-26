import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../app/api/auth/authenticationApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { Mail, Lock, Shield, Eye, EyeOff } from "react-feather";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const { email, password, rememberMe } = data;
      const result = await loginUser({ email, password }).unwrap();

      dispatch(
        setCredentials({
          user: result?.data?.admin || result?.data?.user || result?.user,
          token: result?.data?.token || result?.token,
          rememberMe,
        }),
      );

      toast.success("Welcome back to the dashboard!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err?.data?.message || err?.error || "An error occurred during login";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0f] to-[#0a0a0f] z-0" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[150px] rounded-full z-0 animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/20 blur-[150px] rounded-full z-0 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full z-0 animate-blob animation-delay-4000" />

      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10 mx-4">
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

        <div className="relative p-10 bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden">
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-2xl mb-6 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <Shield
                className="text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                size={36}
                strokeWidth={1.5}
              />
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-3">
              Admin Portal
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Authenticate to access the dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            <div className="space-y-4">
              <div className="group relative">
                <FormInput
                  label=""
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  register={register}
                  error={errors.email?.message}
                  icon={
                    <Mail
                      size={18}
                      className="text-gray-500 group-focus-within:text-violet-400 transition-colors duration-300"
                    />
                  }
                  className="[&>div>input]:bg-white/5 [&>div>input]:border-white/10 [&>div>input]:h-14 [&>div>input]:pl-12 hover:[&>div>input]:border-white/20 focus:[&>div>input]:border-violet-500/50 focus:[&>div>input]:bg-white/10 transition-all shadow-inner"
                />
              </div>

              <div className="group relative">
                <FormInput
                  label=""
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  register={register}
                  error={errors.password?.message}
                  icon={
                    <Lock
                      size={18}
                      className="text-gray-500 group-focus-within:text-violet-400 transition-colors duration-300"
                    />
                  }
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-300 focus:outline-none transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  className="[&>div>input]:bg-white/5 [&>div>input]:border-white/10 [&>div>input]:h-14 [&>div>input]:pl-12 hover:[&>div>input]:border-white/20 focus:[&>div>input]:border-violet-500/50 focus:[&>div>input]:bg-white/10 transition-all shadow-inner [&>div>input]:pr-12"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-700 rounded bg-transparent checked:bg-violet-600 checked:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200 cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-400 font-medium group-hover:text-gray-200 transition-colors select-none">
                  Remember me (1 Year)
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth={true}
              loading={isLoading}
              className="h-14 w-full mt-4 flex items-center justify-center text-base font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center w-full">
                Login
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
