import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "THEIA — Oracle Labs Investigation" },
  description:
    "At 23:47, THEIA called the police on its own maker. Your team has until morning.",
  openGraph: {
    title: "THEIA — Oracle Labs Investigation",
    description:
      "At 23:47, THEIA called the police on its own maker. Your team has until morning.",
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

/**
 * THEIA is an Artifact, not a platform module: it keeps its own dark, in-fiction
 * look and its own metadata. Platform modules follow PJX_UI_STYLE_GUIDE.md instead.
 */
export default function TheiaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
