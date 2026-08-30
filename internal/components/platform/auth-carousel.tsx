"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { FOCUS } from "@/components/platform/page";
import { cn } from "@/lib/utils";

export type Slide = { src: string; alt: string; caption: string };

const INTERVAL = 6000;
const WIDE = "(min-width: 1024px)";

/**
 * The media panel beside the sign-in form.
 *
 * Slides crossfade rather than slide — the portal's motion is quiet, and a
 * horizontal sweep next to a static form reads as a page transition.
 *
 * Accessibility, since this is auto-updating content:
 * - A pause control is required by WCAG 2.2.2; dots alone don't satisfy it.
 * - Autoplay is off entirely under `prefers-reduced-motion`, which leaves the
 *   dots as the only way to move — so they stay visible in every state.
 * - Images carry real alt text, but the region is decorative context rather
 *   than content, so nothing here is announced live.
 */
export function AuthCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // The panel is `hidden` below `lg` — but hidden is not unmounted. Without
  // this gate the timers keep firing and the images still get fetched, so a
  // phone downloads photographs it will never show.
  const [wide, setWide] = useState(false);

  // Every slide sits inside the viewport, so `loading="lazy"` would still fetch
  // all of them on first paint — roughly half a megabyte, on the one page this
  // platform serves to the public. Mounting an image only once its slot has
  // been reached keeps first paint to a single photograph.
  const [seen, setSeen] = useState<number[]>([0]);

  useEffect(() => {
    setSeen((current) => (current.includes(index) ? current : [...current, index]));
  }, [index]);

  useEffect(() => {
    const wideQuery = window.matchMedia(WIDE);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setWide(wideQuery.matches);
      setReduced(motionQuery.matches);
    };
    apply();
    wideQuery.addEventListener("change", apply);
    motionQuery.addEventListener("change", apply);
    return () => {
      wideQuery.removeEventListener("change", apply);
      motionQuery.removeEventListener("change", apply);
    };
  }, []);

  // `index` is a dependency on purpose: picking a slot by hand restarts the
  // dwell rather than cutting it short.
  useEffect(() => {
    if (!wide || paused || reduced || slides.length < 2) return;
    const id = window.setTimeout(
      () => setIndex((current) => (current + 1) % slides.length),
      INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [index, wide, paused, reduced, slides.length]);

  const show = useCallback((next: number) => setIndex(next), []);

  if (slides.length === 0) return null;

  const autoplaying = wide && !paused && !reduced && slides.length > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Project X Vietnam"
      className="relative h-full w-full overflow-hidden rounded-media bg-muted"
    >
      {wide && (
        <>
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i !== index}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
                i === index ? "opacity-100" : "opacity-0",
              )}
            >
              {seen.includes(i) && (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  // Half the viewport, and never rendered below `lg`.
                  sizes="(min-width: 1024px) 50vw, 0px"
                  className="object-cover"
                />
              )}

              {/* Scrim and caption sit inside the slide so all three fade as
                  one unit. Fading the caption separately made its opacity
                  depend on an animation restarting cleanly every time — which
                  it did not. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
              />
              <p className="type-meta absolute bottom-6 left-6 max-w-[60%] text-white/85">
                {slide.caption}
              </p>
            </div>
          ))}

          {slides.length > 1 && (
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <ul className="flex items-center gap-1.5">
                {slides.map((slide, i) => (
                  <li key={slide.src} className="flex">
                    <button
                      type="button"
                      onClick={() => show(i)}
                      aria-label={`Show image ${i + 1} of ${slides.length}`}
                      aria-current={i === index ? "true" : undefined}
                      // Hit area stays 24px tall though the mark is 6px.
                      className={cn("grid h-6 w-4 place-items-center", FOCUS)}
                    >
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-all",
                          i === index ? "w-4 bg-white" : "w-1.5 bg-white/45",
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={autoplaying ? "Pause slideshow" : "Play slideshow"}
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-sm text-white/70 transition-colors hover:text-white",
                  FOCUS,
                )}
              >
                {autoplaying ? (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                    <rect x="2" y="1.5" width="3" height="9" rx="0.5" />
                    <rect x="7" y="1.5" width="3" height="9" rx="0.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                    <path d="M3 1.5v9l7-4.5-7-4.5Z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
