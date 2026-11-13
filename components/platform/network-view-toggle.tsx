import { Rows3, Waypoints } from "lucide-react";
import Link from "next/link";

import { FOCUS } from "@/components/platform/page";
import { cn } from "@/lib/utils";

export type NetworkView = "list" | "graph";

export type NetworkFilterParams = {
  q?: string;
  role?: string;
  year?: string;
  program?: string;
};

/**
 * Same contract as the Team scope's `directoryHref`: the view lives in the URL
 * beside the filters, list is the default and so carries no parameter.
 */
export function networkHref(filters: NetworkFilterParams, view: NetworkView) {
  const params = new URLSearchParams();
  params.set("scope", "network");
  for (const key of ["q", "role", "year", "program"] as const) {
    if (filters[key]) params.set(key, filters[key]);
  }
  if (view === "graph") params.set("view", "graph");
  return `/directory?${params.toString()}`;
}

const OPTIONS = [
  { value: "list", label: "List", icon: Rows3 },
  { value: "graph", label: "Map", icon: Waypoints },
] as const;

/**
 * List ⇄ Map for the Network scope. Links, not buttons, for the same reasons
 * as the Team scope's toggle: switching view is navigation. The list stays the
 * default — it is the one that answers "find this person" and the one that is
 * fully readable without a pointer.
 */
export function NetworkViewToggle({
  filters,
  view,
}: {
  filters: NetworkFilterParams;
  view: NetworkView;
}) {
  return (
    <div
      className="inline-flex h-9 items-center gap-0.5 rounded-lg border border-border-strong bg-card p-0.5 font-sans"
      role="group"
      aria-label="Network view"
    >
      {OPTIONS.map((option) => {
        const active = view === option.value;
        return (
          <Link
            key={option.value}
            href={networkHref(filters, option.value)}
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
