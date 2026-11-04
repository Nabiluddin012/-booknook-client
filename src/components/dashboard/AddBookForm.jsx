"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
import { apiRequest } from "@/lib/api";
import PageHeading from "@/components/ui/PageHeading";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AddBookForm() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const previewUrlRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: "1",
  });

  const handleImageSelection = (file) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreview = file ? URL.createObjectURL(file) : "";
    previewUrlRef.current = nextPreview || null;

    setImageFile(file);
    setPreview(nextPreview);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?callbackUrl=%2Fadd-book");
    }
  }, [isPending, session?.user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!session?.user) {
      router.push("/login?callbackUrl=%2Fadd-book");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a book cover image.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!imgbbKey) {
      toast.error("Please configure your imgbb API key.");
      return;
    }

    setSubmitting(true);

    try {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);

      const uploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error("Book image upload failed.");
      }

      const imageURL =
        uploadResult.data.display_url || uploadResult.data.url;

      const result = await apiRequest("/books", {
        method: "POST",
        requiresAuth: true,
        body: JSON.stringify({
          ...form,
          totalCopies: Number(form.totalCopies),
          image: imageURL,
        }),
      });

      toast.success(result.message || "Book added successfully.");

      router.push("/my-books");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Unable to add this book.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-ring" />
        </div>
      </main>
    );
  }

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
                    <option key={category}>{category}</option>
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
              <input value={session.user.name || ""} readOnly />
            </div>

            <div className="dashboard-field">
              <label>Email Address</label>
              <input value={session.user.email || ""} readOnly />
            </div>

            <button
              className="dashboard-primary-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Uploading & Saving..." : "Add Book to Collection"}
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
                  <span><Upload size={27} /></span>
                  <strong>Upload Book Cover</strong>
                  <p>Click to choose an image</p>
                  <small>PNG, JPG or WEBP · Maximum 5 MB</small>
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  handleImageSelection(e.target.files?.[0] || null)
                }
                hidden
              />
            </label>

            {preview && (
              <button
                type="button"
                className="remove-image-button"
                onClick={() => handleImageSelection(null)}
              >
                <X size={15} /> Remove Image
              </button>
            )}

            <div className="upload-guidelines">
              <h3><CheckCircle2 size={17} /> Cover Guidelines</h3>
              <p>Choose a clear book cover.</p>
              <p>Use a portrait-oriented image where possible.</p>
              <p>Supported formats: JPG, PNG and WEBP.</p>
            </div>

            <div className="upload-note">
              Images are uploaded to imgbb and saved as book image URLs.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}