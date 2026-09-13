"use client";

import { Maximize2, Minus, Plus } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { NetworkSheet, type NetworkSheetPerson } from "@/components/platform/network-sheet";
import { Button } from "@/components/ui/button";
import type { EngagementRole } from "@/lib/generated/prisma/enums";
import type { GraphEdge, GraphNode, NetworkGraph as NetworkGraphData } from "@/lib/network-graph";
import { cn } from "@/lib/utils";

/**
 * One colour per role, as literal class names so Tailwind can see them. Team
 * and Fellow take the two brand colours because they are the two groups the
 * organisation is made of; the rest are distinct hues that hold up in both
 * themes.
 */
const ROLE_FILL: Record<EngagementRole, string> = {
  TEAM: "fill-primary",
  FELLOW: "fill-secondary",
  MENTOR: "fill-violet-500",
  SPEAKER: "fill-amber-500",
  PARTNER: "fill-emerald-500",
  TRAINER: "fill-rose-500",
  ADVISOR: "fill-teal-500",
  OTHER: "fill-zinc-400",
};

/**
 * Edge weight says what kind of fact the line is. Engagements are the
 * quietest: they are structure, and there are a hundred of them. Affiliations
 * are dashed so "came from the same company" never reads as a relationship.
 * A connection is the only dark line on the map, because it is the only one
 * an admin wrote on purpose.
 */
const EDGE_CLASS: Record<GraphEdge["kind"], string> = {
  engagement: "stroke-border-strong",
  affiliation: "stroke-muted-foreground/50 [stroke-dasharray:3_3]",
  connection: "stroke-foreground",
};
const EDGE_WIDTH: Record<GraphEdge["kind"], number> = {
  engagement: 1,
  affiliation: 1,
  connection: 1.75,
};

/** Above this many people, names appear only around whatever is hovered or selected. */
const NAME_EVERYONE_UP_TO = 40;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 5;

type Transform = { x: number; y: number; k: number };
const IDENTITY: Transform = { x: 0, y: 0, k: 1 };

type Tooltip = { id: string; x: number; y: number };

/** Text with a halo in the card colour, so a name stays legible over lines. */
const HALO = { paintOrder: "stroke" as const, strokeLinejoin: "round" as const };

/**
 * The network map — the Network scope's people drawn as a graph. Layout is
 * done on the server (lib/network-graph.ts); this component only paints it,
 * lets you pan and zoom, and answers hover, focus and clicks.
 *
 * Interaction model, kept small on purpose:
 *   - Hover or focus anything → it and its neighbours stay lit, the rest fades.
 *   - Click a hub or organization → that neighbourhood stays lit until you
 *     click the background or press Escape.
 *   - Click a person → the same quick-look sheet the list opens. Every person
 *     is a real link to their profile, so ⌘-click and the keyboard still work.
 *   - Drag the background to pan; ⌘/Ctrl + scroll or pinch to zoom. A plain
 *     scroll keeps scrolling the page — the map must not trap the wheel.
 */
