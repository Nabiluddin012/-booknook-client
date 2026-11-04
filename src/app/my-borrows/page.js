import { Suspense } from "react";

import MyBorrowsView from "@/components/dashboard/MyBorrowsView";
import PrivatePageFallback from "@/components/ui/PrivatePageFallback";
import { requireUser } from "@/lib/require-user";

export const metadata = {
  title: "My Borrows",
};

async function ProtectedPageContent() {
  await requireUser("/my-borrows");
  return <MyBorrowsView />;
}

export default function MyBorrowsViewPage() {
  return (
    <Suspense fallback={<PrivatePageFallback />}>
      <ProtectedPageContent />
    </Suspense>
  );
}
