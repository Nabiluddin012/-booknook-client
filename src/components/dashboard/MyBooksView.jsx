"use client";

import { useState } from "react";

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

import Link from "next/link";
import { toast } from "sonner";

import { demoBooks } from "@/data/demoBooks";

export default function MyBooksView() {
  const [books, setBooks] = useState(demoBooks.slice(0, 5));

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (book) => {
    setEditing({ ...book });
  };

  const handleSave = (e) => {
    e.preventDefault();

    setBooks((previous) =>
      previous.map((book) =>
        book._id === editing._id ? editing : book
      )
    );

    setEditing(null);

    toast.info(
      "Preview updated locally. Database update will be connected later."
    );
  };

  const handleDelete = () => {
    setBooks((previous) =>
      previous.filter((book) => book._id !== deleting._id)
    );

    setDeleting(null);

    toast.info(
      "Removed from preview only. Database deletion will be connected later."
    );
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-heading dashboard-heading-row">
          <div>
            <span className="home-eyebrow">YOUR CONTRIBUTIONS</span>

            <h1>
              My <span>Books.</span>
            </h1>

            <p>Manage and organize the books you have shared.</p>
          </div>

          <Link href="/add-book" className="dashboard-primary-button">
            <Plus size={17} />
            Add New Book
          </Link>
        </div>

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
                (total, book) => total + book.availableCopies,
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
                          onClick={() => handleEdit(book)}
                          aria-label="Edit book"
                          title="Edit book"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="manage-delete-button"
                          onClick={() => setDeleting(book)}
                          aria-label="Delete book"
                          title="Delete book"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="manage-empty">
                        No matching books found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {editing && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => setEditing(null)}
        >
          <form
            className="dashboard-modal"
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="dashboard-modal-close"
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
                value={editing.totalCopies}
                onChange={(e) => {
                  const copies = Number(e.target.value);

                  setEditing({
                    ...editing,
                    totalCopies: copies,
                    availableCopies: Math.max(
                      0,
                      copies -
                        (editing.totalCopies - editing.availableCopies)
                    ),
                  });
                }}
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

            <button className="dashboard-primary-button" type="submit">
              <Save size={17} />
              Save Changes
            </button>
          </form>
        </div>
      )}

      {deleting && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => setDeleting(null)}
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
              <strong>{deleting.title}</strong> from this preview?
            </p>

            <div className="confirm-actions">
              <button
                onClick={() => setDeleting(null)}
                className="confirm-cancel"
              >
                Keep Book
              </button>

              <button
                onClick={handleDelete}
                className="confirm-delete"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}