export function NetworkGraph({
  graph,
  people,
  viewerId,
  isAdmin,
}: {
  graph: NetworkGraphData;
  people: NetworkSheetPerson[];
  viewerId: string;
  isAdmin: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState<Transform>(IDENTITY);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openerRef = useRef<Element | null>(null);

  const nodeById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph]);
  const personIndex = useMemo(
    () => new Map(people.map((person, index) => [person.id, index])),
    [people],
  );
  const neighbours = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const add = (a: string, b: string) => {
      if (!map.has(a)) map.set(a, new Set());
      map.get(a)!.add(b);
    };
    for (const edge of graph.edges) {
      add(edge.source, edge.target);
      add(edge.target, edge.source);
    }
    return map;
  }, [graph]);

  const personCount = graph.legend.reduce((sum, entry) => sum + entry.count, 0);
  const active = hovered ?? selected;
  const lit = useCallback(
    (id: string) => !active || id === active || (neighbours.get(active)?.has(id) ?? false),
    [active, neighbours],
  );
  const litEdge = (edge: GraphEdge) =>
    !active || edge.source === active || edge.target === active;

  // --- Pan & zoom ---

  /** The viewBox is `meet`-fitted, so one viewBox unit is this many pixels. */
  const pixelScale = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return 1;
    const rect = svg.getBoundingClientRect();
    return Math.min(rect.width / graph.width, rect.height / graph.height);
  }, [graph.width, graph.height]);

  /** Client pixel → viewBox coordinate (before the pan/zoom transform). */
  const toViewBox = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      const scale = pixelScale();
      const offsetX = (rect.width - graph.width * scale) / 2;
      const offsetY = (rect.height - graph.height * scale) / 2;
      return {
        x: (clientX - rect.left - offsetX) / scale,
        y: (clientY - rect.top - offsetY) / scale,
      };
    },
    [graph.width, graph.height, pixelScale],
  );

  const zoomAround = useCallback((factor: number, px: number, py: number) => {
    setTransform((current) => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor));
      const ratio = k / current.k;
      return { k, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio };
    });
  }, []);

  const zoomStep = (factor: number) =>
    zoomAround(factor, graph.width / 2, graph.height / 2);

  // React registers wheel listeners as passive, so preventDefault has to come
  // from a native one. Only a modified wheel zooms — trackpad pinch arrives as
  // ctrl+wheel, which is exactly the gesture people expect to zoom a map.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const { x, y } = toViewBox(event.clientX, event.clientY);
      zoomAround(Math.exp(-event.deltaY * 0.01), x, y);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [toViewBox, zoomAround]);

  const drag = useRef<{ startX: number; startY: number; x: number; y: number; moved: boolean } | null>(
    null,
  );

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    if ((event.target as Element).closest("[data-node]")) return;
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: transform.x,
      y: transform.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const state = drag.current;
    if (!state) return;
    const scale = pixelScale();
    const dx = (event.clientX - state.startX) / scale;
    const dy = (event.clientY - state.startY) / scale;
    if (Math.abs(dx) + Math.abs(dy) > 2) state.moved = true;
    setTransform((current) => ({ ...current, x: state.x + dx, y: state.y + dy }));
  };

  const onPointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    const state = drag.current;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // A click on empty space, as opposed to a pan, clears the selection.
    if (state && !state.moved) setSelected(null);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSelected(null);
      setHovered(null);
      setTooltip(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- Node interaction ---

  const enter = (id: string) => (event: ReactPointerEvent | React.FocusEvent) => {
    setHovered(id);
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if ("clientX" in event) {
      setTooltip({ id, x: event.clientX - rect.left, y: event.clientY - rect.top });
    } else {
      // Keyboard focus: anchor the tooltip to the node itself.
      const node = nodeById.get(id);
      if (!node) return;
      const scale = pixelScale();
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      const offsetX = (svgRect.width - graph.width * scale) / 2;
      const offsetY = (svgRect.height - graph.height * scale) / 2;
      setTooltip({
        id,
        x: svgRect.left - rect.left + offsetX + (node.x * transform.k + transform.x) * scale,
        y: svgRect.top - rect.top + offsetY + (node.y * transform.k + transform.y) * scale,
      });
    }
  };
  const move = (event: ReactPointerEvent) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    setTooltip((current) =>
      current ? { ...current, x: event.clientX - rect.left, y: event.clientY - rect.top } : current,
    );
  };
  const leave = () => {
    setHovered(null);
    setTooltip(null);
  };

  const toggleSelect = (id: string) => setSelected((current) => (current === id ? null : id));
  const onGroupKey = (id: string) => (event: ReactKeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleSelect(id);
  };

  const openPerson = (event: React.MouseEvent<Element>, personId: string) => {
    // Modified clicks stay with the browser — new tab, new window, and so on.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    const index = personIndex.get(personId);
    if (index === undefined) return;
    event.preventDefault();
    openerRef.current = event.currentTarget;
    setTooltip(null);
    setOpenIndex(index);
  };

  const closeSheet = useCallback(() => {
    setOpenIndex(null);
    (openerRef.current as HTMLElement | null)?.focus?.();
  }, []);

  const stepSheet = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null || people.length === 0
          ? current
          : (current + delta + people.length) % people.length,
      ),
    [people.length],
  );

  const showEveryName = personCount <= NAME_EVERYONE_UP_TO;
  const nameShown = (id: string) => showEveryName || (active !== null && lit(id));

  const tooltipNode = tooltip ? nodeById.get(tooltip.id) : null;
  const tooltipOnRight = tooltip && frameRef.current
    ? tooltip.x > frameRef.current.clientWidth * 0.6
    : false;

  return (
    <>
      <div
        ref={frameRef}
        className="relative mt-3 overflow-hidden rounded-lg border border-border-strong bg-card"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label={`Network map: ${personCount} people around ${graph.nodes.filter((node) => node.kind === "hub").length} programs`}
          // pan-y keeps the page scrollable on touch; a sideways drag pans.
          className="block h-[68vh] min-h-[440px] w-full touch-pan-y select-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            <g aria-hidden>
              {graph.edges.map((edge) => {
                const source = nodeById.get(edge.source);
                const target = nodeById.get(edge.target);
                if (!source || !target) return null;
                return (
                  <line
                    key={edge.id}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    strokeWidth={EDGE_WIDTH[edge.kind] / Math.sqrt(transform.k)}
                    className={cn(
                      "transition-opacity duration-150",
                      EDGE_CLASS[edge.kind],
                      !litEdge(edge) && "opacity-10",
                    )}
                  />
                );
              })}
            </g>

            {graph.nodes.map((node) => (
              <Node
                key={node.id}
                node={node}
                lit={lit(node.id)}
                selected={selected === node.id}
                hovered={hovered === node.id}
                nameShown={node.kind !== "person" || nameShown(node.id)}
                zoom={transform.k}
                onEnter={enter(node.id)}
                onMove={move}
                onLeave={leave}
                onOpen={openPerson}
                onToggle={() => toggleSelect(node.id)}
                onKey={onGroupKey(node.id)}
              />
            ))}
          </g>
        </svg>

        {/* Zoom controls. Buttons rather than only gestures: they are the
            keyboard route, and the only route on a mouse without a modifier. */}
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Zoom in"
            onClick={() => zoomStep(1.4)}
          >
            <Plus aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Zoom out"
            onClick={() => zoomStep(1 / 1.4)}
          >
            <Minus aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Fit to view"
            onClick={() => setTransform(IDENTITY)}
          >
            <Maximize2 aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Button>
        </div>

        <p className="type-meta pointer-events-none absolute bottom-3 right-3 hidden sm:block">
          Drag to pan · ⌘ + scroll to zoom
        </p>

        {tooltipNode && tooltip && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 max-w-64 rounded-md bg-popover px-2.5 py-1.5 shadow-[0_8px_24px_-8px_hsl(var(--foreground)/0.3)]"
            style={
              tooltipOnRight
                ? { right: frameRef.current!.clientWidth - tooltip.x + 12, top: tooltip.y + 12 }
                : { left: tooltip.x + 12, top: tooltip.y + 12 }
            }
          >
            <p className="type-small font-medium">
              {tooltipNode.kind === "person" ? tooltipNode.name : tooltipNode.label}
            </p>
            <p className="type-small text-muted-foreground">
              {tooltipNode.kind === "person"
                ? tooltipNode.summary
                : `${tooltipNode.count} ${tooltipNode.count === 1 ? "person" : "people"}${
                    tooltipNode.kind === "hub" ? "" : " · organization"
                  }`}
            </p>
          </div>
        )}
      </div>

      <Legend graph={graph} />

      <NetworkSheet
        person={openIndex === null ? null : (people[openIndex] ?? null)}
        isViewer={openIndex !== null && people[openIndex]?.id === viewerId}
        isAdmin={isAdmin}
        position={openIndex === null ? null : { index: openIndex + 1, total: people.length }}
        onClose={closeSheet}
        onStep={stepSheet}
      />
    </>
  );
}

