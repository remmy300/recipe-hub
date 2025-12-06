"use client";

import { useRouter } from "next/navigation";
import GoogleAuthBtn from "@/components/GoogleAuthBtn";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";
import { loginUser } from "@/redux/features/auth/authThunks";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        // Redirect
        router.push("/add-recipe");
      } else {
        setError((result.payload as string) || "Login failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="font-medium">Email</label>
            <Input
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <GoogleAuthBtn />

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
