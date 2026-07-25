"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

export function M1Puzzle({ onSolve }: Props) {
  const [db, setDb] = useState<SqlJsDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
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
            <h3 className="font-heading text-xs text-warm-text-muted uppercase tracking-wider">
              Tables ({tables.length})
            </h3>
            <span className="text-[11px] text-warm-text-faint">
              Click to inspect
            </span>
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
          {/* Starter queries */}
          <div className="rounded-lg border border-warm-border bg-warm-surface px-3 py-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-heading text-[11px] text-warm-text-muted uppercase tracking-wider">
                Starter queries
              </p>
              <p className="text-[11px] text-warm-text-faint">
                Click one to load the SQL editor
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUERIES.map((sq) => (
                <button
                  key={sq.label}
                  onClick={() => setQuery(sq.sql)}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-md border border-warm-border text-warm-text-muted hover:text-warm-text hover:border-warm-border-dark transition-colors"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

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
    </div>
  );
}
