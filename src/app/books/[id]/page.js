import { notFound } from "next/navigation";

import { demoBooks } from "@/data/demoBooks";
import BookDetailsView from "@/components/books/BookDetailsView";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const book = demoBooks.find((item) => item._id === id);

  return {
    title: book ? book.title : "Book Details",
  };
}

export default async function BookDetailsPage({ params }) {
  const { id } = await params;

  const book = demoBooks.find((item) => item._id === id);

  if (!book) {
    notFound();
  }

  return <BookDetailsView book={book} />;
}