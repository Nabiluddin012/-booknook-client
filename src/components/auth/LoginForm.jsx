"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import AuthFrame from "./AuthFrame";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestedPath = searchParams.get("callbackUrl");

  const callbackURL =
    requestedPath?.startsWith("/") &&
    !requestedPath.startsWith("//")
      ? requestedPath
      : "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      return toast.error("Please enter your email and password.");
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to BookNook!");

      router.replace(callbackURL);
      router.refresh();
    } catch {
      toast.error("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset is not enabled for this assignment.");
  };

  return (
    <AuthFrame>
      <h2>Welcome Back</h2>

      <p className="auth-subtitle">
        Sign in to continue your reading journey.
      </p>

      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Email Address</label>

          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>

          <input
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="auth-link"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In →"}
        </button>
      </form>

      <div className="auth-divider">OR CONTINUE WITH</div>

      <GoogleSignInButton callbackURL={callbackURL} />

      <p className="auth-bottom">
        New to BookNook?{" "}
        <Link href="/register" className="auth-link">
          Create Account
        </Link>
      </p>
    </AuthFrame>
  );
}