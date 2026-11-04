import { Suspense } from "react";
import { notFound } from "next/navigation";

import BookDetailsView from "@/components/books/BookDetailsView";
import PrivatePageFallback from "@/components/ui/PrivatePageFallback";
import { requireUser } from "@/lib/require-user";

async function getBook(id) {
  const apiURL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  try {
    const response = await fetch(
      `${apiURL}/books/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Book Details",
};

async function ProtectedBookDetails({ params }) {
  const { id } = await params;
  await requireUser(`/books/${id}`);

  const book = await getBook(id);
  if (!book) notFound();

  return <BookDetailsView book={book} />;
}

export default function BookDetailsPage({ params }) {
  return (
    <Suspense fallback={<PrivatePageFallback />}>
      <ProtectedBookDetails params={params} />
    </Suspense>
  );
}
