"use client";

import { useState } from "react";
import { loginTeam } from "@/lib/actions";

export default function LandingPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginTeam(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-bg text-warm-text relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9BBAA' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Timestamp */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.3em] text-warm-text-muted mb-6">
            23 : 47
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-warm-heading tracking-tight mb-3">
            THEIA
          </h1>
          <p className="text-sm text-warm-text-muted max-w-xs mx-auto leading-relaxed">
            Oracle Labs. Launch night. Something went wrong.
          </p>
        </div>

        {/* Login form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-warm-text-muted mb-1.5 uppercase tracking-wider">
              Team name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="off"
              className="w-full px-4 py-3 bg-warm-input border border-warm-border rounded-lg text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 transition-colors"
              placeholder="Enter team name"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-xs font-medium text-warm-text-muted mb-1.5 uppercase tracking-wider">
              Join code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              autoComplete="off"
              className="w-full px-4 py-3 bg-warm-input border border-warm-border rounded-lg text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 transition-colors"
              placeholder="Enter join code"
            />
          </div>

          {error && (
            <p className="text-sm text-warm-error text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entering..." : "Begin investigation"}
          </button>
        </form>

        <p className="text-center text-xs text-warm-text-faint mt-8">
          A Project X Vietnam experience
        </p>
      </div>
    </div>
  );
}
