import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-xl",
} as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Plain <img> rather than next/image: these are Google CDN URLs, and going through
 * the optimizer would mean whitelisting a remote host and failing closed whenever
 * it is unreachable. referrerPolicy is required — Google serves a placeholder to
 * requests that carry a referer.
 */
export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const base = cn(
    "shrink-0 overflow-hidden rounded-full bg-muted object-cover",
    SIZES[size],
    className,
  );

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" aria-hidden className={base} referrerPolicy="no-referrer" />;
  }

  return (
    <span
      aria-hidden
      className={cn(base, "flex items-center justify-center font-medium text-muted-foreground")}
    >
      {initials(name)}
    </span>
  );
}
