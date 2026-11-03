"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  X,
} from "lucide-react";

import BookCard from "@/components/books/BookCard";
import { demoBooks } from "@/data/demoBooks";

const categories = [
  "All Categories",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function BooksCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("title");

  const filteredBooks = useMemo(() => {
    let result = [...demoBooks];

    const term = search.toLowerCase().trim();

    if (term) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
      );
    }

    if (category !== "All Categories") {
      result = result.filter(
        (book) => book.category === category
      );
    }

    if (availability === "available") {
      result = result.filter(
        (book) => book.availableCopies > 0
      );
    }

    if (availability === "unavailable") {
      result = result.filter(
        (book) => book.availableCopies === 0
      );
    }

    if (sort === "title") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "copies") {
      result.sort(
        (a, b) => b.availableCopies - a.availableCopies
      );
    }

    return result;
  }, [search, category, availability, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setAvailability("all");
    setSort("title");
  };

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="catalog-hero-content">
          <span className="home-eyebrow">
            THE BOOKNOOK COLLECTION
          </span>

          <h1>
            Every shelf has a <span>story.</span>
          </h1>

          <p>
            Explore our collection of stories, ideas and
            knowledge. Your next favorite book might be
            closer than you think.
          </p>

          <div className="catalog-hero-stats">
            <div>
              <strong>08</strong>
              <span>Preview Books</span>
            </div>

            <span className="catalog-stat-line" />

            <div>
              <strong>05</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-container">
        <div className="catalog-toolbar">
          <div>
            <span className="home-eyebrow">
              FIND YOUR NEXT READ
            </span>

            <h2>Explore Books</h2>

            <p>
              {filteredBooks.length} books in this collection
            </p>
          </div>

          <div className="catalog-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="catalog-filters">
          <div className="catalog-filter-title">
            <SlidersHorizontal size={17} />
            <span>Filter Collection</span>
          </div>

          <div className="catalog-filter-controls">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Not Available</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="title">Sort: Title</option>
              <option value="copies">Most Available</option>
            </select>

            <button
              className="catalog-reset"
              onClick={clearFilters}
            >
              Reset
            </button>
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="catalog-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <BookOpen size={42} />

            <h3>No books found</h3>

            <p>
              Try another title, author or category.
            </p>

            <button
              className="catalog-reset"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}