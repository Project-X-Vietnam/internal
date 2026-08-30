import { LayoutGrid, Rows3 } from "lucide-react";
import Link from "next/link";

import { FOCUS } from "@/components/platform/page";
import { cn } from "@/lib/utils";

export type DirectoryView = "gallery" | "list";

export type DirectoryFilterParams = {
  q?: string;
  department?: string;
  cohort?: string;
  tag?: string;
  view?: string;
};

/**
 * View lives in the URL like the filters do, so it survives a refresh, the back
 * button and a shared link. Gallery is the default and therefore carries no
 * parameter — `/directory` is the gallery, and `?view=gallery` never appears.
 */
export function directoryHref(filters: DirectoryFilterParams, view: DirectoryView) {
  const params = new URLSearchParams();
  for (const key of ["q", "department", "cohort", "tag"] as const) {
    if (filters[key]) params.set(key, filters[key]);
  }
  if (view === "list") params.set("view", "list");
  const query = params.toString();
  return query ? `/directory?${query}` : "/directory";
}

const OPTIONS = [
  { value: "gallery", label: "Gallery", icon: LayoutGrid },
  { value: "list", label: "List", icon: Rows3 },
] as const;

/**
 * Segmented control for gallery ⇄ list.
 *
 * Two links, not two buttons: switching view is navigation, so it belongs in
 * history, works on middle-click, and needs no JavaScript. The list is the older
 * view and stays a first-class option — it is denser, it is what you want when
 * you are scanning for a name rather than a face, and it is the one that keeps
 * working when a portrait is missing.
 */
export function ViewToggle({
  filters,
  view,
}: {
  filters: DirectoryFilterParams;
  view: DirectoryView;
}) {
  return (
    <div
      className="inline-flex h-9 items-center gap-0.5 rounded-lg border border-border-strong bg-card p-0.5 font-sans"
      role="group"
      aria-label="Directory view"
    >
      {OPTIONS.map((option) => {
        const active = view === option.value;
        return (
          <Link
            key={option.value}
            href={directoryHref(filters, option.value)}
            // aria-current is what tells a screen reader which of the two is on;
            // the tint alone only says it to people who can see it.
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors",
              active
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
              FOCUS,
            )}
          >
            <option.icon aria-hidden strokeWidth={1.75} className="h-3.5 w-3.5" />
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
