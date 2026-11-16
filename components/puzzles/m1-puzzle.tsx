"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, X } from "lucide-react";
import type { Database as SqlJsDatabase } from "sql.js";

type TableInfo = {
  name: string;
  columns: { name: string; type: string }[];
  rowCount: number;
};

type QueryResult = {
  columns: string[];
  values: (string | number | null)[][];
  rowCount: number;
  time: number;
};

type TableDoc = {
  name: string;
  group: string;
  purpose: string;
  lookFor: string;
};

type Props = {
  onSolve: (answer: string) => void | Promise<void>;
};

const SUSPECTS = [
  "Kai",
  "Minh",
  "Andy",
  "Bảo",
  "Linh",
  "Phúc",
  "Trang",
  "Dr. Hạnh",
  "Sơn",
];

const STARTER_QUERIES = [
  { label: "All employees", sql: "SELECT * FROM employees;" },
  {
    label: "Badge access on incident night",
    sql: "SELECT *, datetime(ts_utc, '+7 hours') AS ts_local FROM badge_access WHERE ts_utc BETWEEN '2026-03-17 13:00:00' AND '2026-03-17 17:00:00' ORDER BY ts_utc;",
  },
  {
    label: "Who was on floor 41?",
    sql: "SELECT ba.*, datetime(ba.ts_utc, '+7 hours') AS ts_local, e.name FROM badge_access ba JOIN device_registry dr ON ba.badge_id = dr.badge_id JOIN employees e ON dr.emp_id = e.emp_id WHERE ba.floor = 41 ORDER BY ba.ts_utc;",
  },
  {
    label: "Financial red flags",
    sql: "SELECT bt.*, hd.emp_id, e.name FROM bank_transactions bt JOIN hr_directory hd ON bt.tax_no = hd.tax_no JOIN employees e ON hd.emp_id = e.emp_id WHERE bt.amount > 50000000 ORDER BY bt.amount DESC;",
  },
];

const TABLE_DOCS: TableDoc[] = [
  {
    name: "employees",
    group: "Identity",
    purpose: "Core employee roster with role, department, manager, and status.",
    lookFor: "Use emp_id as the human identity anchor for most joins.",
  },
  {
    name: "hr_directory",
    group: "Identity",
    purpose: "Private HR details that connect employees to tax numbers and emergency contacts.",
    lookFor: "Bridge employees to bank_transactions through tax_no.",
  },
  {
    name: "device_registry",
    group: "Identity",
    purpose: "Maps each employee to badge, SIM, MAC address, and laptop identifiers.",
    lookFor: "This is the main bridge between people and physical or digital traces.",
  },
  {
    name: "badge_access",
    group: "Location",
    purpose: "Door controller events for lobby and floor access.",
    lookFor: "ts_utc is UTC, so add 7 hours before comparing with local logs.",
  },
  {
    name: "phone_logs",
    group: "Location",
    purpose: "Cell tower pings, calls, texts, and data events by SIM.",
    lookFor: "Useful for testing whether a phone was near the tower at the incident time.",
  },
  {
    name: "parking_gate",
    group: "Location",
    purpose: "Vehicle entry and exit records for the building garage.",
    lookFor: "Good corroboration for building departure, especially when paired with phone logs.",
  },
  {
    name: "wifi_sessions",
    group: "Location",
    purpose: "Laptop connections to office wireless access points.",
    lookFor: "Treat as device presence, not person presence. A connected laptop can be left behind.",
  },
  {
    name: "bank_transactions",
    group: "Motive",
    purpose: "Financial activity keyed by tax number.",
    lookFor: "Find unusual wires or cash movements after joining through hr_directory.",
  },
  {
    name: "equity_ledger",
    group: "Motive",
    purpose: "Share grants, dilution events, and ownership changes.",
    lookFor: "Surfaces business pressure and possible financial motive.",
  },
  {
    name: "hr_actions",
    group: "Motive",
    purpose: "Pending people operations actions such as terminations or role changes.",
    lookFor: "Shows who had career risk around launch night.",
  },
  {
    name: "helpdesk_tickets",
    group: "Motive",
    purpose: "IT support and dispute records.",
    lookFor: "Useful context, but some entries are motive bait without location proof.",
  },
  {
    name: "system_events",
    group: "Timeline",
    purpose: "Application login, logout, MFA, and session activity.",
    lookFor: "Use local timestamps to bracket who was active in company systems.",
  },
  {
    name: "theia_call_log",
    group: "Timeline",
    purpose: "THEIA health, anomaly, and emergency protocol events.",
    lookFor: "Pins the emergency call and system lock sequence.",
  },
  {
    name: "security_admin_log",
    group: "Timeline",
    purpose: "Security administration actions and access-control changes.",
    lookFor: "Explains badge cloning, floor overrides, and camera maintenance.",
  },
  {
    name: "calendar_audit",
    group: "Timeline",
    purpose: "Meeting bookings and edit history for rooms and schedules.",
    lookFor: "Compare planned meetings with actual movement and system traces.",
  },
  {
    name: "printer_jobs",
    group: "Noise",
    purpose: "Printed document names, printers, page counts, and timestamps.",
    lookFor: "Mostly color and red herrings unless a document supports another signal.",
  },
  {
    name: "visitor_registry",
    group: "Noise",
    purpose: "External visitor check-ins, hosts, purposes, and temporary badges.",
    lookFor: "Can explain strangers, but do not over-weight mystery names alone.",
  },
  {
    name: "git_activity",
    group: "Noise",
    purpose: "Repository commit activity by employee.",
    lookFor: "Useful for work context, weak as physical-location evidence.",
  },
  {
    name: "cafeteria_purchases",
    group: "Noise",
    purpose: "Snack bar and vending purchases.",
    lookFor: "Mostly atmosphere. It can confirm daytime presence, not incident guilt.",
  },
  {
    name: "hvac_sensors",
    group: "Noise",
    purpose: "Temperature, humidity, CO2, and zone readings.",
    lookFor: "Environmental filler unless a timeline question specifically needs sensor context.",
  },
];

