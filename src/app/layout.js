import { Inter } from "next/font/google";
import "./globals.css";
import DevClearButton from "@/components/DevClearButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const description =
  "Turn your class notes, textbook passages, and study guides into ready-to-use Google Forms quizzes in minutes. Built for teachers.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — AI Quiz Generator for Teachers`,
    template: `%s — ${appName}`,
  },
  description,
  keywords: [
    "quiz generator",
    "Google Forms quiz",
    "AI quiz maker",
    "teacher tools",
    "classroom quiz",
    "auto generate quiz",
    "education technology",
    "edtech",
    "quiz from notes",
    "Google Forms",
    "assessment generator",
    "test maker for teachers",
  ],
  authors: [{ name: appName }],
  creator: appName,
  publisher: appName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: appName,
    title: `${appName} — AI Quiz Generator for Teachers`,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${appName} — AI Quiz Generator for Teachers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} — AI Quiz Generator for Teachers`,
    description,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {children}
        <DevClearButton />
      </body>
    </html>
  );
}
