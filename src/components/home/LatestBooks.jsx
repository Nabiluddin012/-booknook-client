import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
async function getLatestBooks() {
  const apiURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const response = await fetch(
      `${apiURL}/books?limit=6`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    unstable_rethrow(error);
    
    console.error("Unable to load latest books:", error);
    return [];
  }
}

export default async function LatestBooks() {
  const books = await getLatestBooks();

  return (
    <section className="home-section arrivals-section">
      <div className="section-heading">
        <div>
          <span className="home-eyebrow">
            FRESH FROM THE SHELF
          </span>

          <h2>
            New <span>Arrivals</span>
          </h2>

          <p>
            A little something new for your next reading session.
          </p>
        </div>

        <Link href="/books" className="section-link">
          View All Books <ArrowRight size={17} />
        </Link>
      </div>

      {books.length > 0 ? (
        <div className="book-grid">
          {books.map((book) => (
            <article className="book-card" key={book._id}>
              <div className="book-image-wrap">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="book-image-placeholder">
                    <BookOpen size={40} />
                  </div>
                )}

                <span className="book-category">
                  {book.category}
                </span>
              </div>

              <div className="book-info">
                <h3>{book.title}</h3>
                <p>by {book.author}</p>

                <Link
                  href={`/books/${book._id}`}
                  className="book-details-link"
                >
                  View Details <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-books">
          <BookOpen size={42} />

          <h3>The shelves are waiting.</h3>

          <p>
            New books will appear here as they join our library.
          </p>

          <Link href="/books" className="section-link">
            Explore Library <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <div className="arrivals-bottom">
        <Link href="/books" className="outline-button">
          Explore All Books <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}