import Link from "next/link";
import { BookOpen, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="site-logo">
              <span className="site-logo-icon">
                <BookOpen size={23} />
              </span>

              <span className="site-logo-text">
                BookNook
                <small>THE READING ROOM</small>
              </span>
            </Link>

            <p>
              A quiet corner for curious minds. Discover new stories,
              share your favorites, and make every reading day special.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <Link href="/">Home</Link>
            <Link href="/books">All Books</Link>
            <Link href="/register">Join BookNook</Link>
          </div>

          <div className="footer-column">
            <h4>Your Library</h4>
            <Link href="/add-book">Add a Book</Link>
            <Link href="/my-books">My Books</Link>
            <Link href="/my-borrows">My Borrows</Link>
          </div>

          <div className="footer-column">
            <h4>Stay Connected</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram <ArrowUpRight size={13} />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              X <ArrowUpRight size={13} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={13} />
            </a>

            <p className="footer-contact">
              <Mail size={15} />
              Contact information to be added
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 BookNook. All rights reserved.</span>
          <span>Made for readers, by readers.</span>
        </div>
      </div>
    </footer>
  );
}