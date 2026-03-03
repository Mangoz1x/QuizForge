"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function AccessKeyForm() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/dashboard";
        return;
      } else {
        setError(data.error || "Invalid access key");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Enter your access key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        error={error}
        autoFocus
        disabled={loading}
      />
      <Button
        type="submit"
        size="lg"
        icon={LogIn}
        disabled={loading || !key.trim()}
        className="w-full"
      >
        {loading ? "Verifying..." : "Continue"}
      </Button>
    </form>
  );
}
