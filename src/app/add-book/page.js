import { Suspense } from "react";

import AddBookForm from "@/components/dashboard/AddBookForm";
import PrivatePageFallback from "@/components/ui/PrivatePageFallback";
import { requireUser } from "@/lib/require-user";

export const metadata = {
  title: "Add Book",
};

async function ProtectedPageContent() {
  await requireUser("/add-book");
  return <AddBookForm />;
}

export default function AddBookFormPage() {
  return (
    <Suspense fallback={<PrivatePageFallback />}>
      <ProtectedPageContent />
    </Suspense>
  );
}
