"use client";

import { useState } from "react";
import PageHeading from "@/components/ui/PageHeading";

import {
  UserRound,
  Mail,
  ShieldCheck,
  BookOpen,
  CalendarDays,
  Camera,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function ProfileView() {
  const { data: session, isPending } = authClient.useSession();

  const [imageFailed, setImageFailed] = useState(false);

  const user = session?.user;

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-heading">
          <span className="home-eyebrow">YOUR PERSONAL SPACE</span>

          <h1>
            My <span>Profile.</span>
          </h1>

          <p>Your BookNook account and personal information.</p>
        </div>

        <section className="profile-dashboard">
          <div className="profile-cover">
            <span>BOOKNOOK MEMBER</span>
          </div>

          <div className="profile-main-card">
            <div className="profile-main-top">
              <div className="profile-large-avatar">
                {user?.image && !imageFailed ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <span>
                    {user?.name?.charAt(0)?.toUpperCase() || "R"}
                  </span>
                )}

                <span className="profile-camera-icon">
                  <Camera size={15} />
                </span>
              </div>

              <div className="profile-main-info">
                <span>BOOKNOOK READER</span>

                <h2>
                  {isPending ? "Loading profile..." : user?.name || "Guest Reader"}
                </h2>

                <p>
                  {user?.email || "Sign in to view your account."}
                </p>
              </div>

              <div className="profile-member-badge">
                <ShieldCheck size={17} />
                Member
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <span>
                  <UserRound size={17} />
                  FULL NAME
                </span>

                <strong>{user?.name || "Not available"}</strong>
              </div>

              <div className="profile-detail-item">
                <span>
                  <Mail size={17} />
                  EMAIL ADDRESS
                </span>

                <strong>{user?.email || "Not available"}</strong>
              </div>

              <div className="profile-detail-item">
                <span>
                  <CalendarDays size={17} />
                  ACCOUNT STATUS
                </span>

                <strong>
                  {user ? "Active Member" : "Not signed in"}
                </strong>
              </div>

              <div className="profile-detail-item">
                <span>
                  <BookOpen size={17} />
                  MEMBERSHIP
                </span>

                <strong>BookNook Reader</strong>
              </div>
            </div>

            <div className="profile-bottom-note">
              Your account information is managed securely by BookNook.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}