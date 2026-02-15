import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { COOKIE_NAME } from "@/lib/auth";
import { Card } from "@/components/ui";
import AccessKeyForm from "@/components/AccessKeyForm";

export default async function Home() {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(COOKIE_NAME);

  if (accessCookie?.value === "valid") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <KeyRound size={28} className="text-slate-400" />
          <h1 className="text-2xl font-semibold text-slate-900">QuizForge</h1>
          <p className="text-sm text-slate-600">
            Enter your access key to continue
          </p>
        </div>
        <Card className="w-full p-6">
          <AccessKeyForm />
        </Card>
      </div>
    </div>
  );
}