function Node({
  node,
  lit,
  selected,
  hovered,
  nameShown,
  zoom,
  onEnter,
  onMove,
  onLeave,
  onOpen,
  onToggle,
  onKey,
}: {
  node: GraphNode;
  lit: boolean;
  selected: boolean;
  hovered: boolean;
  nameShown: boolean;
  zoom: number;
  onEnter: (event: ReactPointerEvent | React.FocusEvent) => void;
  onMove: (event: ReactPointerEvent) => void;
  onLeave: () => void;
  onOpen: (event: React.MouseEvent<Element>, personId: string) => void;
  onToggle: () => void;
  onKey: (event: ReactKeyboardEvent) => void;
}) {
  // Strokes and type shrink as you zoom in, so a close-up shows detail rather
  // than thicker lines and giant labels.
  const hair = 1 / Math.sqrt(zoom);
  const fontSize = (base: number) => base / Math.sqrt(zoom);
  const fade = cn("transition-opacity duration-150", !lit && "opacity-15");
  const [focused, setFocused] = useState(false);
  const ring = (selected || focused) && (
    <circle
      cx={node.x}
      cy={node.y}
      r={node.r + 4 * hair}
      fill="none"
      strokeWidth={2 * hair}
      className="stroke-ring"
    />
  );
  const focusProps = {
    onFocus: (event: React.FocusEvent) => {
      setFocused(true);
      onEnter(event);
    },
    onBlur: () => {
      setFocused(false);
      onLeave();
    },
  };

  if (node.kind === "person") {
    return (
      <a
        href={`/directory/${node.personId}`}
        data-node
        aria-label={`${node.name} — ${node.summary}`}
        aria-haspopup="dialog"
        className={cn("cursor-pointer outline-none", fade)}
        onClick={(event) => onOpen(event, node.personId)}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        {...focusProps}
      >
        {ring}
        <circle
          cx={node.x}
          cy={node.y}
          r={hovered ? node.r + 2 * hair : node.r}
          strokeWidth={1.5 * hair}
          className={cn("stroke-card transition-[r] duration-100", ROLE_FILL[node.role])}
        />
        {nameShown && (
          <text
            x={node.x + node.r + 3 * hair}
            y={node.y + fontSize(3.4)}
            fontSize={fontSize(10)}
            strokeWidth={2.5 * hair}
            className="fill-foreground stroke-card"
            style={HALO}
          >
            {node.name}
          </text>
        )}
      </a>
    );
  }

  if (node.kind === "hub") {
    return (
      <g
        data-node
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`${node.label}, ${node.count} people`}
        className={cn("cursor-pointer outline-none", fade)}
        onClick={onToggle}
        onKeyDown={onKey}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        {...focusProps}
      >
        {ring}
        <circle
          cx={node.x}
          cy={node.y}
          r={node.r}
          strokeWidth={2 * hair}
          className="fill-card stroke-primary"
        />
        <text
          x={node.x}
          y={node.y + fontSize(4.5)}
          fontSize={fontSize(13)}
          fontWeight={600}
          textAnchor="middle"
          className="fill-primary tabular-nums"
        >
          {node.count}
        </text>
        <text
          x={node.x}
          y={node.y + node.r + fontSize(14)}
          fontSize={fontSize(12)}
          fontWeight={600}
          textAnchor="middle"
          strokeWidth={3 * hair}
          className="fill-foreground stroke-card"
          style={HALO}
        >
          {node.label}
        </text>
      </g>
    );
  }

  const side = node.r * 2;
  return (
    <g
      data-node
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${node.label}, organization of ${node.count} people`}
      className={cn("cursor-pointer outline-none", fade)}
      onClick={onToggle}
      onKeyDown={onKey}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...focusProps}
    >
      {ring}
      <rect
        x={node.x - node.r}
        y={node.y - node.r}
        width={side}
        height={side}
        rx={3}
        strokeWidth={1.5 * hair}
        className="fill-card stroke-muted-foreground"
      />
      <text
        x={node.x + node.r + 3 * hair}
        y={node.y + fontSize(3.4)}
        fontSize={fontSize(10)}
        strokeWidth={2.5 * hair}
        className="fill-muted-foreground stroke-card"
        style={HALO}
      >
        {node.label}
      </text>
    </g>
  );
}

/**
 * What the marks mean, under the map rather than over it — the map needs every
 * pixel it has, and the legend needs to be readable without a pointer.
 */
function Legend({ graph }: { graph: NetworkGraphData }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-label="Roles">
        {graph.legend.map((entry) => (
          <li key={entry.role} className="type-small flex items-center gap-1.5">
            <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3">
              <circle cx={6} cy={6} r={5} className={ROLE_FILL[entry.role]} />
            </svg>
            {entry.label}
            <span className="type-meta tabular-nums">{entry.count}</span>
          </li>
        ))}
      </ul>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-label="Marks">
        <li className="type-small flex items-center gap-1.5 text-muted-foreground">
          <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5">
            <circle cx={7} cy={7} r={5.5} strokeWidth={2} className="fill-card stroke-primary" />
          </svg>
          Program or team
        </li>
        <li className="type-small flex items-center gap-1.5 text-muted-foreground">
          <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5">
            <rect x={2} y={2} width={10} height={10} rx={2} strokeWidth={1.5} className="fill-card stroke-muted-foreground" />
          </svg>
          Organization, 2+ people
        </li>
        <li className="type-small flex items-center gap-1.5 text-muted-foreground">
          <svg aria-hidden viewBox="0 0 20 8" className="h-2 w-5">
            <line x1={0} y1={4} x2={20} y2={4} strokeWidth={2} className="stroke-foreground" />
          </svg>
          Connection, written by an admin
        </li>
      </ul>

      {graph.foldedOrgs > 0 && (
        <p className="type-meta basis-full">
          {graph.foldedOrgs} {graph.foldedOrgs === 1 ? "organization" : "organizations"} with a
          single person {graph.foldedOrgs === 1 ? "is" : "are"} listed on profiles rather than drawn.
        </p>
      )}
    </div>
  );
}
