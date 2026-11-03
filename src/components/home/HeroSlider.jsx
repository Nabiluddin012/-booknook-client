"use client";

import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Pagination,
} from "swiper/modules";

import { ArrowRight, BookOpen } from "lucide-react";

const slides = [
  {
    eyebrow: "A WORLD BETWEEN PAGES",
    title: "Find your next great escape.",
    description:
      "Explore stories that inspire, challenge, and take you somewhere new.",
    button: "Explore the Library",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1800&q=85",
  },
  {
    eyebrow: "BORROW · READ · RETURN",
    title: "Good stories deserve to be shared.",
    description:
      "Borrow a book, enjoy every chapter, and pass the joy of reading along.",
    button: "Discover Books",
    image:
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1800&q=85",
  },
  {
    eyebrow: "MADE FOR CURIOUS MINDS",
    title: "Turn a quiet moment into an adventure.",
    description:
      "Build your reading habit with a collection made for every kind of reader.",
    button: "Start Exploring",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1800&q=85",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-slide"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(5,12,23,.96) 0%, rgba(5,12,23,.78) 48%, rgba(5,12,23,.25) 100%), url("${slide.image}")`,
              }}
            >
              <div className="hero-content">
                <span className="hero-eyebrow">
                  {slide.eyebrow}
                </span>

                <h1>{slide.title}</h1>

                <p>{slide.description}</p>

                <Link href="/books" className="hero-button">
                  {slide.button}
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="hero-slide-number">
                0{index + 1} <span>/ 03</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}