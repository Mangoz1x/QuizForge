"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, X } from "lucide-react";

const LANGUAGES = [
  {
    code: "EN",
    label: "English",
    questions: [
      {
        type: "Multiple Choice",
        title: "What are the four stages of mitosis?",
        options: [
          "Interphase, mitosis, cytokinesis, telophase",
          "Prophase, metaphase, anaphase, telophase",
          "G1, S, G2, M",
        ],
        correct: 1,
      },
      {
        type: "Short Answer",
        title: "What does mitosis produce?",
        answer: "Two identical daughter cells",
      },
    ],
  },
  {
    code: "ES",
    label: "Espa\u00f1ol",
    questions: [
      {
        type: "Opci\u00f3n m\u00faltiple",
        title: "\u00bfCu\u00e1les son las cuatro etapas de la mitosis?",
        options: [
          "Interfase, mitosis, citocinesis, telofase",
          "Profase, metafase, anafase, telofase",
          "G1, S, G2, M",
        ],
        correct: 1,
      },
      {
        type: "Respuesta corta",
        title: "\u00bfQu\u00e9 produce la mitosis?",
        answer: "Dos c\u00e9lulas hijas id\u00e9nticas",
      },
    ],
  },
  {
    code: "FR",
    label: "Fran\u00e7ais",
    questions: [
      {
        type: "Choix multiple",
        title: "Quelles sont les quatre \u00e9tapes de la mitose\u00a0?",
        options: [
          "Interphase, mitose, cytocin\u00e8se, t\u00e9lophase",
          "Prophase, m\u00e9taphase, anaphase, t\u00e9lophase",
          "G1, S, G2, M",
        ],
        correct: 1,
      },
      {
        type: "R\u00e9ponse courte",
        title: "Que produit la mitose\u00a0?",
        answer: "Deux cellules filles identiques",
      },
    ],
  },
];

export default function LanguageAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LANGUAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const lang = LANGUAGES[index];

  return (
    <div aria-hidden="true" className="w-full max-w-lg mx-auto">
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* Language bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-slate-400" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
              Quiz language
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {LANGUAGES.map((l, i) => (
              <span
                key={l.code}
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors duration-300 ${
                  i === index
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {l.code}
              </span>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="p-3 md:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2.5"
            >
              {lang.questions.map((q, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-2.5 px-3 pt-3 pb-1.5">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                      {i + 1}
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {q.type}
                    </span>
                  </div>
                  <div className="px-3 pb-1.5">
                    <p className="text-xs font-medium text-slate-900">
                      {q.title}
                    </p>
                  </div>
                  {q.options && (
                    <div className="px-3 pb-2">
                      <div className="border border-dashed border-slate-200 rounded px-2.5 py-1.5 flex flex-col gap-1">
                        {q.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[11px] ${
                              oi === q.correct
                                ? "bg-green-50/60 border border-green-200"
                                : "bg-red-50/40"
                            }`}
                          >
                            {oi === q.correct ? (
                              <Check
                                size={10}
                                className="flex-shrink-0 text-green-500"
                              />
                            ) : (
                              <X
                                size={10}
                                className="flex-shrink-0 text-red-400"
                              />
                            )}
                            <span
                              className={
                                oi === q.correct
                                  ? "text-green-700"
                                  : "text-slate-500"
                              }
                            >
                              {opt}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {q.answer && (
                    <div className="px-3 pb-3">
                      <div className="border border-dashed border-slate-200 rounded px-2.5 py-2 mb-1.5">
                        <p className="text-[11px] text-slate-400">
                          {lang.code === "EN"
                            ? "Student enters answer here..."
                            : lang.code === "ES"
                              ? "El estudiante ingresa su respuesta aqu\u00ed..."
                              : "L'\u00e9l\u00e8ve entre sa r\u00e9ponse ici..."}
                        </p>
                      </div>
                      <div className="flex items-start gap-1.5 px-2.5 py-1.5 bg-green-50/60 border border-green-200 rounded">
                        <Check
                          size={10}
                          className="flex-shrink-0 text-green-500 mt-0.5"
                        />
                        <p className="text-[11px] text-green-700">
                          <span className="font-medium">
                            {lang.code === "EN"
                              ? "Model answer:"
                              : lang.code === "ES"
                                ? "Respuesta modelo:"
                                : "R\u00e9ponse mod\u00e8le\u00a0:"}
                          </span>{" "}
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
