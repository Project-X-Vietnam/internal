import type { Metadata } from "next";
import { Special_Elite, Inter, JetBrains_Mono } from "next/font/google";
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

// Metadata in the portal — dates, counts, statuses, IDs — is set in mono so it
// reads as data rather than prose. Nothing else uses it.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://internal.projectxvietnam.org"),
  title: {
    default: "PJX Internal",
    template: "%s — PJX Internal",
  },
  description:
    "Team directory, knowledge hub and artifacts for the Project X Vietnam team.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${specialElite.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
