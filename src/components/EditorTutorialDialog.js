"use client";

import { useState } from "react";
import {
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  X,
  Pencil,
  Plus,
  Trash2,
  HelpCircle,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui";

const STORAGE_KEY = "quizforge_editor_tutorial_seen";

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

// Step 1: Chat bar visual
function ChatVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-64">
        <div className="border-2 border-slate-200 rounded-lg bg-white p-3 mb-3">
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-100 rounded-full" />
            <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
            <div className="h-2 w-5/6 bg-slate-100 rounded-full" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Your pasted content</p>
        </div>
        <div className="border-2 border-slate-200 rounded-lg bg-white p-2 flex items-center gap-2 tutorial-msg-1">
          <div className="flex-1 flex items-center">
            <MessageSquare size={12} className="text-slate-300 mr-2 flex-shrink-0" />
            <span className="text-xs text-slate-400 tutorial-typing">
              Create a 10 question quiz...
            </span>
          </div>
          <span className="p-1 bg-slate-900 rounded-md flex-shrink-0">
            <SendHorizontal size={10} className="text-white" />
          </span>
        </div>
      </div>
    </div>
  );
}

// Step 2: Modify questions visual
function ModifyVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-64 flex flex-col gap-2.5">
        <div className="border border-slate-200 rounded-lg bg-white p-2.5 flex items-center gap-2 tutorial-msg-1">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium text-slate-400">Q1</span>
              <div className="h-2 w-32 bg-slate-100 rounded-full" />
            </div>
            <div className="flex items-center gap-1 ml-4">
              <span className="w-2 h-2 rounded-full border border-slate-300" />
              <div className="h-1.5 w-16 bg-slate-50 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 tutorial-msg-2">
          <MessageSquare size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
            <p className="text-[11px] text-slate-600">&ldquo;Make this question harder&rdquo;</p>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg bg-white p-2.5 flex items-center gap-2 tutorial-msg-3">
          <Pencil size={12} className="text-slate-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium text-slate-400">Q1</span>
              <div className="h-2 w-36 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center gap-1 ml-4">
              <span className="w-2 h-2 rounded-full border border-slate-300" />
              <div className="h-1.5 w-20 bg-slate-50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Add & remove visual
function AddRemoveVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-64 flex flex-col gap-2">
        <div className="border border-slate-200 rounded-lg bg-white p-2.5 tutorial-msg-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-400">Q1</span>
            <div className="h-2 w-28 bg-slate-100 rounded-full" />
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg bg-white p-2.5 tutorial-msg-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-400">Q2</span>
            <div className="h-2 w-32 bg-slate-100 rounded-full" />
          </div>
          <Trash2 size={10} className="text-slate-300" />
        </div>
        <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50 p-2.5 tutorial-msg-3 flex items-center justify-center gap-1.5">
          <Plus size={12} className="text-slate-400" />
          <span className="text-[10px] text-slate-400 font-medium">New question added by AI</span>
        </div>
        <div className="flex items-start gap-2 mt-1 tutorial-line-4">
          <MessageSquare size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
            <p className="text-[11px] text-slate-600">&ldquo;Add 2 more about chapter 3&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Ask questions visual
function AskVisual() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-64 flex flex-col gap-2.5">
        <div className="flex items-start gap-2 tutorial-msg-1">
          <HelpCircle size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
            <p className="text-[11px] text-slate-600">&ldquo;Is the answer to Q3 correct?&rdquo;</p>
          </div>
        </div>
        <div className="flex items-start gap-2 tutorial-msg-2">
          <MessageSquare size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
            <div className="space-y-1">
              <div className="h-1.5 w-44 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-36 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 tutorial-msg-3">
          <HelpCircle size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
            <p className="text-[11px] text-slate-600">&ldquo;What key topics should I cover?&rdquo;</p>
          </div>
        </div>
        <div className="flex items-start gap-2 tutorial-line-4">
          <MessageSquare size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
            <div className="space-y-1">
              <div className="h-1.5 w-40 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-32 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-36 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Chat with AI",
    description:
      "Use the chat bar at the bottom to talk to the AI. Paste your class content and describe the quiz you want — it will generate all the questions for you.",
    Visual: ChatVisual,
  },
  {
    title: "Modify Questions",
    description:
      "Ask the AI to change any question. Try things like \"Make question 3 harder\" or \"Reword the first question to be clearer.\"",
    Visual: ModifyVisual,
  },
  {
    title: "Add & Remove Questions",
    description:
      "Need more questions? Say \"Add 3 more about chapter 5.\" Want fewer? Say \"Remove question 2\" or delete it manually with the trash icon.",
    Visual: AddRemoveVisual,
  },
  {
    title: "Ask About Your Content",
    description:
      "You can also ask the AI questions about your form — like \"Is the answer to Q3 correct?\" or \"What topics should I cover?\" It's not just for editing.",
    Visual: AskVisual,
  },
];

export default function EditorTutorialDialog() {
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
                {isLast ? "Got It" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
