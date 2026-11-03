import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <main className="booknook-loading">
      <div className="loading-content">
        <div className="loading-logo">
          <BookOpen size={29} />
        </div>

        <div className="loading-ring" />

        <h2>BookNook</h2>

        <p>Opening a new chapter...</p>
      </div>
    </main>
  );
}