"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const countDueSoon = (items) => {
  const now = new Date();
  const dueLimit = new Date(now);
  dueLimit.setDate(dueLimit.getDate() + 2);

  return items.filter((book) => {
    const returnDate = new Date(book.returnDate);
    return (
      !Number.isNaN(returnDate.getTime()) &&
      returnDate >= now &&
      returnDate <= dueLimit
    );
  }).length;
};

export default function MyBorrowsView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [returning, setReturning] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace(
        `/login?callbackUrl=${encodeURIComponent("/my-borrows")}`
      );
      return;
    }

    let active = true;

    const loadBorrows = async () => {
      try {
        setLoading(true);

        const result = await apiRequest("/borrows", {
          requiresAuth: true,
        });

        if (active) {
          const items = result.data || [];
          setBorrows(items);
          setDueSoonCount(countDueSoon(items));
        }
      } catch (error) {
        if (active) {
          toast.error(error.message || "Unable to load borrowed books.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBorrows();

    return () => {
      active = false;
    };
  }, [user, isPending, router]);

  const handleReturn = async () => {
    if (!returning || returnLoading) return;

    try {
      setReturnLoading(true);

      await apiRequest(`/borrows/${returning._id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      const remainingBorrows = borrows.filter(
        (item) => item._id !== returning._id
      );
      setBorrows(remainingBorrows);
      setDueSoonCount(countDueSoon(remainingBorrows));
      setReturning(null);

      toast.success("Book returned successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to return this book.");
    } finally {
      setReturnLoading(false);
    }
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
            <span>Return Due Soon</span>
            <strong>{dueSoonCount}</strong>
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

          {loading ? (
            <div className="borrow-empty">
              <div className="loading-ring" />
              <p>Loading your borrowed books...</p>
            </div>
          ) : borrows.length > 0 ? (
            <div
              className="borrow-table-scroll"
              role="region"
              aria-label="Borrowed books table"
              tabIndex={0}
            >
              <table className="borrow-table">
                <thead>
                  <tr>
                    <th scope="col">Book</th>
                    <th scope="col">Borrow Date</th>
                    <th scope="col">Return Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="borrow-table-book">
                          <img src={item.bookImage} alt={item.bookTitle} />
                          <div>
                            <strong>{item.bookTitle}</strong>
                            <span>BookNook Collection</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="borrow-table-date">
                          <CalendarDays size={14} />
                          {formatDate(item.borrowDate)}
                        </span>
                      </td>
                      <td>
                        <span className="borrow-table-date">
                          <Clock3 size={14} />
                          {formatDate(item.returnDate)}
                        </span>
                      </td>
                      <td>
                        <span className="manage-status manage-status-available">
                          Borrowed
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setReturning(item)}
                          className="borrow-return-button"
                        >
                          <RotateCcw size={15} />
                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="borrow-empty">
              <BookOpen size={42} />
              <h3>Your reading journey is waiting.</h3>
              <p>You haven&apos;t borrowed any books yet.</p>
              <Link href="/books" className="dashboard-primary-button">
                Explore Books <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      </div>

      {returning && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => !returnLoading && setReturning(null)}
        >
          <div
            className="dashboard-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="dashboard-modal-close"
              disabled={returnLoading}
              onClick={() => setReturning(null)}
              aria-label="Close return confirmation"
            >
              <X size={19} />
            </button>

            <div className="confirm-icon return-confirm-icon">
              <RotateCcw size={25} />
            </div>

            <h2>Return this book?</h2>
            <p>
              You are about to return{" "}
              <strong>{returning.bookTitle}</strong>.
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-cancel"
                disabled={returnLoading}
                onClick={() => setReturning(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-return"
                disabled={returnLoading}
                onClick={handleReturn}
              >
                <CheckCircle2 size={16} />
                {returnLoading ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
