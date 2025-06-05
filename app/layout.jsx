import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
