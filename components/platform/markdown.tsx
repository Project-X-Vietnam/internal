import type { ReactNode } from "react";

/**
 * A small markdown renderer for hub documents.
 *
 * Hand-rolled rather than a dependency for two reasons. There is no markdown
 * library in this tree, and every one of them ultimately hands you an HTML
 * string — which would mean `dangerouslySetInnerHTML` over copy typed into an
 * admin textarea. This returns React elements instead, so authored text can
 * never introduce markup, and no sanitizer has to be trusted.
 *
 * The supported subset is deliberately what a playbook or a letter needs:
 *
 *   ## / ### / ####      headings
 *   > quote              callout (may contain other blocks)
 *   - item  /  1. item   lists, one level, no nesting
 *   ---                  divider
 *   **bold** *italic* `code` [text](href)
 *   a paragraph that is nothing but a YouTube URL becomes a player
 *
 * Anything else is rendered as literal text rather than guessed at.
 *
 * It lives under components/ rather than lib/ for a load-bearing reason:
 * tailwind.config.ts only scans ./app and ./components, so utility classes used
 * only from lib/ are never generated. This file sat in lib/ at first and every
 * margin, border and tint below silently did nothing.
 */

const YOUTUBE =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#]\S*)?$/;

const INLINE =
  /\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|\*([^*\n]+?)\*|_([^_\n]+?)_|`([^`\n]+?)`|\[([^\]\n]+?)\]\(([^)\s]+?)\)/g;

/** Blocks that end a paragraph even without a blank line before them. */
const BLOCK_START = /^(?:#{2,4}\s|>\s?|\s*[-*]\s+|\s*\d+\.\s+|\s*(?:---+|\*\*\*+)\s*$)/;

/**
 * Body copy, matching the original letter: 16px stepping to 18px, justified,
 * generous leading.
 */
const PARAGRAPH = "my-4 text-justify text-base leading-relaxed text-muted-foreground md:text-lg";

/**
 * Only schemes that can't execute. `javascript:` and `data:` URLs in a link are
 * the one way authored text could still do something, so they're dropped and
 * the link renders as plain text.
 */
function safeHref(raw: string) {
  const href = raw.trim();
  if (/^(?:https?:|mailto:)/i.test(href)) return href;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  return null;
}

function inline(text: string, prefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = new RegExp(INLINE.source, "g");
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${prefix}i${index++}`;
    const [full, strongA, strongB, emA, emB, code, linkText, linkHref] = match;
    const strong = strongA ?? strongB;
    const em = emA ?? emB;

    if (strong !== undefined) {
      // Emphasis is weight 500 and a shift to full-strength ink, not bold —
      // body copy is muted, so the colour change is what does the work.
      nodes.push(
        <strong key={key} className="font-medium text-foreground">
          {inline(strong, key)}
        </strong>,
      );
    } else if (em !== undefined) {
      nodes.push(<em key={key}>{inline(em, key)}</em>);
    } else if (code !== undefined) {
      nodes.push(
        <code key={key} className="rounded-sm bg-muted px-1 py-px font-mono text-[0.9em]">
          {code}
        </code>,
      );
    } else if (linkText !== undefined && linkHref !== undefined) {
      const href = safeHref(linkHref);
      const external = href?.startsWith("http");
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
          >
            {inline(linkText, key)}
          </a>
        ) : (
          linkText
        ),
      );
    }

    last = match.index + full.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Video({ id }: { id: string }) {
  return (
    <figure className="my-10">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-2xl">
        <iframe
          // nocookie: members shouldn't pick up ad tracking from reading a doc.
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="Embedded video"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </figure>
  );
}

function blocks(source: string, prefix: string): ReactNode[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let index = 0;
  const key = () => `${prefix}b${index++}`;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      out.push(<hr key={key()} className="rule-subtle my-10" />);
      i++;
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      const k = key();
      const level = heading[1].length;

      // `###` is the letter's section marker — a centred label with a hairline
      // running out to each side, the way the original page drew it. `##` stays
      // an ordinary heading so longer playbooks can still have real sections.
      if (level === 3) {
        out.push(
          <div key={k} className="flex items-center gap-4 py-6">
            <span aria-hidden className="h-px flex-1 bg-border" />
            <h3 className="text-sm font-medium text-muted-foreground">
              {inline(heading[2], k)}
            </h3>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>,
        );
        i++;
        continue;
      }

      const Tag = level === 2 ? "h2" : "h4";
      out.push(
        <Tag
          key={k}
          className={
            level === 2
              ? "type-title mb-3 mt-12 text-foreground"
              : "type-heading mb-2 mt-8 text-foreground"
          }
        >
          {inline(heading[2], k)}
        </Tag>,
      );
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buffer: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buffer.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const k = key();
      out.push(
        // The pull-quote treatment from the original letter: a heavy primary
        // rule on the leading edge, a faint tint, square on that edge and
        // rounded away from it.
        <blockquote
          key={k}
          className="my-6 rounded-r-lg border-l-4 border-primary/70 bg-primary/5 px-5 py-4 dark:bg-primary/10 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        >
          {blocks(buffer.join("\n"), k)}
        </blockquote>,
      );
      continue;
    }

    const bullet = /^\s*[-*]\s+/;
    const numbered = /^\s*\d+\.\s+/;
    const marker = bullet.test(line) ? bullet : numbered.test(line) ? numbered : null;
    if (marker) {
      const items: string[] = [];
      while (i < lines.length && marker.test(lines[i])) {
        items.push(lines[i].replace(marker, ""));
        i++;
      }
      const k = key();
      const List = marker === bullet ? "ul" : "ol";
      out.push(
        <List
          key={k}
          className={`my-5 space-y-2 pl-5 text-base leading-relaxed text-muted-foreground marker:text-muted-foreground md:text-lg ${
            marker === bullet ? "list-disc" : "list-decimal"
          }`}
        >
          {items.map((item, at) => (
            <li key={`${k}l${at}`}>{inline(item, `${k}l${at}`)}</li>
          ))}
        </List>,
      );
      continue;
    }

    const buffer: string[] = [];
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) {
      buffer.push(lines[i].trim());
      i++;
    }
    const text = buffer.join(" ");
    const video = YOUTUBE.exec(text);
    if (video) {
      out.push(<Video key={key()} id={video[1]} />);
      continue;
    }
    const k = key();
    out.push(
      <p key={k} className={PARAGRAPH}>
        {inline(text, k)}
      </p>,
    );
  }

  return out;
}

/** Renders a document body. Held to a readable measure by its container, not here. */
export function Markdown({ source }: { source: string }) {
  return <div className="[&>*:first-child]:mt-0">{blocks(source, "m")}</div>;
}

/** First paragraph, flattened — for list summaries where none was written. */
export function excerpt(source: string, limit = 180) {
  const first =
    source
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !BLOCK_START.test(block) && !YOUTUBE.test(block)) ?? "";

  const plain = first
    .replace(/\*\*|__|[*_`]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > limit ? `${plain.slice(0, limit).trimEnd()}…` : plain;
}
