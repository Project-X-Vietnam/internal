"use client";

import { useState, useMemo } from "react";
import {
  KeyRound,
  Lock,
  LockOpen,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select } from "@/components/ui/theia-select";

type Props = {
  onSolve: (answer: string) => void;
};

type Transform = "none" | "reverse" | "uppercase" | "lowercase" | "strip";
type InnerCipher = "Caesar" | "Vigenère" | "XOR" | "ROT13" | "Atbash";

const TRANSFORM_LABELS: Record<Transform, string> = {
  none: "Original",
  reverse: "Reverse",
  uppercase: "UPPERCASE",
  lowercase: "lowercase",
  strip: "Strip punctuation",
};

const INNER_CIPHERS: InnerCipher[] = [
  "Caesar",
  "XOR",
  "ROT13",
  "Atbash",
  "Vigenère",
];

const CRIME_OPTIONS = [
  { value: "conspiracy_murder", label: "Conspiracy to commit murder" },
  { value: "murder", label: "Murder / homicide" },
  { value: "money_laundering", label: "Money laundering" },
  { value: "false_evidence", label: "False evidence / framing" },
  { value: "obstruction", label: "Obstruction of justice" },
  { value: "unauthorized_access", label: "Unauthorized access abuse" },
  { value: "evidence_tampering", label: "Evidence tampering" },
  { value: "identity_fraud", label: "Identity fraud" },
  { value: "body_concealment", label: "Body concealment / staging" },
  { value: "flight_risk", label: "Flight to avoid arrest" },
  { value: "blackmail", label: "Blackmail / extortion" },
  { value: "arson", label: "Arson / property destruction" },
] as const;

const EXPECTED_FINAL_PLAINTEXT = [
  "ANDY ORDERED THE KILLING. BAO CARRIED IT OUT.",
  "THE BODY ON THE DESK IS KIEN, KAIS IDENTICAL TWIN.",
  "KAI IS ALIVE. HE BOARDS GATE 17 AT 0600.",
  "THE NAMELESS SEAT FROM MILESTONE TWO.",
  "CATCH HIM BEFORE DAWN.",
].join(" ");

