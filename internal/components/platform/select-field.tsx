"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * A Select that behaves like the `<select>` it replaced: give it a `name` and a
 * `defaultValue`, drop it in a form, and it posts a plain string.
 *
 * Two things make the wrapper necessary rather than using the primitives
 * directly at each call site:
 *
 *  1. Radix throws on `<SelectItem value="">`, but "" is exactly what the
 *     directory filters mean by "All departments" and what an unanswered
 *     onboarding field posts. So the empty option is swapped for a sentinel for
 *     display and swapped back for submission.
 *  2. The real value goes out through a hidden input rather than Radix's own
 *     form mirroring, which keeps the posted string identical to what the native
 *     control used to send — `?department=` and all — so no reader had to change.
 */

const NONE = "__none__";

export type SelectOption = { value: string; label: string };

export function SelectField({
  id,
  name,
  options,
  defaultValue = "",
  placeholder,
  invalid,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: {
  id?: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  // Whether the caller supplied its own "none" row ("All departments") or wants
  // the placeholder to stand in for an empty value ("Pick one…").
  const hasEmptyOption = options.some((option) => option.value === "");
  const selected = value === "" ? (hasEmptyOption ? NONE : undefined) : value;

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select value={selected} onValueChange={(next) => setValue(next === NONE ? "" : next)}>
        <SelectTrigger
          id={id}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={className}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value || NONE}
              value={option.value === "" ? NONE : option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
