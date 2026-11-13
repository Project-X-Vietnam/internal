import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * Modern Project X Timeline
 * - Vertical timeline with halo nodes
 * - Clean cards for content
 * - Dark/Light theme support
 */
export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative max-w-3xl mx-auto py-12 md:py-16 px-6 md:px-8", className)}>
      {/* Vertical line - centered with the 16px dot: padding (24px/32px) + half dot (8px) - half line (1px) */}
      <div className="absolute left-[31px] md:left-[39px] top-0 h-full w-[2px] bg-slate-200 dark:bg-white/10" />

      <div className="space-y-12">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative flex gap-8 items-start"
          >
            {/* Timeline node */}
            <div className="relative z-10 flex-shrink-0 mt-1.5">
              <div className="h-4 w-4 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center ring-4 ring-background">
                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              </div>
            </div>

            {/* Content Card */}
            <div
              className={cn(
                "flex-1 rounded-2xl p-6 md:p-8",
                "bg-white dark:bg-white/5",
                "border border-slate-100 dark:border-white/10",
                "shadow-sm hover:shadow-lg dark:hover:bg-white/10",
                "transition-all duration-300 hover:scale-[1.01]"
              )}
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary/80 mb-2 block">
                {item.date}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-base text-slate-600 dark:text-white/60 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}