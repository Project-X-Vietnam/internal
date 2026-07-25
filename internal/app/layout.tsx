import type { Metadata } from "next";
import { Special_Elite, Inter } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://internal.projectxvietnam.org"),
  title: "THEIA — Oracle Labs Investigation",
  description: "At 23:47, THEIA called the police on its own maker. Your team has until morning.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "THEIA — Oracle Labs Investigation",
    description: "At 23:47, THEIA called the police on its own maker. Your team has until morning.",
    images: [
      {
        url: "/preview_icon.png",
        width: 1200,
        height: 630,
        alt: "THEIA Investigation",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${specialElite.variable} ${inter.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
