"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  MessageSquare,
  Upload,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  ClipboardPaste,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";

const STORAGE_KEY = "quizforge_tutorial_seen";

function StepIndicator({ total, current }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`block h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 bg-slate-900"
              : i < current
              ? "w-1.5 bg-slate-400"
              : "w-1.5 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

// Step 1: Welcome illustration — animated quiz document
function WelcomeVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="relative">
        <div className="w-32 h-40 border-2 border-slate-200 rounded-lg bg-white">
          <div className="p-3 space-y-2.5">
            <div className="h-2.5 w-20 bg-slate-200 rounded-full tutorial-line-1" />
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2 tutorial-line-2">
                <span className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <div className="h-2 w-14 bg-slate-100 rounded-full" />
              </div>
              <div className="flex items-center gap-2 tutorial-line-3">
                <span className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                </span>
                <div className="h-2 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="flex items-center gap-2 tutorial-line-4">
                <span className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <div className="h-2 w-12 bg-slate-100 rounded-full" />
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2 tutorial-line-5">
                <span className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <div className="h-2 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="flex items-center gap-2 tutorial-line-6">
                <span className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <div className="h-2 w-10 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Create quiz — button press animation
function CreateVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="flex flex-col items-center gap-4">
        <div className="w-56 border-2 border-slate-200 rounded-lg bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-3 w-20 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-md">
              <Plus size={12} className="text-white" />
              <span className="text-xs font-medium text-white">New Quiz</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-full border border-dashed border-slate-200 rounded-md flex items-center justify-center tutorial-card-appear-1">
              <div className="flex items-center gap-2">
                <FileText size={12} className="text-slate-300" />
                <div className="h-2 w-16 bg-slate-100 rounded-full" />
              </div>
            </div>
            <div className="h-8 w-full border border-dashed border-slate-200 rounded-md flex items-center justify-center tutorial-card-appear-2">
              <div className="flex items-center gap-2">
                <FileText size={12} className="text-slate-300" />
                <div className="h-2 w-20 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Paste & generate — chat/content flow
function GenerateVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-56 flex flex-col gap-3">
        <div className="flex items-start gap-2 tutorial-msg-1">
          <ClipboardPaste size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <div className="space-y-1">
              <div className="h-1.5 w-32 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-24 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-28 bg-slate-100 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Pasted content</p>
          </div>
        </div>
        <div className="flex items-start gap-2 tutorial-msg-2">
          <MessageSquare size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <p className="text-xs text-slate-600 tutorial-typing">
              Create 5 questions about this
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 tutorial-msg-3">
          <Sparkles size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <div className="flex items-center gap-1.5">
              <span className="streaming-dot" style={{ animationDelay: "0s" }} />
              <span className="streaming-dot" style={{ animationDelay: "0.2s" }} />
              <span className="streaming-dot" style={{ animationDelay: "0.4s" }} />
              <span className="text-xs text-slate-400 ml-1">Generating quiz...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Review & export — completion animation
function ExportVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="flex flex-col items-center gap-4">
        <div className="w-56 border-2 border-slate-200 rounded-lg bg-white p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 tutorial-check-1">
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              <div className="h-2 w-full bg-slate-100 rounded-full" />
            </div>
            <div className="flex items-center gap-2 tutorial-check-2">
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
            </div>
            <div className="flex items-center gap-2 tutorial-check-3">
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              <div className="h-2 w-5/6 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 border-2 border-slate-200 rounded-lg bg-white">
          <Upload size={14} className="text-slate-600" />
          <span className="text-xs font-medium text-slate-700">Export to Google Forms</span>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description:
      `${process.env.NEXT_PUBLIC_APP_NAME} helps you create ready-to-use Google Forms quizzes in seconds. Paste your class content and let AI generate a complete quiz for you.`,
    Visual: WelcomeVisual,
  },
  {
    title: "Create a New Quiz",
    description:
      "Start by clicking \"New Quiz\" on your dashboard. Each quiz is saved automatically, so you can always come back to it later.",
    Visual: CreateVisual,
  },
  {
    title: "Paste Content & Generate",
    description:
      "Paste your class notes, textbook material, or any content. Then describe the quiz you want — like \"Create 10 multiple choice questions about photosynthesis.\"",
    Visual: GenerateVisual,
  },
  {
    title: "Review & Export",
    description:
      "Review the generated questions, make any edits you need, then export directly to Google Forms. Your quiz is ready for students.",
    Visual: ExportVisual,
  },
];

export default function TutorialDialog() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(STORAGE_KEY);
  });
  const [step, setStep] = useState(0);

  function handleClose() {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  if (!open) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/20 tutorial-backdrop-in"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-lg overflow-hidden tutorial-modal-in">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          aria-label="Close tutorial"
        >
          <X size={16} />
        </button>

        <div className="bg-slate-50 border-b border-slate-200">
          <div key={step} className="tutorial-step-in">
            <current.Visual />
          </div>
        </div>

        <div className="p-6">
          <div key={step} className="tutorial-step-in">
            <h2 className="text-lg font-medium text-slate-900 mb-2">
              {current.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <StepIndicator total={steps.length} current={step} />
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                icon={isLast ? undefined : ChevronRight}
                iconPosition="right"
                onClick={handleNext}
              >
                {isLast ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
