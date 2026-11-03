import Link from "next/link";

import {
  BookOpen,
  ArrowLeft,
  Search,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <BookOpen size={38} />
        </div>

        <span className="home-eyebrow">
          A STORY NOT FOUND
        </span>

        <h1>404</h1>

        <h2>This page is off the shelf.</h2>

        <p>
          It seems the page you're looking for has wandered into another
          chapter. Let's help you find your way back.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="dashboard-primary-button">
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <Link href="/books" className="not-found-outline">
            <Search size={17} />
            Browse Books
          </Link>
        </div>

        <span className="not-found-decoration">
          EVERY PAGE HAS A STORY
        </span>
      </div>
    </main>
  );
}