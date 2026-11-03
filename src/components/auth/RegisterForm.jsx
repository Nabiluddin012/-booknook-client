"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import AuthFrame from "./AuthFrame";
import GoogleSignInButton from "./GoogleSignInButton";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, image, password } = formData;

    if (!name.trim() || !email.trim() || !image.trim() || !password) {
      return toast.error("Please complete all fields.");
    }

    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      return toast.error(
        "Password needs uppercase, lowercase and 6 characters."
      );
    }

    try {
      new URL(image);
    } catch {
      return toast.error("Please enter a valid photo URL.");
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: image.trim(),
      });

     if (error) {
  toast.error(error.message || "Registration failed.");
  return;
}

const { error: logoutError } = await authClient.signOut();

      if (logoutError) {
        toast.error("Account created, but session cleanup failed. Please sign out.");
        router.replace("/");
        return;
      }

      toast.success("Account created successfully! Please login.");

      router.replace("/login?registered=true");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <h2>Create Account</h2>

      <p className="auth-subtitle">
        Join BookNook and discover your next favorite story.
      </p>

      <form onSubmit={handleRegister} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Full Name</label>

          <input
            className="auth-input"
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Email Address</label>

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Profile Photo URL</label>

          <input
            className="auth-input"
            type="url"
            name="image"
            placeholder="https://example.com/photo.jpg"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <span className="auth-hint">
            At least 6 characters, one uppercase and one lowercase letter.
          </span>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account →"}
        </button>
      </form>

      <div className="auth-divider">OR CONTINUE WITH</div>

      <GoogleSignInButton callbackURL="/" />

      <p className="auth-bottom">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">
          Sign In
        </Link>
      </p>
    </AuthFrame>
  );
}