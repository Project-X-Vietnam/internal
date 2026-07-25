"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly Option[];
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [menuMaxHeight, setMenuMaxHeight] = useState(288);
  const ref = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => new Set(value), [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenUp = spaceBelow < 240 && spaceAbove > spaceBelow;
    const availableSpace = shouldOpenUp ? spaceAbove : spaceBelow;

    setOpenUp(shouldOpenUp);
    setMenuMaxHeight(Math.min(288, Math.max(160, availableSpace - 12)));
  }, [open]);

  function toggle(optionValue: string) {
    if (selected.has(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }
    onChange([...value, optionValue]);
  }

  const label =
    value.length > 0
      ? `${value.length} selected`
      : placeholder;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors",
          "bg-warm-input border-warm-border text-warm-text",
          "hover:border-warm-border-dark",
          "focus:outline-none focus:border-warm-accent/50",
          value.length === 0 && "text-warm-text-muted"
        )}
      >
        <span className="truncate text-left">{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-warm-text-muted transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((item) => {
            const option = options.find((candidate) => candidate.value === item);
            if (!option) return null;
            return (
              <span
                key={item}
                className="rounded-md border border-warm-border bg-warm-surface px-2 py-1 text-xs text-warm-text"
              >
                {option.label}
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <ul
          style={{ maxHeight: menuMaxHeight }}
          className={cn(
            "absolute z-50 w-full overflow-auto rounded-lg border border-warm-border bg-warm-surface py-1 shadow-lg",
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {options.map((option) => {
            const isSelected = selected.has(option.value);
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => toggle(option.value)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                    isSelected
                      ? "bg-warm-accent/10 text-warm-heading font-medium"
                      : "text-warm-text hover:bg-warm-surface-dark"
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isSelected ? "text-warm-accent" : "invisible"
                    )}
                    aria-hidden="true"
                  />
                  <span>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
