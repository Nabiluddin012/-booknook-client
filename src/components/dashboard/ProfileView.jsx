
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
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ProfileView() {
  const { data: session, isPending } = authClient.useSession();

  const [imageFailed, setImageFailed] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const user = session?.user;
  const profileImage = uploadedImage || user?.image;

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const input = event.currentTarget;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be below 5 MB.");
      input.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("Image upload configuration is missing.");
      input.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.error?.message || "Image upload failed."
        );
      }

      const imageUrl =
        uploadResult.data.display_url || uploadResult.data.url;

      const { error } = await authClient.updateUser({
        image: imageUrl,
      });

      if (error) {
        throw new Error(error.message || "Profile update failed.");
      }

      setUploadedImage(imageUrl);
      setImageFailed(false);

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error(error.message || "Unable to update profile picture.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <PageHeading
          eyebrow="YOUR PERSONAL SPACE"
          title="My"
          accent="Profile."
          description="Your BookNook account and personal information."
        />

        <section className="profile-dashboard">
          <div className="profile-cover">
            <span>BOOKNOOK MEMBER</span>
          </div>

          <div className="profile-main-card">
            <div className="profile-main-top">
              <div className="profile-large-avatar">
                {profileImage && !imageFailed ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <span>
                    {user?.name?.charAt(0)?.toUpperCase() || "R"}
                  </span>
                )}

                <label
                  htmlFor="profile-image-upload"
                  className="profile-camera-icon"
                  title="Change profile picture"
                  style={{
                    cursor: uploading ? "not-allowed" : "pointer",
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? (
                    <span>...</span>
                  ) : (
                    <Camera size={15} />
                  )}
                </label>

                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploading || !user}
                  onChange={handleImageChange}
                />
              </div>

              <div className="profile-main-info">
                <span>BOOKNOOK READER</span>

                <h2>
                  {isPending
                    ? "Loading profile..."
                    : user?.name || "Guest Reader"}
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
