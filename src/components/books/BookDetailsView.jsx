"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  ShieldCheck,
  X,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function BookDetailsView({ book }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [modalOpen, setModalOpen] = useState(false);

  const available = book.availableCopies > 0;

  const handleBorrowClick = () => {
    if (isPending) return;

    if (!session?.user) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(`/books/${book._id}`)}`
      );

      return;
    }

    if (!available) {
      toast.error("This book is currently unavailable.");
      return;
    }

    setModalOpen(true);
  };

  const handleConfirmBorrow = () => {
    toast.info("Borrowing will be connected to the library API in the integration phase.");
    setModalOpen(false);
  };

  return (
    <main className="detail-page">
      <div className="detail-container">
        <Link href="/books" className="detail-back">
          <ArrowLeft size={17} />
          Back to Collection
        </Link>

        <div className="detail-layout">
          <div className="detail-cover-column">
            <div className="detail-cover-frame">
              <img src={book.image} alt={book.title} />

              <span className="detail-cover-label">
                BOOKNOOK COLLECTION
              </span>
            </div>

            <div className="detail-security-note">
              <ShieldCheck size={18} />
              <span>Curated for curious minds</span>
            </div>
          </div>

          <div className="detail-information">
            <span className="home-eyebrow">
              DISCOVER YOUR NEXT CHAPTER
            </span>

            <span className="detail-category">
              {book.category}
            </span>

            <h1>{book.title}</h1>

            <p className="detail-author">
              Written by <span>{book.author}</span>
            </p>

            <div className="detail-divider" />

            <h3>About this book</h3>

            <p className="detail-description">
              {book.description}
            </p>

            <div className="detail-availability">
              <div className="detail-availability-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <span>LIBRARY AVAILABILITY</span>

                <strong>
                  {available ? "Available to borrow" : "Currently unavailable"}
                </strong>

                <small>
                  {book.availableCopies} of {book.totalCopies} copies available
                </small>
              </div>

              <span
                className={`detail-status ${
                  available ? "status-available" : "status-unavailable"
                }`}
              >
                {available ? "Available" : "Unavailable"}
              </span>
            </div>

            <button
              className="detail-borrow-button"
              onClick={handleBorrowClick}
              disabled={!available || isPending}
            >
              {isPending
                ? "Checking Account..."
                : available
                  ? "Borrow This Book"
                  : "Not Available"}

              <ArrowRight size={18} />
            </button>

            <div className="detail-return-note">
              <CalendarDays size={16} />
              Standard borrowing period: 7 days
              <span />
              <Clock3 size={16} />
              Return on time
            </div>

            <div className="detail-added-by">
              <span>ADDED TO BOOKNOOK BY</span>

              <strong>{book.addedBy?.name || "BookNook Reader"}</strong>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="borrow-overlay"
          onClick={() => setModalOpen(false)}
        >
          <section
            className="borrow-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="borrow-modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close borrow dialog"
            >
              <X size={19} />
            </button>

            <span className="home-eyebrow">ONE MORE CHAPTER</span>

            <h2>Ready to borrow?</h2>

            <p className="borrow-modal-description">
              Review your borrowing details before confirming.
            </p>

            <div className="borrow-modal-book">
              <img src={book.image} alt={book.title} />

              <div>
                <strong>{book.title}</strong>
                <span>{book.author}</span>
              </div>
            </div>

            <div className="borrow-modal-field">
              <label>Reader Name</label>

              <input
                value={session?.user?.name || ""}
                readOnly
              />
            </div>

            <div className="borrow-modal-field">
              <label>Email Address</label>

              <input
                value={session?.user?.email || ""}
                readOnly
              />
            </div>

            <div className="borrow-date-note">
              <CalendarDays size={17} />
              Return within 7 days of borrowing.
            </div>

            <button
              className="detail-borrow-button"
              onClick={handleConfirmBorrow}
            >
              <Check size={18} />
              Confirm Borrow
            </button>

            <button
              className="borrow-cancel"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </section>
        </div>
      )}
    </main>
  );
}