import "./globals.css";

import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <Navbar />

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