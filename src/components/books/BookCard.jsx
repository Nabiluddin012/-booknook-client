import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function BookCard({ book }) {
  const available = book.availableCopies > 0;

  return (
    <article className="catalog-card">
      <Link
        href={`/books/${book._id}`}
        className="catalog-image-link"
      >
        <div className="catalog-image-wrap">
          <img
            src={book.image}
            alt={book.title}
            className="catalog-image"
            loading="lazy"
          />

          <span className="catalog-category">
            {book.category}
          </span>

          <span
            className={`catalog-availability ${
              available ? "is-available" : "is-unavailable"
            }`}
          >
            <span />
            {available ? "Available" : "Not Available"}
          </span>

          <div className="catalog-image-overlay">
            <span>Explore Book <ArrowUpRight size={17} /></span>
          </div>
        </div>
      </Link>

      <div className="catalog-card-info">
        <div className="catalog-card-meta">
          <span>BOOK NOOK COLLECTION</span>
          <BookOpen size={15} />
        </div>

        <h3>{book.title}</h3>

        <p className="catalog-author">by {book.author}</p>

        <div className="catalog-card-bottom">
          <span>
            {book.availableCopies} of {book.totalCopies} copies
          </span>

          <Link
            href={`/books/${book._id}`}
            className="catalog-view-link"
          >
            Details <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}