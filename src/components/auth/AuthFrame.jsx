import Link from "next/link";

export default function AuthFrame({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <Link href="/" className="auth-brand">
          <span className="auth-brand-mark">B</span>

          <span>
            BookNook
            <small>THE READING ROOM</small>
          </span>
        </Link>

        <div className="auth-layout">
          <section className="auth-story">
            <span className="auth-eyebrow">
              YOUR NEXT CHAPTER BEGINS HERE
            </span>

            <h1>
              Every great story starts with a{" "}
              <span>single page.</span>
            </h1>

            <p>
              Discover thoughtful reads, explore new worlds,
              and find your next favorite book at BookNook.
            </p>

            <div className="auth-story-note">
              <span />
              A little more room for stories.
            </div>
          </section>

          <section className="auth-card">
            {children}
          </section>
        </div>

        <footer className="auth-footer">
          © 2026 BookNook. Made for curious minds.
        </footer>
      </div>
    </main>
  );
}