import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import HeroAnimation from "@/components/HeroAnimation";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="flex items-center justify-between px-4 lg:px-12 py-3.5 max-w-6xl mx-auto">
          <span className="text-lg font-semibold text-slate-900">
            QuizForge
          </span>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              Create quiz
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </nav>

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
            {/* QuizForge side */}
            <div className="flex-1 w-full border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="text-xs font-medium text-slate-400 ml-1">QuizForge</span>
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
    </div>
  );
}
