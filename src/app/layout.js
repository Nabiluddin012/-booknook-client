import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: "BookNook",
    template: "BookNook | %s",
  },
  description: "Discover, borrow and share your favorite books.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

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