const TABLE_DOC_GROUPS = Array.from(new Set(TABLE_DOCS.map((doc) => doc.group)));

export function buildM1CopyContext() {
  return [
    "Milestone 1 workspace: Analyst terminal",
    "Oracle Labs tower database: 20 tables.",
    "",
    "Table documentation:",
    ...TABLE_DOC_GROUPS.flatMap((group) => [
      "",
      `${group}:`,
      ...TABLE_DOCS.filter((doc) => doc.group === group).map(
        (doc) => `- ${doc.name}: ${doc.purpose}`
      ),
    ]),
  ].join("\n");
}

export function M1Puzzle({ onSolve }: Props) {
  const [db, setDb] = useState<SqlJsDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [docsOpen, setDocsOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [query, setQuery] = useState(STARTER_QUERIES[0].sql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedSuspects, setSelectedSuspects] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({
          locateFile: () => "/sql-wasm.wasm",
        });

        const resp = await fetch("/data/m1-seed.sql");
        const seedSql = await resp.text();

        const database = new SQL.Database();
        database.run(seedSql);

        setDb(database);

        const tableRows = database.exec(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        );
        if (tableRows.length > 0) {
          const infos: TableInfo[] = tableRows[0].values.map((row: unknown[]) => {
            const tName = row[0] as string;
            const pragmaResult = database.exec(
              `PRAGMA table_info('${tName}')`
            );
            const cols =
              pragmaResult.length > 0
                ? pragmaResult[0].values.map((c: unknown[]) => ({
                    name: c[1] as string,
                    type: c[2] as string,
                  }))
                : [];
            const countResult = database.exec(
              `SELECT COUNT(*) FROM '${tName}'`
            );
            const count =
              countResult.length > 0
                ? (countResult[0].values[0][0] as number)
                : 0;
            return { name: tName, columns: cols, rowCount: count };
          });
          setTables(infos);
        }

        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load database");
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!docsOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDocsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [docsOpen]);

  const runQuery = useCallback(() => {
    if (!db || !query.trim()) return;
    setRunning(true);
    setQueryError(null);
    setResult(null);

    try {
      const start = performance.now();
      const results = db.exec(query);
      const elapsed = performance.now() - start;

      if (results.length > 0) {
        const r = results[0];
        setResult({
          columns: r.columns,
          values: r.values.slice(0, 500) as (string | number | null)[][],
          rowCount: r.values.length,
          time: elapsed,
        });
      } else {
        setResult({
          columns: [],
          values: [],
          rowCount: 0,
          time: elapsed,
        });
      }

      setHistory((h) => {
        const trimmed = query.trim();
        if (h[0] === trimmed) return h;
        return [trimmed, ...h].slice(0, 20);
      });
    } catch (e) {
      setQueryError(e instanceof Error ? e.message : "Query error");
    }
    setRunning(false);
  }, [db, query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  }

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await onSolve(JSON.stringify({ suspects: selectedSuspects, note }));
    } finally {
      setSubmitting(false);
    }
  }

  function toggleSuspect(suspect: string) {
    setSelectedSuspects((current) =>
      current.includes(suspect)
        ? []
        : [suspect]
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-2 border-warm-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-text-muted">
          Loading Oracle Labs database dump...
        </p>
        <p className="text-xs text-warm-text-faint">
          Initializing SQLite engine in your browser
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-warm-error/20 bg-warm-error/5 text-center">
        <p className="text-warm-error text-sm">Failed to load database</p>
        <p className="text-warm-error/60 text-xs mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Briefing */}
      <div className="rounded-lg border border-warm-accent/15 bg-warm-accent/5 px-4 py-3">
        <div className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <p className="font-heading text-xs text-warm-accent uppercase tracking-wider">
            Analyst terminal
          </p>
          <p className="text-sm leading-relaxed text-warm-text">
            Oracle Labs tower database: 20 tables,{" "}
            {tables.reduce((a, t) => a + t.rowCount, 0)} records. Find the
            evidence, build a defensible suspect set, and write why your team
            is carrying those names forward.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Schema explorer sidebar */}
        <aside className="space-y-2 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="font-heading text-xs text-warm-text-muted uppercase tracking-wider">
                Tables ({tables.length})
              </h3>
              <span className="text-[11px] text-warm-text-faint">
                Click to inspect
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDocsOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-warm-border bg-warm-surface px-2.5 text-[11px] font-medium text-warm-text-muted transition-colors hover:border-warm-border-dark hover:bg-warm-surface-dark hover:text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-accent/25"
              aria-haspopup="dialog"
              aria-expanded={docsOpen}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Docs
            </button>
          </div>
          <div className="max-h-[34vh] overflow-y-auto space-y-1 pr-1 scrollbar-thin lg:max-h-[calc(100vh-180px)]">
            {tables.map((t) => (
              <button
                key={t.name}
                onClick={() =>
                  setSelectedTable(selectedTable === t.name ? null : t.name)
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTable === t.name
                    ? "bg-warm-accent/10 border border-warm-accent/25 text-warm-heading"
                    : "bg-warm-surface border border-warm-border text-warm-text hover:bg-warm-surface-dark"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{t.name}</span>
                  <span className="text-[10px] text-warm-text-faint">
                    {t.rowCount} rows
                  </span>
                </div>
                {selectedTable === t.name && (
                  <div className="mt-2 space-y-0.5 border-t border-warm-border pt-2">
                    {t.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="text-warm-text-muted font-mono">
                          {col.name}
                        </span>
                        <span className="text-warm-text-faint uppercase text-[10px]">
                          {col.type}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuery(`SELECT * FROM ${t.name} LIMIT 25;`);
                      }}
                      className="mt-2 w-full text-[11px] text-warm-accent hover:text-warm-accent-light text-center py-1 border border-warm-accent/15 rounded transition-colors"
                    >
                      Preview rows
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Query panel */}
        <div className="min-w-0 space-y-4">
          {/* SQL editor */}
          <div className="rounded-lg border border-warm-border bg-warm-code overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-warm-border bg-warm-code-dark/50">
              <span className="text-[11px] text-warm-text-muted font-mono">
                SQL Query
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-warm-text-faint">
                  {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}+Enter
                  to run
                </span>
                <button
                  onClick={runQuery}
                  disabled={running || !query.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-warm-btn text-warm-bg rounded-md hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? "Running..." : "Run query"}
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={7}
              spellCheck={false}
              className="w-full px-4 py-3 bg-transparent text-sm leading-6 text-warm-heading font-mono resize-y focus:outline-none placeholder:text-warm-text-faint"
              placeholder="SELECT * FROM employees WHERE ..."
            />
          </div>

          {/* Query error */}
          {queryError && (
            <div className="p-3 rounded-lg border border-warm-error/20 bg-warm-error/5">
              <p className="text-xs text-warm-error font-mono">{queryError}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="rounded-lg border border-warm-border bg-warm-surface overflow-hidden">
              <div className="px-4 py-2 border-b border-warm-border bg-warm-surface-dark/50 flex items-center justify-between">
                <span className="text-[11px] text-warm-text-muted">
                  {result.rowCount === 0
                    ? "No rows returned"
                    : `${result.rowCount} row${result.rowCount !== 1 ? "s" : ""}${result.rowCount > 500 ? " (showing first 500)" : ""}`}
                </span>
                <span className="text-[10px] text-warm-text-faint">
                  {result.time.toFixed(1)}ms
                </span>
              </div>
              {result.columns.length > 0 && (
                <div className="overflow-auto max-h-[46vh]">
                  <table className="min-w-full text-xs font-mono">
                    <thead className="sticky top-0 bg-warm-surface">
                      <tr>
                        {result.columns.map((col) => (
                          <th
                            key={col}
                            className="text-left px-3 py-2 text-warm-heading font-semibold border-b border-warm-border whitespace-nowrap bg-warm-surface"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.values.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-warm-border/30 hover:bg-warm-surface-dark/30 transition-colors"
                        >
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-3 py-1.5 text-warm-text whitespace-nowrap max-w-[320px] truncate"
                              title={cell?.toString() ?? "NULL"}
                            >
                              {cell === null ? (
                                <span className="text-warm-text-faint italic">
                                  NULL
                                </span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <details className="text-xs">
              <summary className="text-warm-text-muted cursor-pointer hover:text-warm-text transition-colors">
                Query history ({history.length})
              </summary>
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(h)}
                    className="block w-full text-left px-3 py-1.5 font-mono text-warm-text-muted hover:text-warm-text bg-warm-surface rounded truncate transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Answer submission */}
      <div className="rounded-lg border border-warm-border bg-warm-surface p-4">
        <form onSubmit={handleSubmitAnswer} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-medium text-warm-text-muted uppercase tracking-wider">
              Submit your lead suspect
            </label>
            <span className="text-[11px] text-warm-text-faint">
              Choose one person
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {SUSPECTS.map((suspect) => {
              const selected = selectedSuspects.includes(suspect);
              return (
                <button
                  key={suspect}
                  type="button"
                  onClick={() => toggleSuspect(suspect)}
                  aria-pressed={selected}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "border-warm-accent/50 bg-warm-accent/10 text-warm-heading"
                      : "border-warm-border bg-warm-input text-warm-text-muted hover:border-warm-border-dark hover:text-warm-text"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>{suspect}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        selected ? "bg-warm-accent" : "bg-warm-border"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 bg-warm-input border border-warm-border rounded-lg text-sm text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 transition-colors"
            placeholder="Evidence note: why is this person worth carrying forward?"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-warm-text-faint">
              Choose the strongest single lead your team can defend from the data.
            </p>
            <button
              type="submit"
              disabled={
                submitting ||
                selectedSuspects.length !== 1 ||
                note.trim().length < 10
              }
              className="px-6 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Checking..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {docsOpen && (
        <div
          className="fixed inset-0 z-50 bg-warm-heading/25"
          role="presentation"
          onClick={() => setDocsOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="m1-table-docs-title"
            className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-warm-border bg-warm-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-warm-border bg-warm-surface-dark/45 px-5 py-4">
              <div>
                <p className="font-heading text-[11px] uppercase tracking-wider text-warm-accent">
                  Milestone 1 docs
                </p>
                <h2
                  id="m1-table-docs-title"
                  className="mt-1 font-heading text-lg text-warm-heading"
                >
                  Table guide
                </h2>
                <p className="mt-1 max-w-[60ch] text-xs leading-5 text-warm-text-muted">
                  High-level map of the database dump. Use it to decide which
                  tables to join, then prove the timeline with queries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDocsOpen(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-warm-border bg-warm-surface text-warm-text-muted transition-colors hover:bg-warm-surface-dark hover:text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-accent/25"
                aria-label="Close table guide"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4">
              <div className="mb-4 rounded-lg border border-warm-accent/20 bg-warm-accent/5 px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-warm-accent">
                  Join spine
                </p>
                <p className="mt-1 text-sm leading-6 text-warm-text-muted">
                  Start with employees. Join to device_registry for badges,
                  phones, laptops, and Wi-Fi. Join to hr_directory for tax
                  numbers, then bank_transactions for money trails.
                </p>
              </div>

              <div className="space-y-5">
                {TABLE_DOC_GROUPS.map((group) => (
                  <section key={group}>
                    <h3 className="mb-2 font-heading text-xs uppercase tracking-wider text-warm-text-muted">
                      {group}
                    </h3>
                    <div className="space-y-2">
                      {TABLE_DOCS.filter((doc) => doc.group === group).map(
                        (doc) => {
                          const tableInfo = tables.find(
                            (table) => table.name === doc.name
                          );

                          return (
                            <div
                              key={doc.name}
                              className="rounded-lg border border-warm-border bg-warm-input px-3 py-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-mono text-xs font-semibold text-warm-heading">
                                  {doc.name}
                                </p>
                                {tableInfo && (
                                  <span className="rounded-full bg-warm-surface-dark px-2 py-0.5 text-[10px] text-warm-text-faint">
                                    {tableInfo.rowCount} rows
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 text-sm leading-5 text-warm-text">
                                {doc.purpose}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-warm-text-muted">
                                {doc.lookFor}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
