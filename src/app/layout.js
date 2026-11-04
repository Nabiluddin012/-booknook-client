import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export const metadata = {
  title: {
    default: "BookNook",
    template: "BookNook | %s",
  },
  description:
    "Discover thoughtful reads, borrow books and explore new stories with BookNook.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>

        {children}

        <Footer />

        <Toaster
          position="top-right"
          richColors
          theme="dark"
          closeButton
        />
      </body>
    </html>
  );
}