
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Compass,
  Sparkles,
} from "lucide-react";

import HeroSlider from "@/components/home/HeroSlider";

export const metadata = {
  title: "Home",
};

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

    return result.data || [];
  } catch (error) {
    console.error("Unable to load latest books:", error);
    return [];
  }
}

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Discover",
    description:
      "Explore a growing collection and find a book that speaks to you.",
  },
  {
    number: "02",
    icon: Bookmark,
    title: "Borrow",
    description:
      "Choose your favorite book and add it to your personal reading journey.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Return",
    description:
      "Enjoy your reading and return the book when you finish.",
  },
];

const categories = [
  {
    name: "Fiction",
    description: "Stories beyond imagination",
    icon: "✦",
  },
  {
    name: "Science",
    description: "Explore how our world works",
    icon: "◈",
  },
  {
    name: "History",
    description: "Discover stories from the past",
    icon: "⌘",
  },
  {
    name: "Kids",
    description: "Little stories, big adventures",
    icon: "✧",
  },
];

export default async function HomePage() {
  const books = await getLatestBooks();

  return (
    <main className="home-page">
      <HeroSlider />

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

      <section className="how-section">
        <div className="home-section">
          <div className="center-heading">
            <span className="home-eyebrow">
              SIMPLE AS IT SHOULD BE
            </span>

            <h2>
              Reading made <span>effortless.</span>
            </h2>

            <p>
              Your next favorite book is only three simple steps away.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article className="step-card" key={step.number}>
                  <div className="step-top">
                    <span>{step.number}</span>
                    <Icon size={26} />
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section category-section">
        <div className="section-heading">
          <div>
            <span className="home-eyebrow">
              FIND YOUR NEXT CHAPTER
            </span>

            <h2>
              Browse by <span>interest.</span>
            </h2>

            <p>
              Every reader has a different world to explore.
            </p>
          </div>

          <Sparkles size={30} className="gold-sparkle" />
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              href={`/books?category=${category.name}`}
              className="category-card"
              key={category.name}
            >
              <span className="category-symbol">
                {category.icon}
              </span>

              <h3>{category.name}</h3>

              <p>{category.description}</p>

              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="home-eyebrow">
            YOUR STORY STARTS HERE
          </span>

          <h2>
            Make room for <span>one more book.</span>
          </h2>

          <p>
            Find a story, borrow a book, and discover something new.
          </p>

          <Link href="/books" className="hero-button">
            Explore the Library
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}