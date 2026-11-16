/**
 * The network map: how the Network scope's people become nodes and edges, and
 * where each one lands.
 *
 * Server-only. The d3-force simulation runs here at request time, so the SVG
 * arrives already laid out — no layout jump, no client CPU, and the same filter
 * set always draws the same picture (the simulation is seeded).
 *
 * The shape is deliberate. With ~100 people and a handful of explicit
 * connections, a people-only graph is a hundred loose dots. So the map is
 * organised around what the data actually holds:
 *
 *   - Program editions are hubs, laid out left→right by year, so the map reads
 *     as a timeline. Team engagements have no edition and get a hub of their own.
 *   - People sit around the hubs they held an engagement in, coloured by their
 *     most recent role.
 *   - An organization becomes a node only when more than one person came from
 *     it — those are the bridges worth seeing. Single-person organizations stay
 *     in the profile, where they were already.
 *   - A person↔person line is drawn only for an admin-written Connection.
 *     Sharing a hub is visible as sharing a hub, never as knowing each other.
 */
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";

import { EngagementRole } from "@/lib/generated/prisma/enums";
import {
  editionLabel,
  latestEngagementSummary,
  ROLE_LABELS,
  type NetworkPerson,
} from "@/lib/network";

export type GraphPersonNode = {
  id: string;
  kind: "person";
  personId: string;
  name: string;
  role: EngagementRole;
  roleLabel: string;
  summary: string;
  x: number;
  y: number;
  r: number;
};

export type GraphHubNode = {
  id: string;
  kind: "hub";
  label: string;
  count: number;
  x: number;
  y: number;
  r: number;
};

export type GraphOrgNode = {
  id: string;
  kind: "org";
  label: string;
  count: number;
  x: number;
  y: number;
  r: number;
};

export type GraphNode = GraphPersonNode | GraphHubNode | GraphOrgNode;

export type GraphEdge = {
  id: string;
  kind: "engagement" | "affiliation" | "connection";
  source: string;
  target: string;
  /** Connections carry the admin's label ("introduced them to PJX"). */
  label?: string;
};

export type NetworkGraph = {
  width: number;
  height: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Roles present among the visible people, most common first. */
  legend: { role: EngagementRole; label: string; count: number }[];
  /** Organizations with a single visible person — kept off the map on purpose. */
  foldedOrgs: number;
};

export type GraphConnection = { id: string; aId: string; bId: string; label: string };

const WIDTH = 1000;
const HEIGHT = 640;
const PAD = 60;

const TEAM_HUB_ID = "hub:team";

/**
 * Hubs are pinned, everything else finds its place around them. Editions
 * spread across the upper band in year order; the team hub sits below, pulled
 * toward the right because that is where the current year's edition is — the
 * people who are both fellows and team then sit naturally between the two.
 */
function pinHubs(hubs: Map<string, GraphHubNode & { year: number | null }>) {
  const editions = [...hubs.values()]
    .filter((hub) => hub.year !== null)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  const team = hubs.get(TEAM_HUB_ID);

  const bandY = team ? HEIGHT * 0.38 : HEIGHT * 0.5;
  editions.forEach((hub, index) => {
    const t = editions.length === 1 ? 0.5 : index / (editions.length - 1);
    hub.x = PAD * 2 + t * (WIDTH - PAD * 4);
    hub.y = bandY;
  });

  if (team) {
    team.x = editions.length > 0 ? WIDTH * 0.66 : WIDTH * 0.5;
    team.y = editions.length > 0 ? HEIGHT * 0.8 : HEIGHT * 0.5;
  }
}

/** A small deterministic PRNG so the same input always lays out the same way. */
function seeded(seed: number) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

type SimNode = SimulationNodeDatum & {
  id: string;
  kind: GraphNode["kind"];
  r: number;
  pinned: boolean;
  /** Hubs only: how many people hang off it, which sets how wide their ring is. */
  count: number;
};
type SimLink = SimulationLinkDatum<SimNode> & { kind: GraphEdge["kind"] };

