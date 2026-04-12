import { useState } from "react";
import { loginWithOAuth } from "../service/apiAuth";
import { useLogin, useSignup, useUser } from "../hooks/user/useAuth";
import { Lock, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isPending: isLoggingIn } = useLogin();
  const { signup, isPending: isSigningUp } = useSignup();
  const { isAuthenticated } = useUser();
  if (isAuthenticated) navigate("/");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) login({ email, password });
    else {
      signup({ email, password });
      setIsLogin(true);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Dev<span className="text-cyan-500">Notebook</span>
          </h2>
          <p className="mt-2 text-slate-400">
            {isLogin ? "Welcome back, dev!" : "Join the workspace."}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => loginWithOAuth("github")}
            className="cursor-pointer flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            <FaGithub size={24} /> GitHub
          </button>
          <button
            onClick={() => loginWithOAuth("google")}
            className="cursor-pointer flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-lg transition-colors"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-7"
              alt="G"
            />{" "}
            Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="dev@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn || isSigningUp}
            className="cursor-pointer w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="cursor-pointer text-cyan-500 hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
