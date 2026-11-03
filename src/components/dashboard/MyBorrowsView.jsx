"use client";

import { useState } from "react";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  RotateCcw,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";
import Link from "next/link";

import { demoBooks } from "@/data/demoBooks";

const initialBorrows = [
  {
    id: "borrow-001",
    book: demoBooks[0],
    borrowDate: "2026-11-01",
    returnDate: "2026-11-08",
  },
  {
    id: "borrow-002",
    book: demoBooks[1],
    borrowDate: "2026-11-02",
    returnDate: "2026-11-09",
  },
  {
    id: "borrow-003",
    book: demoBooks[5],
    borrowDate: "2026-10-28",
    returnDate: "2026-11-04",
  },
];

const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function MyBorrowsView() {
  const [borrows, setBorrows] = useState(initialBorrows);
  const [returning, setReturning] = useState(null);

  const handleReturn = () => {
    setBorrows((previous) =>
      previous.filter((item) => item.id !== returning.id)
    );

    setReturning(null);

    toast.info(
      "Preview updated locally. Actual book return will be connected later."
    );
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-heading">
          <span className="home-eyebrow">YOUR READING JOURNEY</span>

          <h1>
            My <span>Borrows.</span>
          </h1>

          <p>
            Keep track of your borrowed books and their return dates.
          </p>
        </div>

        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <span>Currently Borrowed</span>
            <strong>{borrows.length.toString().padStart(2, "0")}</strong>
            <BookOpen size={23} />
          </div>

          <div className="dashboard-stat-card">
            <span>Due Soon</span>
            <strong>01</strong>
            <Clock3 size={23} />
          </div>

          <div className="dashboard-stat-card">
            <span>Reading Status</span>
            <strong>Active</strong>
            <CheckCircle2 size={23} />
          </div>
        </div>

        <section className="dashboard-card borrow-history-card">
          <div className="dashboard-toolbar">
            <div>
              <h2>Borrowing History</h2>
              <p>Your currently borrowed books.</p>
            </div>

            <Link href="/books" className="borrow-explore-link">
              Find More Books <ArrowRight size={16} />
            </Link>
          </div>

          <div className="borrow-list">
            {borrows.map((item) => (
              <article className="borrow-item" key={item.id}>
                <div className="borrow-item-cover">
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                  />
                </div>

                <div className="borrow-item-info">
                  <span>{item.book.category}</span>

                  <h3>{item.book.title}</h3>

                  <p>by {item.book.author}</p>

                  <div className="borrow-item-dates">
                    <span>
                      <CalendarDays size={14} />
                      Borrowed: {formatDate(item.borrowDate)}
                    </span>

                    <span>
                      <Clock3 size={14} />
                      Return: {formatDate(item.returnDate)}
                    </span>
                  </div>
                </div>

                <div className="borrow-item-action">
                  <span className="manage-status manage-status-available">
                    Borrowed
                  </span>

                  <button
                    onClick={() => setReturning(item)}
                    className="borrow-return-button"
                  >
                    <RotateCcw size={15} />
                    Return Book
                  </button>
                </div>
              </article>
            ))}

            {borrows.length === 0 && (
              <div className="borrow-empty">
                <BookOpen size={42} />

                <h3>Your reading journey is waiting.</h3>

                <p>You haven't borrowed any books in this preview.</p>

                <Link href="/books" className="dashboard-primary-button">
                  Explore Books <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {returning && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => setReturning(null)}
        >
          <div
            className="dashboard-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dashboard-modal-close"
              onClick={() => setReturning(null)}
            >
              <X size={19} />
            </button>

            <div className="confirm-icon return-confirm-icon">
              <RotateCcw size={25} />
            </div>

            <h2>Return this book?</h2>

            <p>
              You are about to return{" "}
              <strong>{returning.book.title}</strong>.
            </p>

            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => setReturning(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-return"
                onClick={handleReturn}
              >
                <CheckCircle2 size={16} />
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}