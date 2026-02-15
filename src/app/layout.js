import { Inter } from "next/font/google";
import "./globals.css";
import DevClearButton from "@/components/DevClearButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuizForge",
  description: "Generate Google Forms quizzes from your class content",
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
