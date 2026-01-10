import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://internal.projectxvietnam.org"),
  title: "Project X Vietnam",
  description: "Building the future of Vietnam's tech ecosystem. Join a community of innovators, entrepreneurs, and tech leaders.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Project X Vietnam",
    description: "Building the future of Vietnam's tech ecosystem. Join a community of innovators, entrepreneurs, and tech leaders.",
    images: [
      {
        url: "/preview_icon.png",
        width: 1200,
        height: 630,
        alt: "Project X Vietnam",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project X Vietnam",
    description: "Building the future of Vietnam's tech ecosystem.",
    images: ["/preview_icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
