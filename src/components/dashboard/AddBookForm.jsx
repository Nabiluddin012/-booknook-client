"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeading from "@/components/ui/PageHeading";

import {
  BookOpen,
  Upload,
  ImagePlus,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";




const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AddBookForm() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: "1",
  });

  useEffect(() => {
    if (!imageFile) {
      setPreview("");
      return;
    }

    const imageURL = URL.createObjectURL(imageFile);
    setPreview(imageURL);

    return () => URL.revokeObjectURL(imageURL);
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select a book cover image.");
      return;
    }

    toast.info(
      "Book form preview is ready. Database submission will be connected later."
    );
  };

  const removeImage = () => {
    setImageFile(null);
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <PageHeading
          eyebrow="GROW THE COLLECTION"
          title="Add a new"
          accent="book."
          description="Every new book brings a new world to our library."
        />

        <div className="add-book-layout">
          <form
            className="dashboard-card add-book-form"
            onSubmit={handleSubmit}
          >
            <div className="dashboard-card-heading">
              <BookOpen size={21} />

              <div>
                <h2>Book Information</h2>
                <p>Enter the details of your new book.</p>
              </div>
            </div>

            <div className="dashboard-field">
              <label>Book Title *</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                maxLength={120}
                required
              />
            </div>

            <div className="dashboard-field">
              <label>Author Name *</label>

              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                maxLength={100}
                required
              />
            </div>

            <div className="dashboard-two-fields">
              <div className="dashboard-field">
                <label>Category *</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dashboard-field">
                <label>Total Copies *</label>

                <input
                  name="totalCopies"
                  type="number"
                  min="1"
                  max="1000"
                  value={form.totalCopies}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dashboard-field">
              <label>Short Description *</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell readers what this book is about..."
                rows={5}
                maxLength={1200}
                required
              />

              <span className="field-counter">
                {form.description.length}/1200 characters
              </span>
            </div>

            <div className="dashboard-field">
              <label>Added By</label>

              <input
                value={session?.user?.name || ""}
                readOnly
                placeholder="Your name"
              />
            </div>

            <div className="dashboard-field">
              <label>Email Address</label>

              <input
                value={session?.user?.email || ""}
                readOnly
                placeholder="Your email"
              />
            </div>

            <button className="dashboard-primary-button" type="submit">
              Add Book to Collection
              <ArrowRight size={17} />
            </button>
          </form>

          <aside className="dashboard-card upload-panel">
            <div className="dashboard-card-heading">
              <ImagePlus size={21} />

              <div>
                <h2>Book Cover</h2>
                <p>Choose a beautiful cover image.</p>
              </div>
            </div>

            <label className="book-upload-area">
              {preview ? (
                <img
                  src={preview}
                  alt="Book cover preview"
                  className="book-upload-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <span>
                    <Upload size={27} />
                  </span>

                  <strong>Upload Book Cover</strong>

                  <p>Click to choose an image</p>

                  <small>PNG, JPG or WEBP</small>
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                hidden
              />
            </label>

            {preview && (
              <button
                type="button"
                className="remove-image-button"
                onClick={removeImage}
              >
                <X size={15} /> Remove Image
              </button>
            )}

            <div className="upload-guidelines">
              <h3>
                <CheckCircle2 size={17} />
                Cover Guidelines
              </h3>

              <p>Choose a clear and readable book cover.</p>
              <p>Use a portrait-oriented image where possible.</p>
              <p>Supported formats: JPG, PNG and WEBP.</p>
            </div>

            <div className="upload-note">
              Image hosting will be connected to imgbb during
              integration.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}