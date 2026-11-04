import { Suspense } from "react";

import MyBooksView from "@/components/dashboard/MyBooksView";
import PrivatePageFallback from "@/components/ui/PrivatePageFallback";
import { requireUser } from "@/lib/require-user";

export const metadata = {
  title: "My Books",
};

async function ProtectedPageContent() {
  await requireUser("/my-books");
  return <MyBooksView />;
}

export default function MyBooksViewPage() {
  return (
    <Suspense fallback={<PrivatePageFallback />}>
      <ProtectedPageContent />
    </Suspense>
  );
}
