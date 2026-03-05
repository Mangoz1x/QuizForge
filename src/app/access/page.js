import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AccessKeyForm from "@/components/AccessKeyForm";

export default function AccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Enter your access key
          </h1>
          <p className="text-sm text-slate-500">
            You need an access key to use {process.env.NEXT_PUBLIC_APP_NAME}.
          </p>
        </div>
        <AccessKeyForm />
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft size={14} />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
