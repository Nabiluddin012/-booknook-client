"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Search,
  Pencil,
  Trash2,
  BookOpen,
  Plus,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";

import { toast } from "sonner";

import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import PageHeading from "@/components/ui/PageHeading";

export default function MyBooksView() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login?callbackUrl=%2Fmy-books");
      return;
    }

    let active = true;

    const loadBooks = async () => {
      try {
        setLoading(true);

        const result = await apiRequest("/books?mine=true", {
          requiresAuth: true,
        });

        if (active) {
          setBooks(result.data || []);
        }
      } catch (error) {
        if (active) {
          toast.error(error.message || "Unable to load your books.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBooks();

    return () => {
      active = false;
    };
  }, [session?.user?.id, isPending, router]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editing || saving) return;

    try {
      setSaving(true);

      const result = await apiRequest(`/books/${editing._id}`, {
        method: "PATCH",
        requiresAuth: true,
        body: JSON.stringify({
          title: editing.title,
          author: editing.author,
          category: editing.category,
          description: editing.description,
          totalCopies: Number(editing.totalCopies),
        }),
      });

      setBooks((previous) =>
        previous.map((book) =>
          book._id === editing._id ? result.data : book
        )
      );

      setEditing(null);
      toast.success(result.message || "Book updated successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to update book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    try {
      setDeleting(true);

      const result = await apiRequest(
        `/books/${deleteTarget._id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      setBooks((previous) =>
        previous.filter((book) => book._id !== deleteTarget._id)
      );

      setDeleteTarget(null);

      toast.success(result.message || "Book deleted successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to delete this book.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <PageHeading
          eyebrow="YOUR CONTRIBUTIONS"
          title="My"
          accent="Books."
          description="Manage and organize the books you have shared."
          action={{
            href: "/add-book",
            label: "Add New Book",
          }}
        />

        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <span>Total Books</span>
            <strong>{books.length.toString().padStart(2, "0")}</strong>
            <BookOpen size={23} />
          </div>

          <div className="dashboard-stat-card">
            <span>Available Copies</span>
            <strong>
              {books.reduce(
                (total, book) => total + (book.availableCopies || 0),
                0
              )}
            </strong>
            <BookOpen size={23} />
          </div>

          <div className="dashboard-stat-card">
            <span>Out of Stock</span>
            <strong>
              {books.filter((book) => book.availableCopies === 0).length}
            </strong>
            <AlertTriangle size={23} />
          </div>
        </div>

        <section className="dashboard-card manage-books-card">
          <div className="dashboard-toolbar">
            <div>
              <h2>Your Collection</h2>
              <p>Manage the books you have added.</p>
            </div>

            <div className="dashboard-search">
              <Search size={17} />

              <input
                placeholder="Search your books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="manage-empty">Loading your collection...</div>
          ) : filteredBooks.length > 0 ? (
            <div className="manage-table-wrap">
              <table className="manage-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Category</th>
                    <th>Copies</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <div className="manage-book-cell">
                          <img src={book.image} alt={book.title} />

                          <div>
                            <strong>{book.title}</strong>
                            <span>{book.author}</span>
                          </div>
                        </div>
                      </td>

                      <td>{book.category}</td>

                      <td>
                        {book.availableCopies}/{book.totalCopies}
                      </td>

                      <td>
                        <span
                          className={`manage-status ${
                            book.availableCopies > 0
                              ? "manage-status-available"
                              : "manage-status-empty"
                          }`}
                        >
                          {book.availableCopies > 0
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </td>

                      <td>
                        <div className="manage-actions">
                          <button
                            onClick={() => setEditing({ ...book })}
                            aria-label="Edit book"
                            title="Edit book"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="manage-delete-button"
                            onClick={() => setDeleteTarget(book)}
                            aria-label="Delete book"
                            title="Delete book"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="manage-empty">
              {books.length === 0
                ? "You haven't added any books yet."
                : "No matching books found."}

              <p>
                <Link href="/add-book" className="auth-link">
                  Add your first book
                </Link>
              </p>
            </div>
          )}
        </section>
      </div>

      {editing && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => !saving && setEditing(null)}
        >
          <form
            className="dashboard-modal"
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="dashboard-modal-close"
              disabled={saving}
              onClick={() => setEditing(null)}
            >
              <X size={19} />
            </button>

            <span className="home-eyebrow">UPDATE COLLECTION</span>

            <h2>Edit Book Details</h2>

            <div className="dashboard-field">
              <label>Book Title</label>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                required
              />
            </div>

            <div className="dashboard-field">
              <label>Author</label>
              <input
                value={editing.author}
                onChange={(e) =>
                  setEditing({ ...editing, author: e.target.value })
                }
                required
              />
            </div>

            <div className="dashboard-field">
              <label>Category</label>
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                {["Fiction", "Science", "History", "Kids", "Others"].map(
                  (category) => (
                    <option key={category}>{category}</option>
                  )
                )}
              </select>
            </div>

            <div className="dashboard-field">
              <label>Total Copies</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={editing.totalCopies}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    totalCopies: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="dashboard-field">
              <label>Description</label>
              <textarea
                rows={4}
                value={editing.description}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              className="dashboard-primary-button"
              type="submit"
              disabled={saving}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="dashboard-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">
              <AlertTriangle size={25} />
            </div>

            <h2>Delete this book?</h2>

            <p>
              Are you sure you want to remove{" "}
              <strong>{deleteTarget.title}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                onClick={() => setDeleteTarget(null)}
                className="confirm-cancel"
                disabled={deleting}
              >
                Keep Book
              </button>

              <button
                onClick={handleDelete}
                className="confirm-delete"
                disabled={deleting}
              >
                <Trash2 size={15} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}