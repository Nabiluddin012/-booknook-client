import { Suspense } from "react";

import ProfileView from "@/components/dashboard/ProfileView";
import PrivatePageFallback from "@/components/ui/PrivatePageFallback";
import { requireUser } from "@/lib/require-user";

export const metadata = {
  title: "My Profile",
};

async function ProtectedPageContent() {
  await requireUser("/profile");
  return <ProfileView />;
}

export default function ProfileViewPage() {
  return (
    <Suspense fallback={<PrivatePageFallback />}>
      <ProtectedPageContent />
    </Suspense>
  );
}