function latinized(value: string): string {
  return value
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyTransform(value: string, transform: Transform): string {
  switch (transform) {
    case "reverse":
      return value.split("").reverse().join("");
    case "uppercase":
      return value.toUpperCase();
    case "lowercase":
      return value.toLowerCase();
    case "strip":
      return latinized(value).replace(/[^a-zA-Z0-9]/g, "");
    default:
      return value;
  }
}

function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] =
        a[i - 1] === b[j - 1]
          ? previous[j - 1]
          : Math.min(previous[j - 1], previous[j], current[j - 1]) + 1;
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function normalizePlaintext(value: string): string {
  return latinized(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function caesarDecrypt(text: string, shift: number): string {
  return text
    .split("")
    .map((ch) => {
      const code = ch.toUpperCase().charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
    })
    .join("");
}

function vigenereDecrypt(text: string, key: string): string {
  const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!normalizedKey) return "";

  let keyIndex = 0;
  return text
    .split("")
    .map((ch) => {
      const code = ch.toUpperCase().charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      const shift = normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 65;
      keyIndex++;
      return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
    })
    .join("");
}

function atbashDecrypt(text: string): string {
  return text
    .split("")
    .map((ch) => {
      const code = ch.toUpperCase().charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      return String.fromCharCode(90 - (code - 65));
    })
    .join("");
}

function xorDecrypt(text: string, key: string): string {
  if (!key) return "";
  return text
    .split("")
    .map((ch, index) =>
      String.fromCharCode(ch.charCodeAt(0) ^ key.charCodeAt(index % key.length))
    )
    .join("");
}

export function buildM5CopyContext() {
  return [
    "Milestone 5 workspace: Kai's vault",
    "Urgent, 05:38. Two locks stand between the team and the truth. The 06:00 flight will not wait. Every fragment needed was earned tonight: a codeword, a place, a date, and a name.",
    "",
    "Lock 1: Password Assembly",
    "Starting fragment slots: Legal name, Codeword, Place, Birthdate.",
    `Transform controls: ${Object.values(TRANSFORM_LABELS).join(", ")}.`,
    "Separator controls: hyphen, underscore, dot, none.",
    "",
    "Lock 2: Cipher Workbench",
    "Encrypted file area: encrypted_file.b64.",
    `Inner cipher controls: ${INNER_CIPHERS.join(", ")}.`,
    "Final plaintext verification area.",
    "",
    "Charge board options:",
    ...CRIME_OPTIONS.map((option) => `- ${option.label}`),
  ].join("\n");
}

export function M5Puzzle({ onSolve }: Props) {
  const [lock1Open, setLock1Open] = useState(false);
  const [ciphertextB64, setCiphertextB64] = useState("");
  const [checking, setChecking] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [slotScore, setSlotScore] = useState<{
    valuesCorrect: number;
    transformsCorrect: number;
    total: number;
  } | null>(null);

  const [slots, setSlots] = useState([
    { label: "Legal name", value: "", transform: "none" as Transform },
    { label: "Codeword", value: "", transform: "none" as Transform },
    { label: "Place", value: "", transform: "none" as Transform },
    { label: "Birthdate", value: "", transform: "none" as Transform },
  ]);
  const [separator, setSeparator] = useState("_");

  const assembledPassword = useMemo(() => {
    return slots
      .map((s) => applyTransform(s.value, s.transform))
      .filter(Boolean)
      .join(separator);
  }, [slots, separator]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assembledPassword.trim() || checking) return;
    setChecking(true);
    setPasswordError(null);
    setSlotScore(null);

    const res = await fetch("/api/m5/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: assembledPassword.trim(),
        slots: slots.map((slot) => ({
          label: slot.label,
          value: slot.value,
          transform: slot.transform,
        })),
      }),
    });
    const data = await res.json();

    if (data.slotScore) setSlotScore(data.slotScore);

    if (data.success) {
      setLock1Open(true);
      setCiphertextB64(data.ciphertextB64 ?? "");
    } else {
      setPasswordError(
        data.error ?? "Access denied. The vault remains sealed."
      );
    }
    setChecking(false);
  }

  function updateSlot(
    index: number,
    field: "value" | "transform" | "label",
    val: string
  ) {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  }

  return (
    <div className="space-y-8">
      {/* Framing */}
      <div className="p-6 rounded-xl bg-warm-error/5 border border-warm-error/15">
        <p className="font-heading text-xs text-warm-error uppercase tracking-wider mb-2">
          Urgent — 05:38
        </p>
        <p className="text-sm text-warm-text leading-relaxed">
          Kai&apos;s vault. Two locks stand between you and the truth. The 06:00
          flight won&apos;t wait. Every fragment you need was earned tonight — a
          codeword, a place, a date, and a name.
        </p>
      </div>

      {/* Lock 1 — Password Assembly Workbench */}
      <div
        className={`rounded-xl border transition-colors ${
          lock1Open
            ? "bg-warm-success/5 border-warm-success/20"
            : "bg-warm-surface border-warm-border"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-warm-border/50">
          <span className="text-lg">
            {lock1Open ? (
              <LockOpen className="h-5 w-5 text-warm-success" />
            ) : (
              <Lock className="h-5 w-5 text-warm-text-muted" />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading text-warm-heading">
              Lock 1 — Password Assembly
            </p>
            <p className="text-xs text-warm-text-muted">
              Combine your earned intelligence fragments
            </p>
          </div>
          {lock1Open && (
            <span className="flex items-center gap-1.5 text-xs text-warm-success font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Cracked
            </span>
          )}
        </div>

        {lock1Open ? (
          <div className="px-6 py-4">
            <p className="text-sm text-warm-success">
              Vault password accepted. Encrypted file retrieved.
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <p className="text-xs text-warm-text-muted leading-relaxed">
              Kai builds passwords around himself: his legal name, his private
              codeword, his company office, and dates
              only his own records would preserve. Load the personal fragments
              below, apply transforms, and assemble the key in his style.
            </p>

            {/* Fragment slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-heading text-[11px] text-warm-text-muted uppercase tracking-wider">
                  Intelligence fragments
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSlots((prev) => [
                      ...prev,
                      { label: "Fragment", value: "", transform: "none" },
                    ])
                  }
                  className="text-[11px] text-warm-accent hover:text-warm-accent-light transition-colors"
                >
                  + Add slot
                </button>
              </div>

              {slots.map((slot, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[100px_1fr_180px_auto] items-center gap-2 rounded-lg border border-warm-border bg-warm-bg p-3"
                >
                  <input
                    type="text"
                    value={slot.label}
                    onChange={(e) => updateSlot(i, "label", e.target.value)}
                    className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-warm-text-muted bg-transparent border-b border-warm-border focus:border-warm-accent focus:outline-none"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={slot.value}
                    onChange={(e) => updateSlot(i, "value", e.target.value)}
                    className="px-3 py-1.5 text-sm font-mono text-warm-heading bg-warm-input border border-warm-border rounded-md focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 placeholder:text-warm-text-faint"
                    placeholder="Input"
                  />
                  <Select
                    value={slot.transform}
                    onChange={(val) => updateSlot(i, "transform", val)}
                    options={Object.entries(TRANSFORM_LABELS).map(
                      ([k, v]) => ({ value: k, label: v })
                    )}
                    className="w-[180px]"
                  />
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSlots((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="p-1 text-warm-text-faint hover:text-warm-error transition-colors"
                      aria-label="Remove slot"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-warm-text-muted uppercase tracking-wider shrink-0">
                Separator
              </p>
              <div className="flex gap-1.5">
                {["-", "_", ".", "none"].map((sep) => (
                  <button
                    key={sep}
                    type="button"
                    onClick={() => setSeparator(sep === "none" ? "" : sep)}
                    className={`px-3 py-1 text-xs font-mono rounded-md border transition-colors ${
                      (sep === "none" ? "" : sep) === separator
                        ? "border-warm-accent/50 bg-warm-accent/10 text-warm-heading"
                        : "border-warm-border text-warm-text-muted hover:border-warm-border-dark"
                    }`}
                  >
                    {sep === "none" ? "∅" : sep}
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-lg border border-warm-border bg-warm-code overflow-hidden">
              <div className="px-4 py-2 border-b border-warm-border bg-warm-code-dark/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-warm-text-muted" />
                  <span className="text-[11px] text-warm-text-muted font-mono">
                    Assembled password
                  </span>
                </div>
                <span className="text-[10px] text-warm-text-faint">
                  {assembledPassword.length} chars
                </span>
              </div>
              <div className="px-4 py-3 min-h-[40px] flex items-center">
                {assembledPassword ? (
                  <code className="text-sm font-mono text-warm-accent break-all">
                    {assembledPassword}
                  </code>
                ) : (
                  <span className="text-sm text-warm-text-faint italic">
                    Enter fragments above...
                  </span>
                )}
              </div>
            </div>

            {/* Submit */}
            <form onSubmit={handlePasswordSubmit}>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={checking || !assembledPassword.trim()}
                  className="px-5 py-2.5 bg-warm-accent text-white text-sm font-semibold rounded-lg hover:bg-warm-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {checking ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      Test password
                    </>
                  )}
                </button>
                <div className="min-h-[22px]">
                  {passwordError && (
                    <p className="text-sm text-warm-error">{passwordError}</p>
                  )}
                  {slotScore && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className={slotScore.valuesCorrect === slotScore.total ? "text-warm-success" : "text-warm-text-muted"}>
                        {slotScore.valuesCorrect}/{slotScore.total} values correct
                      </span>
                      <span className={slotScore.transformsCorrect === slotScore.total ? "text-warm-success" : "text-warm-text-muted"}>
                        {slotScore.transformsCorrect}/{slotScore.total} transforms correct
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Lock 2 — Decryption Terminal */}
      <div
        className={`rounded-xl border transition-colors ${
          lock1Open
            ? "bg-warm-surface border-warm-border"
            : "bg-warm-surface-dark/50 border-warm-border opacity-40 pointer-events-none select-none"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-warm-border/50">
          <Terminal className="h-5 w-5 text-warm-text-muted" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading text-warm-heading">
              Lock 2 — Decryption Terminal
            </p>
            <p className="text-xs text-warm-text-muted">
              Decode the encrypted file. The key is a name from the
              interrogation.
            </p>
          </div>
        </div>

        {lock1Open && (
          <DecryptionTerminal
            ciphertextB64={ciphertextB64}
            onSolve={onSolve}
          />
        )}
      </div>
    </div>
  );
}

function DecryptionTerminal({
  ciphertextB64,
  onSolve,
}: {
  ciphertextB64: string;
  onSolve: (answer: string) => void;
}) {
  const [base64Output, setBase64Output] = useState("");
  const [base64Checked, setBase64Checked] = useState(false);
  const [plaintextChecked, setPlaintextChecked] = useState(false);
  const [innerCipher, setInnerCipher] = useState<InnerCipher | null>(null);
  const [innerKey, setInnerKey] = useState("");
  const [innerShift, setInnerShift] = useState("");

  const expectedBase64Output = useMemo(() => {
    try {
      if (typeof atob !== "function") return "";
      return atob(ciphertextB64);
    } catch {
      return "";
    }
  }, [ciphertextB64]);

  const base64OutputAccepted = useMemo(() => {
    const normalizeCipher = (value: string) =>
      value.toUpperCase().replace(/\s+/g, "");
    const submitted = normalizeCipher(base64Output);
    const expected = normalizeCipher(expectedBase64Output);
    if (!submitted || !expected) return false;
    if (submitted === expected) return true;
    if (Math.abs(submitted.length - expected.length) > 3) return false;

    const allowedErrors = Math.max(2, Math.floor(expected.length * 0.02));
    return editDistance(submitted, expected) <= allowedErrors;
  }, [base64Output, expectedBase64Output]);

  const transformedPlaintext = useMemo(() => {
    if (!base64OutputAccepted || !innerCipher || !base64Output.trim()) return "";

    switch (innerCipher) {
      case "Caesar": {
        const shift = Number.parseInt(innerShift, 10);
        if (!Number.isFinite(shift) || shift < 1 || shift > 25) return "";
        return caesarDecrypt(base64Output, shift);
      }
      case "Vigenère":
        return vigenereDecrypt(base64Output, innerKey);
      case "XOR":
        return xorDecrypt(base64Output, innerKey);
      case "ROT13":
        return caesarDecrypt(base64Output, 13);
      case "Atbash":
        return atbashDecrypt(base64Output);
      default:
        return "";
    }
  }, [base64Output, base64OutputAccepted, innerCipher, innerKey, innerShift]);

  const plaintextAccepted = useMemo(() => {
    const normalized = normalizePlaintext(transformedPlaintext);
    const expected = normalizePlaintext(EXPECTED_FINAL_PLAINTEXT);
    if (!normalized) return false;

    const hasCoreFacts =
      normalized.includes("andyordered") &&
      normalized.includes("baocarried") &&
      normalized.includes("kien") &&
      normalized.includes("kaialive") &&
      normalized.includes("gate17") &&
      normalized.includes("0600");

    if (hasCoreFacts) return true;
    if (Math.abs(normalized.length - expected.length) > 8) return false;

    return editDistance(normalized, expected) <= 8;
  }, [transformedPlaintext]);

  return (
    <div className="px-6 py-5 space-y-5">
      <p className="text-xs text-warm-text-muted leading-relaxed">
        The vault opened. Inside: a single encrypted file. Decode the Base64
        layer outside this terminal, then use the inner-layer controls here to
        reveal and verify the final plaintext.
      </p>

      <div className="rounded-lg border border-warm-border bg-warm-code overflow-hidden">
        <div className="px-4 py-2 border-b border-warm-border bg-warm-code-dark/50">
          <span className="text-[11px] text-warm-text-muted font-mono">
            encrypted_file.b64
          </span>
        </div>
        <pre className="px-4 py-3 text-xs text-warm-accent font-mono whitespace-pre-wrap break-all leading-relaxed max-h-40 overflow-y-auto">
          {ciphertextB64}
        </pre>
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] uppercase tracking-wider text-warm-text-muted">
          Base64 decoded output
        </label>
        <textarea
          value={base64Output}
          onChange={(event) => {
            setBase64Output(event.target.value);
            setBase64Checked(false);
            setPlaintextChecked(false);
            setInnerCipher(null);
            setInnerKey("");
            setInnerShift("");
          }}
          rows={6}
          spellCheck={false}
          className="w-full rounded-lg border border-warm-border bg-warm-input px-3 py-3 text-xs font-mono leading-relaxed text-warm-heading placeholder:text-warm-text-faint focus:border-warm-accent/50 focus:outline-none focus:ring-1 focus:ring-warm-accent/20"
          placeholder="Input"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setBase64Checked(true)}
          disabled={!base64Output.trim()}
          className="px-4 py-2 text-xs font-semibold bg-warm-btn text-warm-bg rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify decoded output
        </button>
        {base64Checked && base64OutputAccepted && (
          <span className="text-xs text-warm-success font-medium flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Base64 layer accepted
          </span>
        )}
        {base64Checked && !base64OutputAccepted && (
          <span className="text-xs text-warm-error">
            That does not match the Base64-decoded layer yet.
          </span>
        )}
      </div>

      {base64OutputAccepted && (
        <div className="space-y-5 border-t border-warm-border pt-5">
          <div className="space-y-3">
            <label className="block text-[11px] uppercase tracking-wider text-warm-text-muted">
              Inner layer attempt
            </label>
            <div className="flex flex-wrap gap-2">
              {INNER_CIPHERS.map((cipher) => (
                <button
                  key={cipher}
                  type="button"
                  onClick={() => setInnerCipher(cipher)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    innerCipher === cipher
                      ? "border-warm-accent/50 bg-warm-accent/10 text-warm-heading"
                      : "border-warm-border text-warm-text-muted hover:border-warm-border-dark hover:text-warm-text"
                  }`}
                >
                  {cipher}
                </button>
              ))}
            </div>

            {innerCipher && (
              <div className="rounded-lg border border-warm-border bg-warm-bg px-3 py-3">
                <p className="text-xs text-warm-text-muted leading-relaxed">
                  Choose the inner-layer method and key here. The final
                  plaintext output below will update from the Base64 decoded
                  input.
                </p>
                <p className="mt-2 text-xs italic leading-relaxed text-warm-text-muted">
                  Key hint: use the only witness that saw every record, told no
                  lies of its own, and committed no crime.
                </p>
                {innerCipher === "Caesar" && (
                  <div className="mt-3 flex max-w-xs items-center gap-3">
                    <label className="text-xs text-warm-text-muted shrink-0">
                      Shift
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={innerShift}
                      onChange={(event) => setInnerShift(event.target.value)}
                      className="w-24 rounded-md border border-warm-border bg-warm-input px-3 py-1.5 text-sm font-mono text-warm-heading placeholder:text-warm-text-faint focus:border-warm-accent/50 focus:outline-none focus:ring-1 focus:ring-warm-accent/20"
                      placeholder="Input"
                    />
                  </div>
                )}
                {(innerCipher === "Vigenère" || innerCipher === "XOR") && (
                  <div className="mt-3 flex max-w-md items-center gap-3">
                    <label className="text-xs text-warm-text-muted shrink-0">
                      Key
                    </label>
                    <input
                      type="text"
                      value={innerKey}
                      onChange={(event) => setInnerKey(event.target.value)}
                      className="min-w-0 flex-1 rounded-md border border-warm-border bg-warm-input px-3 py-1.5 text-sm font-mono text-warm-heading placeholder:text-warm-text-faint focus:border-warm-accent/50 focus:outline-none focus:ring-1 focus:ring-warm-accent/20"
                      placeholder="Input"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-wider text-warm-text-muted">
              Final plaintext
            </label>
            <textarea
              value={transformedPlaintext}
              readOnly
              rows={6}
              spellCheck={false}
              className="w-full rounded-lg border border-warm-border bg-warm-input px-3 py-3 text-xs font-mono leading-relaxed text-warm-heading placeholder:text-warm-text-faint focus:border-warm-accent/50 focus:outline-none focus:ring-1 focus:ring-warm-accent/20"
              placeholder="Choose an inner-layer method to transform the decoded output"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaintextChecked(true)}
              disabled={!transformedPlaintext.trim()}
              className="px-4 py-2 text-xs font-semibold bg-warm-btn text-warm-bg rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify plaintext
            </button>
            {plaintextChecked && plaintextAccepted && (
              <span className="text-xs text-warm-success font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Plaintext accepted
              </span>
            )}
            {plaintextChecked && !plaintextAccepted && (
              <span className="text-xs text-warm-error">
                Plaintext does not contain the required case facts yet.
              </span>
            )}
          </div>
        </div>
      )}

      {plaintextAccepted && (
        <CaseReport onSolve={onSolve} plaintext={transformedPlaintext} />
      )}
    </div>
  );
}

function CaseReport({
  onSolve,
  plaintext,
}: {
  onSolve: (answer: string) => void;
  plaintext: string;
}) {
  const [answer, setAnswer] = useState({
    andyCrimes: [] as string[],
    baoCrimes: [] as string[],
    kaiCrimes: [] as string[],
  });

  function submit() {
    onSolve(JSON.stringify({ ...answer, finalPlaintext: plaintext }));
  }

  return (
    <div className="space-y-6 border-t border-warm-border pt-6">
      <p className="font-heading text-xs text-warm-text-muted uppercase tracking-wider">
        Police arrest permit filing — submit before 06:00
      </p>

      <div className="rounded-lg border border-warm-border bg-warm-surface px-5 py-5 space-y-5">
        <div>
          <p className="font-heading text-sm text-warm-heading">
            Application for arrest authority
          </p>
          <p className="mt-1 text-xs leading-relaxed text-warm-text-muted">
            File the decoded truth as a police-ready permit request. Select the
            chargeable acts for each arrest subject.
          </p>
        </div>

        <div className="grid gap-4 border-t border-warm-border/50 pt-4 lg:grid-cols-3">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-warm-text-muted">
              Suspect: Andy
            </p>
            <MultiSelect
              value={answer.andyCrimes}
              onChange={(value) =>
                setAnswer((prev) => ({
                  ...prev,
                  andyCrimes: value,
                }))
              }
              options={CRIME_OPTIONS}
              placeholder="Select crimes"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-warm-text-muted">
              Suspect: Bảo
            </p>
            <MultiSelect
              value={answer.baoCrimes}
              onChange={(value) =>
                setAnswer((prev) => ({
                  ...prev,
                  baoCrimes: value,
                }))
              }
              options={CRIME_OPTIONS}
              placeholder="Select crimes"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-warm-text-muted">
              Suspect: Kai
            </p>
            <MultiSelect
              value={answer.kaiCrimes}
              onChange={(value) =>
                setAnswer((prev) => ({
                  ...prev,
                  kaiCrimes: value,
                }))
              }
              options={CRIME_OPTIONS}
              placeholder="Select crimes"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={
          answer.andyCrimes.length === 0 ||
          answer.baoCrimes.length === 0 ||
          answer.kaiCrimes.length === 0
        }
        className="px-5 py-2.5 bg-warm-btn text-warm-bg text-sm font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Request arrest permit
      </button>
    </div>
  );
}
