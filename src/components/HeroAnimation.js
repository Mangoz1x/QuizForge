"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Circle, Check, X, ArrowUp, ChevronDown } from "lucide-react";

const PROMPT = "Create a 5-question quiz about the American Revolution";

const QUESTIONS = [
  {
    num: 1,
    type: "Multiple Choice",
    title: "What year did the American Revolution begin?",
    options: ["1776", "1775", "1774", "1783"],
    correct: 1,
    correctFeedback: "Correct! The first battles at Lexington and Concord took place in 1775.",
    incorrectFeedback: "Incorrect. The Revolution began in 1775 with the battles of Lexington and Concord.",
  },
  {
    num: 2,
    type: "Multiple Choice",
    title: "Which document declared independence from Britain?",
    options: [
      "The Constitution",
      "Declaration of Independence",
      "Bill of Rights",
      "Magna Carta",
    ],
    correct: 1,
    correctFeedback: "Correct! The Declaration of Independence was adopted on July 4, 1776.",
    incorrectFeedback: "Incorrect. The Declaration of Independence, not the Constitution, declared independence.",
  },
  {
    num: 3,
    type: "Short Answer",
    title: "Name the general who led the Continental Army.",
    answer: "George Washington",
  },
];


export default function HeroAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [fading, setFading] = useState(false);
  const [cursorStep, setCursorStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [exportClicked, setExportClicked] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutsRef = useRef([]);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const scrollToBottom = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const overflow = content.scrollHeight - viewport.clientHeight;
    if (overflow > 0) setScrollY(-overflow);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [cycle]);

  // Typewriter — 35ms per character
  useEffect(() => {
    if (phase !== 1) return;
    const interval = setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= PROMPT.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase + cursor orchestration (~11s cycle)
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Phase 0 → 1: empty → typewriter
    schedule(() => setPhase(1), 400);

    // Typing finishes ~2.4s. Cursor appears, glides to send button, clicks.
    schedule(() => setCursorStep(1), 2600);
    schedule(() => setCursorStep(2), 2900); // 400ms glide, arrives ~3300ms
    schedule(() => setPhase(2), 3500); // "click" — phase advances
    schedule(() => setCursorStep(0), 3700); // cursor lingers, then hides

    // Cards visible — reveal feedback (correct/incorrect + model answer)
    schedule(() => setShowFeedback(true), 4500);

    // After feedback, show scroll hint, then auto-scroll down
    schedule(() => setShowScrollHint(true), 5600);
    schedule(() => { setShowScrollHint(false); scrollToBottom(); }, 6100);

    // Phase 2 → 3: export
    schedule(() => setPhase(3), 7500);

    // Cursor glides to export button, clicks
    schedule(() => setCursorStep(3), 7800);
    schedule(() => setCursorStep(4), 8100);
    schedule(() => {
      setCursorStep(0);
      setExportClicked(true);
    }, 8700);
    schedule(() => setExportDone(true), 9700);

    // Phase 3 → 4: Google Form (reset scroll so form starts at top)
    schedule(() => {
      setPhase(4);
      setScrollY(0);
    }, 10200);

    // Google Form scroll — show hint, then scroll to bottom
    schedule(() => setShowScrollHint(true), 11400);
    schedule(() => { setShowScrollHint(false); scrollToBottom(); }, 11900);

    // Fade out and loop
    schedule(() => setFading(true), 14200);
    schedule(() => {
      setPhase(0);
      setTypedCount(0);
      setFading(false);
      setCursorStep(0);
      setShowFeedback(false);
      setExportClicked(false);
      setExportDone(false);
      setScrollY(0);
      setShowScrollHint(false);
      setCycle((c) => c + 1);
    }, 14800);
  }, [cycle, prefersReducedMotion, schedule, scrollToBottom]);

  if (prefersReducedMotion) {
    return (
      <div aria-hidden="true" className="w-full">
        <WindowChrome>
          <div className="p-3 flex flex-col gap-2.5">
            {QUESTIONS.map((q) => (
              <MockQuestionCard key={q.num} question={q} />
            ))}
          </div>
        </WindowChrome>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="w-full">
      <motion.div
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <WindowChrome>
          <div
            ref={containerRef}
            className="relative h-[400px] md:h-[460px] overflow-hidden"
          >
            <div
              key={cycle}
              className="flex flex-col h-full"
            >
              {/* Main content area */}
              <div ref={viewportRef} className="flex-1 overflow-hidden relative">
                {/* Phase 0-1: Empty state (absolute, doesn't scroll) */}
                {phase <= 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-slate-400">
                      Paste your content and generate a quiz
                    </p>
                  </div>
                )}

                {/* Phase 2: Streaming dots (absolute, doesn't scroll) */}
                {phase === 2 && (
                  <motion.div
                    className="absolute top-4 left-5 flex items-center gap-1.5 z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 0.4, duration: 0.2 }}
                  >
                    <span className="streaming-dot text-slate-400" />
                    <span
                      className="streaming-dot text-slate-400"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="streaming-dot text-slate-400"
                      style={{ animationDelay: "300ms" }}
                    />
                  </motion.div>
                )}

                {/* Scrollable content — translateY driven by timeline */}
                <motion.div
                  ref={contentRef}
                  key={phase <= 3 ? "quiz" : "form"}
                  className="p-3 md:p-4"
                  animate={{ y: scrollY }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  {/* Phases 2-3: Question cards */}
                  {phase >= 2 && phase <= 3 && (
                    <div className="flex flex-col gap-2.5">
                      {QUESTIONS.map((q, i) => (
                        <motion.div
                          key={q.num}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.6 + i * 0.18,
                            duration: 0.35,
                            ease: "easeOut",
                          }}
                        >
                          <MockQuestionCard question={q} showFeedback={showFeedback} />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Phase 4: Google Form */}
                  {phase === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <MockGoogleForm />
                    </motion.div>
                  )}
                </motion.div>

                {/* Scroll fade indicator + down arrow */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
                  animate={{ opacity: showScrollHint ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-16 bg-gradient-to-t from-white to-transparent" />
                  <motion.div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown size={14} className="text-slate-400" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Export bar — phase 3 */}
              {phase === 3 && (
                <ExportBar clicked={exportClicked} done={exportDone} />
              )}

              {/* Chat bar — phases 0-2 */}
              {phase <= 2 && (
                <div className="p-2.5 border-t border-slate-200">
                  <div className="flex items-end gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                    <div className="flex-1 text-xs md:text-sm min-h-[20px] leading-relaxed">
                      {phase === 0 && (
                        <span className="text-slate-400">
                          Describe the quiz you want to create...
                        </span>
                      )}
                      {phase >= 1 && (
                        <span className="text-slate-900">
                          {PROMPT.slice(0, typedCount)}
                          {typedCount < PROMPT.length && (
                            <span className="hero-cursor" />
                          )}
                        </span>
                      )}
                    </div>
                    <motion.div
                      className={`flex-shrink-0 p-1.5 rounded-xl transition-colors ${
                        typedCount >= PROMPT.length && phase === 1
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                      animate={
                        typedCount >= PROMPT.length && phase === 1
                          ? { scale: [1, 1.15, 1] }
                          : {}
                      }
                      transition={
                        typedCount >= PROMPT.length && phase === 1
                          ? {
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut",
                            }
                          : {}
                      }
                    >
                      <ArrowUp size={14} />
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Animated cursor overlay */}
            <AnimatedCursor step={cursorStep} containerRef={containerRef} />
          </div>
        </WindowChrome>
      </motion.div>
    </div>
  );
}

function WindowChrome({ children }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <span className="text-xs font-medium text-slate-400 ml-2">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </span>
      </div>
      {children}
    </div>
  );
}

function AnimatedCursor({ step, containerRef }) {
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setDims({ w: el.offsetWidth, h: el.offsetHeight });
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDims({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  if (dims.w === 0) return null;

  const positions = {
    0: { opacity: 0, x: dims.w * 0.5, y: dims.h * 0.7 },
    1: { opacity: 1, x: dims.w * 0.45, y: dims.h - 30 },
    2: { opacity: 1, x: dims.w - 22, y: dims.h - 20 },
    3: { opacity: 1, x: dims.w * 0.35, y: dims.h * 0.55 },
    4: { opacity: 1, x: dims.w - 80, y: dims.h - 14 },
  };

  const pos = positions[step] || positions[0];
  const isAppearing = step === 1 || step === 3;
  const isHiding = step === 0;

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none z-50"
      animate={{ opacity: pos.opacity, x: pos.x, y: pos.y }}
      transition={{
        opacity: { duration: isHiding ? 0.15 : isAppearing ? 0.2 : 0 },
        x: { duration: isAppearing ? 0 : 0.4, ease: "easeInOut" },
        y: { duration: isAppearing ? 0 : 0.4, ease: "easeInOut" },
      }}
    >
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 1L1.5 15L5.5 11L9 18.5L11.5 17.5L8 10.5L13 10.5L1.5 1Z"
          fill="white"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

function ExportBar({ clicked, done }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-3 md:px-4 py-2.5 border-t border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {done && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex-shrink-0"
            >
              <Check size={14} className="text-green-500" />
            </motion.div>
          )}
          <span className="text-xs text-slate-500 truncate">
            {done ? "Exported successfully" : "3 questions ready"}
          </span>
        </div>
        <motion.div
          className="flex-shrink-0 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg"
          animate={clicked ? { scale: [1, 0.92, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          Export to Google Forms
        </motion.div>
      </div>
      {clicked && (
        <div className="h-1 bg-slate-100">
          <motion.div
            className="h-full bg-slate-900 rounded-r-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

function MockQuestionCard({ question, showFeedback = true }) {
  const { num, type, title, options, correct, answer, correctFeedback, incorrectFeedback } = question;

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
          {num}
        </div>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          {type}
        </span>
      </div>
      <div className="px-3 pb-1.5">
        <p className="text-xs font-medium text-slate-900">{title}</p>
      </div>
      {options && showFeedback && (
        <motion.div
          className="px-3 pb-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="border border-dashed border-slate-200 rounded px-2.5 py-1.5 flex flex-col gap-1">
            {options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[11px] ${
                  i === correct
                    ? "bg-green-50/60 border border-green-200"
                    : "bg-red-50/40"
                } ${i >= 2 ? "hidden md:flex" : "flex"}`}
              >
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.15 + i * 0.05 }}
                >
                  {i === correct ? (
                    <Check size={10} className="flex-shrink-0 text-green-500" />
                  ) : (
                    <X size={10} className="flex-shrink-0 text-red-400" />
                  )}
                </motion.span>
                <span className={i === correct ? "text-green-700" : "text-slate-500"}>
                  {opt}
                </span>
              </div>
            ))}
          </div>
          {/* Correct feedback */}
          {correctFeedback && (
            <motion.div
              className="mt-1.5 px-2 py-1.5 bg-green-50/60 border border-green-200 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <p className="text-[10px] text-green-700 leading-relaxed">
                <Check size={8} className="inline-block mr-1 -mt-0.5 text-green-500" />
                {correctFeedback}
              </p>
            </motion.div>
          )}
          {/* Incorrect feedback */}
          {incorrectFeedback && (
            <motion.div
              className="mt-1 px-2 py-1.5 bg-red-50/60 border border-red-200 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <p className="text-[10px] text-red-600 leading-relaxed">
                <X size={8} className="inline-block mr-1 -mt-0.5 text-red-400" />
                {incorrectFeedback}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
      {type === "Short Answer" && (
        <div className="px-3 pb-2">
          <div className="border border-dashed border-slate-200 rounded px-2.5 py-2">
            <p className="text-[11px] text-slate-400">
              Student enters answer here...
            </p>
          </div>
        </div>
      )}
      {/* Model answer — animates in with feedback */}
      {type === "Short Answer" && answer && showFeedback && (
        <motion.div
          className="px-3 pb-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 bg-green-50/60 border border-green-200 rounded">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check size={10} className="flex-shrink-0 text-green-500 mt-0.5" />
            </motion.span>
            <p className="text-[11px] text-green-700">
              <span className="font-medium">Model answer:</span> {answer}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MockGoogleForm() {
  return (
    <div className="rounded-lg overflow-hidden bg-[#F0EBF8]">
      <div className="bg-[#673AB7] px-4 py-3">
        <p className="text-white text-sm font-medium">
          American Revolution Quiz
        </p>
        <p className="text-white/60 text-xs mt-0.5">
          {QUESTIONS.length} questions
        </p>
      </div>
      <div className="p-2.5 flex flex-col gap-2">
        {QUESTIONS.map((q, qi) => (
          <div key={qi} className="bg-white rounded-lg p-3">
            <p className="text-xs font-medium text-slate-900 mb-2">
              {q.title}
            </p>
            {q.options ? (
              <div className="flex flex-col gap-1.5">
                {q.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className={`flex items-center gap-2 text-[11px] ${
                      oi >= 2 ? "hidden md:flex" : "flex"
                    }`}
                  >
                    {oi === q.correct ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#673AB7] flex items-center justify-center flex-shrink-0">
                        <Check size={8} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    )}
                    <span
                      className={
                        oi === q.correct
                          ? "text-slate-900 font-medium"
                          : "text-slate-600"
                      }
                    >
                      {opt}
                    </span>
                  </div>
                ))}
                {q.correctFeedback && (
                  <div className="mt-1 px-2 py-1.5 bg-green-50 border border-green-200 rounded">
                    <p className="text-[10px] text-green-700 leading-relaxed">
                      <Check size={8} className="inline-block mr-1 -mt-0.5 text-green-500" />
                      {q.correctFeedback}
                    </p>
                  </div>
                )}
                {q.incorrectFeedback && (
                  <div className="mt-0.5 px-2 py-1.5 bg-red-50 border border-red-200 rounded">
                    <p className="text-[10px] text-red-600 leading-relaxed">
                      <X size={8} className="inline-block mr-1 -mt-0.5 text-red-400" />
                      {q.incorrectFeedback}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="border-b border-slate-200 pb-1">
                  <p className="text-[11px] text-slate-400">
                    Short answer text
                  </p>
                </div>
                {q.answer && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Check size={9} className="text-[#673AB7] flex-shrink-0" />
                    <span className="text-slate-700">
                      <span className="font-medium">Model answer:</span> {q.answer}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
