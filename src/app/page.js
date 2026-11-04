
import Link from "next/link";
import { Suspense } from "react";
import LatestBooks from "@/components/home/LatestBooks";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Compass,
  Sparkles,
} from "lucide-react";

import HeroSlider from "@/components/home/HeroSlider";

export const metadata = {
  title: "Home",
};



const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Discover",
    description:
      "Explore a growing collection and find a book that speaks to you.",
  },
  {
    number: "02",
    icon: Bookmark,
    title: "Borrow",
    description:
      "Choose your favorite book and add it to your personal reading journey.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Return",
    description:
      "Enjoy your reading and return the book when you finish.",
  },
];

const categories = [
  {
    name: "Fiction",
    description: "Stories beyond imagination",
    icon: "✦",
  },
  {
    name: "Science",
    description: "Explore how our world works",
    icon: "◈",
  },
  {
    name: "History",
    description: "Discover stories from the past",
    icon: "⌘",
  },
  {
    name: "Kids",
    description: "Little stories, big adventures",
    icon: "✧",
  },
];

  export default function HomePage() {

  return (
    <main className="home-page">
      <HeroSlider />
    <Suspense
  fallback={
    <section className="home-section arrivals-section">
     <div className="empty-books">
        <h3>Loading latest books...</h3>
        <p>Fetching the newest books from our library.</p>
      </div>
    </section>
  }
>
    <LatestBooks />
  </Suspense>

      <section className="how-section">
        <div className="home-section">
          <div className="center-heading">
            <span className="home-eyebrow">
              SIMPLE AS IT SHOULD BE
            </span>

            <h2>
              Reading made <span>effortless.</span>
            </h2>

            <p>
              Your next favorite book is only three simple steps away.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article className="step-card" key={step.number}>
                  <div className="step-top">
                    <span>{step.number}</span>
                    <Icon size={26} />
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section category-section">
        <div className="section-heading">
          <div>
            <span className="home-eyebrow">
              FIND YOUR NEXT CHAPTER
            </span>

            <h2>
              Browse by <span>interest.</span>
            </h2>

            <p>
              Every reader has a different world to explore.
            </p>
          </div>

          <Sparkles size={30} className="gold-sparkle" />
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              href={`/books?category=${category.name}`}
              className="category-card"
              key={category.name}
            >
              <span className="category-symbol">
                {category.icon}
              </span>

              <h3>{category.name}</h3>

              <p>{category.description}</p>

              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="home-eyebrow">
            YOUR STORY STARTS HERE
          </span>

          <h2>
            Make room for <span>one more book.</span>
          </h2>

          <p>
            Find a story, borrow a book, and discover something new.
          </p>

          <Link href="/books" className="hero-button">
            Explore the Library
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}