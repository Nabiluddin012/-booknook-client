import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <p>Loading login page...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}