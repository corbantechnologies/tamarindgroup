"use client";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>The Tamarind Group</title>
        <meta
          name="description"
          content="The Tamarind Group: Feedbacks, Directory, and Hotel"
        />
      </head>
      <body>
        <Toaster position="top-center" />
        <NextAuthProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
