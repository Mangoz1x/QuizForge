import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import HeroAnimation from "@/components/HeroAnimation";

function JsonLd() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    url: siteUrl,
    description:
      "Turn your class notes, textbook passages, and study guides into ready-to-use Google Forms quizzes in minutes. Built for teachers.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "teacher",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd />

      {/* Nav */}
      <header>
      <nav className="border-b border-slate-100" aria-label="Main navigation">
        <div className="flex items-center justify-between px-4 lg:px-12 py-3.5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/Logo.svg" alt="" width={24} height={24} className="rounded" />
            <span className="text-lg font-semibold text-slate-900">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </div>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              Create quiz
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </nav>
      </header>

      <main>
      {/* Hero */}
      <section className="px-4 lg:px-12 pt-16 pb-20 lg:pt-24 lg:pb-28 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl lg:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight">
              Turn your class notes into Google Forms quizzes
            </h1>
            <p className="text-base lg:text-lg text-slate-500 leading-relaxed">
              Paste any class material and get a complete quiz with answer
              keys — exported directly to Google Forms, ready to share with
              students.
            </p>
            <div className="pt-1">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Create quiz
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl lg:max-w-none mx-auto">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Source-driven */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="px-4 lg:px-12 py-20 lg:py-28 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight">
                Your material.
                <br />
                <span className="text-slate-300">Your questions.</span>
              </h2>
              <p className="text-base lg:text-lg text-slate-500 leading-relaxed mt-6">
                Every question is generated from the content you provide — notes,
                textbook passages, study guides. No outside information, no AI
                hallucinations. Students are only tested on what they&apos;ve
                actually been taught.
              </p>
            </div>

            {/* UI component — source in, questions out */}
            <div className="flex flex-col gap-3">
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-3">You provide</div>
                <div className="space-y-2">
                  <div className="text-sm text-slate-500 leading-relaxed">
                    <span className="bg-slate-100 text-slate-700 px-1 rounded">Mitosis</span> is the process by which a single cell divides to produce two identical daughter cells. It occurs in <span className="bg-slate-100 text-slate-700 px-1 rounded">four stages</span>: prophase, metaphase, anaphase, and telophase...
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-slate-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-3">{process.env.NEXT_PUBLIC_APP_NAME} generates</div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500 shrink-0 mt-0.5">1</div>
                    <div className="text-sm text-slate-700">What are the four stages of mitosis?</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500 shrink-0 mt-0.5">2</div>
                    <div className="text-sm text-slate-700">What does mitosis produce?</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equivalent assessments */}
      <section className="border-t border-slate-100">
        <div className="px-4 lg:px-12 py-20 lg:py-28 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* UI component — two test versions stacked */}
            <div className="flex flex-col gap-3 md:order-1">
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-3">Version A — Original test</div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">1</div>
                    <div className="text-sm text-slate-700">Name the four stages of mitosis.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">2</div>
                    <div className="text-sm text-slate-700">What does mitosis produce?</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">3</div>
                    <div className="text-sm text-slate-700">During which phase do chromosomes align at the center?</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-slate-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-3">Version B — Makeup test</div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">1</div>
                    <div className="text-sm text-slate-700">Which phase follows prophase in mitosis?</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">2</div>
                    <div className="text-sm text-slate-700">How many cells result from a single round of mitosis?</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">3</div>
                    <div className="text-sm text-slate-700">In which phase do sister chromatids separate?</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:order-0">
              <h2 className="text-3xl lg:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight">
                Same depth.
                <br />
                <span className="text-slate-300">Different questions.</span>
              </h2>
              <p className="text-base lg:text-lg text-slate-500 leading-relaxed mt-6">
                Need a makeup test for students who were absent? Generate a new
                version with the same complexity and coverage — different
                questions, same standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="px-4 lg:px-12 py-20 lg:py-28 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight">
            Your data stays yours.
            <br />
            <span className="text-slate-300">Always.</span>
          </h2>
          <p className="text-base lg:text-lg text-slate-500 leading-relaxed mt-6 max-w-xl mx-auto">
            No account to create. No student information to enter. Google
            sign-in is only used to put the finished quiz into your
            Drive — use any Google account, even a throwaway. Nothing is
            stored on our end.
          </p>
        </div>
      </section>

      {/* Live sync */}
      <section className="border-t border-slate-100">
        <div className="px-4 lg:px-12 py-20 lg:py-28 max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight text-center mb-14">
            Edit here.
            <br />
            <span className="text-slate-300">Google Forms updates there.</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
            {/* App side */}
            <div className="flex-1 w-full border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="text-xs font-medium text-slate-400 ml-1">{process.env.NEXT_PUBLIC_APP_NAME}</span>
              </div>
              <div className="p-4 bg-white space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">1</div>
                  <div className="text-sm text-slate-400 line-through">Who wrote the Declaration of Independence?</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-semibold text-white">1</div>
                  <div className="text-sm font-medium text-slate-900">Which founding father authored the Declaration?</div>
                </div>
              </div>
            </div>

            {/* Sync arrow */}
            <div className="flex flex-col items-center gap-1 px-5 shrink-0">
              <div className="hidden md:block w-px h-0" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="hidden md:block w-8 h-px bg-slate-200" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                <div className="hidden md:block w-8 h-px bg-slate-200" />
              </div>
              <span className="text-[10px] font-medium text-slate-300 tracking-wide uppercase">synced</span>
            </div>

            {/* Google Forms side */}
            <div className="flex-1 w-full border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-[#673AB7] px-4 py-2.5">
                <span className="text-xs font-medium text-white/80">Google Forms</span>
              </div>
              <div className="bg-[#F0EBF8] p-4 space-y-3">
                <div className="bg-white rounded-lg border border-slate-200 p-3">
                  <div className="text-sm font-medium text-slate-900">Which founding father authored the Declaration?</div>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                      <span className="text-xs text-slate-500">George Washington</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                      <span className="text-xs text-slate-500">Thomas Jefferson</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="px-4 lg:px-12 py-20 lg:py-28 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Before / After visual */}
            <div className="flex flex-col gap-4">
              {/* Before */}
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-3">Before</div>
                <div className="flex items-end gap-3">
                  <div className="text-3xl lg:text-4xl font-semibold text-slate-900 leading-none">12 hrs</div>
                  <div className="text-base text-slate-400 leading-snug pb-0.5">per test</div>
                </div>
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 h-2 rounded-full bg-slate-900" />
                  ))}
                </div>
              </div>
              {/* After */}
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-3">After</div>
                <div className="flex items-end gap-3">
                  <div className="text-3xl lg:text-4xl font-semibold text-slate-900 leading-none">40 min</div>
                  <div className="text-base text-slate-400 leading-snug pb-0.5">per test</div>
                </div>
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`flex-1 h-2 rounded-full ${i === 0 ? "bg-slate-900" : "bg-slate-100"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Quote */}
            <div>
              <p className="text-3xl lg:text-4xl font-semibold text-slate-900 leading-[1.2] tracking-tight">
                &ldquo;It used to take me an entire weekend to write two
                tests. Now I do it during my prep period.&rdquo;
              </p>
              <p className="text-base lg:text-lg text-slate-500 leading-relaxed mt-6">
                Mr. L — High School History Teacher
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-100">
        <div className="px-4 lg:px-12 py-20 lg:py-28 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight mb-6">
            Stop writing quizzes by hand
          </h2>
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
              Create quiz
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="px-4 lg:px-12 py-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2">
                <img src="/Logo.svg" alt="" width={20} height={20} className="rounded" />
                <span className="text-sm font-semibold text-slate-900">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Quiz generation for educators
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <span className="text-xs text-slate-300">
              &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
