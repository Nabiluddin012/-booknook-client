import { notFound } from "next/navigation";

import BookDetailsView from "@/components/books/BookDetailsView";

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

export async function generateMetadata({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  return {
    title: book?.title || "Book Details",
  };
}

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) notFound();

  return <BookDetailsView book={book} />;
}