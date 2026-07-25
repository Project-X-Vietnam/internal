"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  onSolve: (answer: string) => void;
};

const HINT_1 =
  "Hint 1: Before you dig, read the Flagged Intelligence section — those witness reports may matter later. Then: the page surface is only the cover. Open Elements, inspect this dashboard, and look for data attributes. One data attribute is encoded. Decode it, then find the element with that id.";

export function M3Puzzle({ onSolve }: Props) {
  const [findings, setFindings] = useState({
    codeword: "",
    impossibleClock: "",
  });
  const [dbSeeded, setDbSeeded] = useState(false);
  const [, setRevealSeen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    seedIndexedDB().then(() => setDbSeeded(true));
  }, []);

  async function seedIndexedDB() {
    return new Promise<void>((resolve) => {
      const req = indexedDB.open("oracle-labs-internal", 1);
      req.onupgradeneeded = () => {
        const idb = req.result;
        if (!idb.objectStoreNames.contains("vault")) {
          idb.createObjectStore("vault");
        }
      };
      req.onsuccess = () => {
        const idb = req.result;
        const tx = idb.transaction("vault", "readwrite");
        const store = tx.objectStore("vault");
        store.put("theia.reveal", "oracle-vault-key");
        store.put(
          "Hint 4: This value is the console function name.",
          "oracle-vault-note"
        );
        tx.oncomplete = () => {
          idb.close();
          resolve();
        };
      };
      req.onerror = () => resolve();
    });
  }

  useEffect(() => {
    if (!dbSeeded) return;

    const w = window as unknown as Record<string, unknown>;

    const theiaApi = {
      async reveal(arg: string) {
        if (!arg) {
          return [
            "[THEIA] Access denied.",
            "Hint 5: reveal() needs one argument.",
            "Use the corrected report time from M1, normalized to four digits.",
            'Example shape: await theia.reveal("HHMM")',
          ].join("\n");
        }

        const res = await fetch("/api/m3/reveal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ arg }),
        });
        const data = await res.json();

        if (data.success) {
          setRevealSeen(true);
          return data.payload;
        }

        return [
          `[THEIA] ${data.error ?? "Access denied."}`,
          "Hint 5: keep the value as a string and remove punctuation.",
          'Example shape: await theia.reveal("HHMM")',
        ].join("\n");
      },
    };

    w.theia = theiaApi;

    return () => {
      delete w.theia;
    };
  }, [dbSeeded]);

  useEffect(() => {
    if (!dbSeeded || !dashboardRef.current) return;

    const dashboard = dashboardRef.current;
    const hasHint = Array.from(dashboard.childNodes).some(
      (node) =>
        node.nodeType === Node.COMMENT_NODE &&
        node.nodeValue?.includes("Hint 1")
    );

    if (!hasHint) {
      dashboard.insertBefore(
        document.createComment(` ${HINT_1} `),
        dashboard.firstChild
      );
    }
  }, [dbSeeded]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSolve(JSON.stringify(findings));
  }

  if (!dbSeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-2 border-warm-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-text-muted">Initializing hidden systems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Briefing */}
      <div className="p-4 rounded-lg border border-warm-accent/15 bg-warm-accent/5 text-sm text-warm-text space-y-2">
        <p className="font-heading text-xs text-warm-accent uppercase tracking-wider">
          Kai&apos;s Private Dashboard — Hidden Layer
        </p>
        <p>
          You found the hidden route. Now go <em>underneath</em> this page.
          A paranoid genius buried something where accidents never find it.
        </p>
      </div>

      {/* The instrumented dashboard, kept dark as it represents THEIA's internal monitoring UI */}
      <div
        ref={dashboardRef}
        className="rounded-xl border border-[#2a2a3a] bg-[#0a0a1a] overflow-hidden text-white"
        data-theia="dGhlaWEtY29yZS0xNw=="
        data-hint="Hint 2: This is base64 encoded string. It names the hidden element to inspect next."
      >
        {/* Dashboard header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-mono text-xs text-purple-400">
              THEIA v3.1.7 — Private Instance
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-mono">
            user: kai.dang | session: terminated
          </span>
        </div>

        {/* Dashboard body */}
        <div className="p-6 space-y-6">
          {/* Status cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Prediction Engine</p>
              <p className="text-lg font-mono text-red-400 mt-1">OFFLINE</p>
              <p className="text-[10px] text-slate-600 mt-1">Last active: 2026-03-17 21:00</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Behavioral Models</p>
              <p className="text-lg font-mono text-amber-400 mt-1">9 LOADED</p>
              <p className="text-[10px] text-slate-600 mt-1">Suspects profiled: all</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Dead-man&apos;s Switch</p>
              <p className="text-lg font-mono text-emerald-400 mt-1">ARMED</p>
              <p className="text-[10px] text-slate-600 mt-1">Trigger: post-mortem auth</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Event Log — 2026-03-17</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex gap-4 text-slate-500">
                <span className="w-16 text-right text-slate-600">09:14</span>
                <span>kai.dang authenticated — session start</span>
              </div>
              <div className="flex gap-4 text-slate-500">
                <span className="w-16 text-right text-slate-600">14:22</span>
                <span>behavioral model &quot;ANDY&quot; updated — confidence 94.2%</span>
              </div>
              <div className="flex gap-4 text-slate-500">
                <span className="w-16 text-right text-slate-600">17:05</span>
                <span>dead-man&apos;s switch parameters finalized</span>
              </div>
              <div className="flex gap-4 text-slate-500">
                <span className="w-16 text-right text-slate-600">19:30</span>
                <span>prediction: launch-night events — scenario locked</span>
              </div>
              <div className="flex gap-4 text-amber-500/60">
                <span className="w-16 text-right text-amber-600">21:00</span>
                <span>kai.dang logged out — final session</span>
              </div>
              <div className="flex gap-4 text-red-500/60">
                <span className="w-16 text-right text-red-600">23:47</span>
                <span>EMERGENCY_CALL dispatched — floor 41 — source: THEIA</span>
              </div>
            </div>
          </div>

          {/* Flagged intelligence */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Flagged Intelligence — Behavioral Anomalies</p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-amber-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-amber-500">WITNESS</span>
                  <span className="text-[10px] text-slate-600">Linh Phạm — flagged 2026-02-25</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  &ldquo;I saw Kai twice in the same afternoon — once leaving the building, once
                  in the lobby twenty minutes later. Same clothes. He didn&apos;t recognize me
                  the second time.&rdquo;
                </p>
                <p className="text-[10px] text-slate-600 mt-1 italic">THEIA classification: identity variance — unresolved</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-red-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-red-400">MEDICAL</span>
                  <span className="text-[10px] text-slate-600">Dr. Hạnh Lý — post-incident review</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  &ldquo;I reviewed Kai&apos;s medical file before the examination. He was
                  diagnosed with a terminal condition eighteen months ago — confirmed,
                  documented, consistent across three consultations. When I examined the
                  body, nothing matched. No deterioration, no medication markers, no signs
                  of chronic illness. The body on that desk belonged to someone who was,
                  by every measure I know, healthy.&rdquo;
                </p>
                <p className="text-[10px] text-slate-600 mt-1 italic">THEIA classification: medical variance — critical</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-purple-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-purple-400">INTERNAL</span>
                  <span className="text-[10px] text-slate-600">Sơn Phan — file deposit 2026-03-15</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  &ldquo;I left a printout in the secure queue two days before launch night.
                  I didn&apos;t know what I was looking at — just three account transfers
                  that didn&apos;t match any project I was assigned to. The amounts were
                  large and the destination was offshore. I wrote &lsquo;in case I
                  disappear&rsquo; on the cover sheet because I&apos;d seen what happens
                  to people who ask questions about money at this company.&rdquo;
                </p>
                <p className="text-[10px] text-slate-600 mt-1 italic">THEIA classification: planted file — motive unclear</p>
              </div>
            </div>
          </div>

          {/* Hidden element — Layer 3 */}
          <div
            id="theia-core-17"
            data-store="oracle-vault-key"
            data-database="oracle-labs-internal"
            data-object-store="vault"
            data-hint="Hint 3: Open DevTools Application, IndexedDB, oracle-labs-internal, vault. Read the value at key oracle-vault-key."
            aria-hidden="true"
            style={{ display: "none" }}
          >
            Hidden systems do not speak on the surface. Read IndexedDB key
            oracle-vault-key in database oracle-labs-internal.
          </div>

          {/* Monitoring grid */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Behavioral Profiles — Access State</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Profile A", state: "LOCKED", note: "requires evidence anchor", color: "text-slate-500" },
                { name: "Profile B", state: "LOCKED", note: "requires evidence anchor", color: "text-slate-500" },
                { name: "Profile C", state: "WATCH", note: "timeline mismatch", color: "text-amber-400" },
                { name: "Profile D", state: "LOCKED", note: "requires evidence anchor", color: "text-slate-500" },
                { name: "Profile E", state: "WATCH", note: "identity variance", color: "text-amber-400" },
                { name: "Profile F", state: "LOCKED", note: "requires evidence anchor", color: "text-slate-500" },
                { name: "Profile G", state: "ARCHIVE", note: "medical variance", color: "text-purple-400" },
                { name: "Profile H", state: "ARCHIVE", note: "planted file", color: "text-purple-400" },
                { name: "Profile I", state: "UNKNOWN", note: "no trusted label", color: "text-slate-500" },
              ].map((s) => (
                <div key={s.name} className="p-2 rounded bg-white/[0.02] border border-white/[0.03]">
                  <p className="text-[11px] text-slate-300 font-medium">{s.name}</p>
                  <p className={`text-[10px] font-mono ${s.color}`}>{s.state}</p>
                  <p className="text-[10px] text-slate-600 italic">{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-700 font-mono">
              THEIA private instance — all systems nominal — console access: enabled
            </p>
          </div>
        </div>
      </div>

      {/* Answer submission */}
      <div className="border-t border-warm-border pt-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-medium text-warm-text-muted uppercase tracking-wider">
            Submit the M3 reveal
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={findings.codeword}
              onChange={(e) =>
                setFindings((prev) => ({ ...prev, codeword: e.target.value }))
              }
              className="px-4 py-3 bg-warm-input border border-warm-border rounded-lg text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 transition-colors font-mono"
              placeholder="Enter the codeword..."
            />
            <input
              type="text"
              value={findings.impossibleClock}
              onChange={(e) =>
                setFindings((prev) => ({
                  ...prev,
                  impossibleClock: e.target.value,
                }))
              }
              className="px-4 py-3 bg-warm-input border border-warm-border rounded-lg text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 transition-colors font-mono"
              placeholder="Impossible clock"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                !findings.codeword.trim() || !findings.impossibleClock.trim()
              }
              className="px-6 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
