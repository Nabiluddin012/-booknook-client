"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function GoogleSignInButton({
  callbackURL = "/",
}) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (
      process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED !== "true"
    ) {
      toast.info("Google Login is waiting for OAuth configuration.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Google Login failed.");
        setLoading(false);
      }
    } catch {
      toast.error("Unable to connect with Google.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="auth-google"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      <span className="auth-google-mark">G</span>

      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}