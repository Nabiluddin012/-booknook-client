"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "All Books", href: "/books" },
  ];

  const privateLinks = [
    { label: "Add Book", href: "/add-book" },
    { label: "My Books", href: "/my-books" },
    { label: "My Borrows", href: "/my-borrows" },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setProfileOpen(false);
      setMenuOpen(false);

      toast.success("You have signed out successfully.");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link href="/" className="site-logo">
          <span className="site-logo-icon">
            <BookOpen size={23} />
          </span>

          <span className="site-logo-text">
            BookNook
            <small>THE READING ROOM</small>
          </span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={isActive(link.href) ? "nav-active" : ""}
            >
              {link.label}
            </Link>
          ))}

          {user &&
            privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={isActive(link.href) ? "nav-active" : ""}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="nav-actions">
          {!isPending && !user && (
            <>
              <Link href="/login" className="nav-login">
                Login
              </Link>

              <Link href="/register" className="nav-register">
                Get Started
              </Link>
            </>
          )}

          {user && (
            <div className="profile-menu">
              <button
                className="profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <span className="profile-avatar profile-initial">
                    {user.name?.charAt(0)?.toUpperCase() || "R"}
                  </span>
                )}

                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <UserRound size={16} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut size={16} />
                    {loggingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}