export function buildNetworkGraph(
  people: NetworkPerson[],
  connections: GraphConnection[],
): NetworkGraph {
  const persons: GraphPersonNode[] = [];
  const hubs = new Map<string, GraphHubNode & { year: number | null }>();
  const orgs = new Map<string, GraphOrgNode & { people: Set<string> }>();
  const edges: GraphEdge[] = [];
  const seenEdges = new Set<string>();
  const roleCounts = new Map<EngagementRole, number>();

  const addEdge = (edge: GraphEdge) => {
    const key = `${edge.kind}:${edge.source}:${edge.target}`;
    if (seenEdges.has(key)) return;
    seenEdges.add(key);
    edges.push(edge);
  };

  for (const person of people) {
    const latest = person.engagements[0];
    // Everyone in the Network scope holds at least one engagement, but an
    // approved account with an empty history is still visible there — give
    // them a neutral node rather than dropping them from the map.
    const role = latest?.role ?? EngagementRole.OTHER;
    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);

    const id = `person:${person.id}`;
    persons.push({
      id,
      kind: "person",
      personId: person.id,
      name: person.name,
      role,
      roleLabel: ROLE_LABELS[role],
      summary: latestEngagementSummary(person.engagements) ?? person.title ?? "No engagements yet",
      x: 0,
      y: 0,
      // A little larger for the few people who came back more than once.
      r: 5 + Math.min(person.engagements.length - 1, 2) * 1.5,
    });

    for (const engagement of person.engagements) {
      let hubId: string | null = null;
      if (engagement.edition) {
        hubId = `hub:${engagement.edition.id}`;
        if (!hubs.has(hubId)) {
          hubs.set(hubId, {
            id: hubId,
            kind: "hub",
            label: editionLabel(engagement.edition),
            count: 0,
            year: engagement.edition.year,
            x: 0,
            y: 0,
            r: 0,
          });
        }
      } else if (engagement.role === EngagementRole.TEAM) {
        hubId = TEAM_HUB_ID;
        if (!hubs.has(hubId)) {
          hubs.set(hubId, {
            id: hubId,
            kind: "hub",
            label: "PJX Team",
            count: 0,
            year: null,
            x: 0,
            y: 0,
            r: 0,
          });
        }
      }
      if (hubId) {
        const before = edges.length;
        addEdge({ id: `eng:${engagement.id}`, kind: "engagement", source: id, target: hubId });
        if (edges.length > before) hubs.get(hubId)!.count += 1;
      }

      if (engagement.organization) {
        const orgId = `org:${engagement.organization.id}`;
        const org =
          orgs.get(orgId) ??
          orgs
            .set(orgId, {
              id: orgId,
              kind: "org",
              label: engagement.organization.name,
              count: 0,
              people: new Set(),
              x: 0,
              y: 0,
              r: 6,
            })
            .get(orgId)!;
        org.people.add(id);
      }
    }
  }

  // Only organizations that connect people earn a node.
  let foldedOrgs = 0;
  const orgNodes: GraphOrgNode[] = [];
  for (const org of orgs.values()) {
    if (org.people.size < 2) {
      foldedOrgs += 1;
      continue;
    }
    org.count = org.people.size;
    org.r = 6 + Math.min(org.people.size, 6);
    for (const personId of org.people) {
      addEdge({ id: `aff:${org.id}:${personId}`, kind: "affiliation", source: personId, target: org.id });
    }
    const { people: _people, ...node } = org;
    orgNodes.push(node);
  }

  const visible = new Set(persons.map((node) => node.id));
  for (const connection of connections) {
    const a = `person:${connection.aId}`;
    const b = `person:${connection.bId}`;
    if (!visible.has(a) || !visible.has(b)) continue;
    addEdge({ id: `con:${connection.id}`, kind: "connection", source: a, target: b, label: connection.label });
  }

  for (const hub of hubs.values()) {
    // Hub size tracks its crowd, within reason — the label has to fit inside.
    hub.r = 16 + Math.min(hub.count, 60) / 5;
  }
  pinHubs(hubs);

  const hubNodes: GraphHubNode[] = [...hubs.values()].map(({ year: _year, ...node }) => node);

  // --- Layout ---

  const simNodes: SimNode[] = [
    ...hubNodes.map((node) => ({
      id: node.id,
      kind: node.kind,
      r: node.r,
      pinned: true,
      count: node.count,
      x: node.x,
      y: node.y,
      fx: node.x,
      fy: node.y,
    })),
    ...persons.map((node) => ({ id: node.id, kind: node.kind, r: node.r, pinned: false, count: 0 })),
    ...orgNodes.map((node) => ({ id: node.id, kind: node.kind, r: node.r, pinned: false, count: 0 })),
  ];
  const byId = new Map(simNodes.map((node) => [node.id, node]));
  const simLinks: SimLink[] = edges.map((edge) => ({
    source: byId.get(edge.source)!,
    target: byId.get(edge.target)!,
    kind: edge.kind,
  }));

  // A hub's ring grows with its crowd, so sixty people get room to sit on it
  // rather than three deep over its rim.
  const distance = (link: SimLink) =>
    link.kind === "engagement"
      ? 50 + Math.sqrt((link.target as SimNode).count) * 9
      : link.kind === "affiliation"
        ? 34
        : 50;
  const strength = (link: SimLink) =>
    link.kind === "engagement" ? 0.5 : link.kind === "affiliation" ? 0.4 : 0.15;

  const simulation = forceSimulation<SimNode>(simNodes)
    .randomSource(seeded(20260901))
    .force("link", forceLink<SimNode, SimLink>(simLinks).distance(distance).strength(strength))
    .force(
      "charge",
      forceManyBody<SimNode>().strength((node) => (node.pinned ? -400 : -28)),
    )
    .force(
      "collide",
      forceCollide<SimNode>()
        // Organizations carry a label to their right; the extra room keeps
        // people from sitting on it.
        .radius((node) => node.r + (node.pinned ? 22 : node.kind === "org" ? 10 : 4))
        .strength(0.9),
    )
    // Weak pull to the middle so anyone without a hub still lands on the map.
    .force("x", forceX<SimNode>(WIDTH / 2).strength(0.015))
    .force("y", forceY<SimNode>(HEIGHT / 2).strength(0.03))
    .stop();

  for (let i = 0; i < 320; i += 1) simulation.tick();

  const clampX = (x: number) => Math.min(WIDTH - PAD / 2, Math.max(PAD / 2, x));
  const clampY = (y: number) => Math.min(HEIGHT - PAD / 2, Math.max(PAD / 2, y));
  const place = <T extends GraphNode>(node: T): T => {
    const sim = byId.get(node.id)!;
    return {
      ...node,
      x: Math.round(clampX(sim.x ?? 0) * 10) / 10,
      y: Math.round(clampY(sim.y ?? 0) * 10) / 10,
    };
  };

  const legend = [...roleCounts.entries()]
    .map(([role, count]) => ({ role, label: ROLE_LABELS[role], count }))
    .sort((a, b) => b.count - a.count);

  return {
    width: WIDTH,
    height: HEIGHT,
    // Hubs first so they paint under the people that overlap their rim.
    nodes: [...hubNodes.map(place), ...orgNodes.map(place), ...persons.map(place)],
    edges,
    legend,
    foldedOrgs,
  };
}
