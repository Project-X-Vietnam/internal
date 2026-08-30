"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Car,
  ChevronDown,
  FileText,
  Globe,
  Landmark,
  Mail,
  MapPin,
  Plane,
  Radio,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Select } from "@/components/ui/theia-select";

type Props = {
  onSolve: (answer: string) => void | Promise<void>;
  teamName?: string;
};

type EvidenceKey =
  | "rideUser"
  | "rideTrip"
  | "telecomSubscriber"
  | "telecomPing"
  | "telecomMessage"
  | "mapsGeocode"
  | "mapsDistance"
  | "airlineFlights"
  | "airlineManifest"
  | "airlineBooking"
  | "airlineSeatmap"
  | "airlineCheckin"
  | "bankingAccounts"
  | "bankingWires"
  | "bankingTransaction"
  | "mailFolders"
  | "mailMessages"
  | "mailMessage"
  | "mailAttachment"
  | "archivePage";

type EvidenceState = Record<EvidenceKey, boolean>;

type EndpointDoc = {
  id: string;
  method: "GET";
  path: string;
  label: string;
  purpose: string;
  params: string[];
  paramsDetail: string[];
  sampleParams: Record<string, string>;
  sampleRequest: string;
  returns: string;
  responseShape: string[];
  notes: string[];
  evidenceKey?: EvidenceKey;
  starterParams?: Record<string, string>;
  validate?: (data: unknown) => string | null;
};

type ServiceDoc = {
  id: string;
  label: string;
  description: string;
  providers: string[];
  endpoints: EndpointDoc[];
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
  ride: Car,
  telecom: Radio,
  maps: MapPin,
  airline: Plane,
  banking: Landmark,
  mail: Mail,
  archive: Globe,
};

type WorkbenchState = {
  endpointId: string;
  paramsText: string;
  result: unknown;
  status: "idle" | "running" | "success" | "error";
  message: string | null;
};

type M2Draft = {
  version: 1;
  savedAt: string;
  evidence: Partial<EvidenceState>;
  workbench: Record<string, Partial<WorkbenchState>>;
  docsServiceId: string | null;
  expandedDocs: Record<string, boolean>;
};

const DRAFT_VERSION = 1;

const INITIAL_EVIDENCE: EvidenceState = {
  rideUser: false,
  rideTrip: false,
  telecomSubscriber: false,
  telecomPing: false,
  telecomMessage: false,
  mapsGeocode: false,
  mapsDistance: false,
  airlineFlights: false,
  airlineManifest: false,
  airlineBooking: false,
  airlineSeatmap: false,
  airlineCheckin: false,
  bankingAccounts: false,
  bankingWires: false,
  bankingTransaction: false,
  mailFolders: false,
  mailMessages: false,
  mailMessage: false,
  mailAttachment: false,
  archivePage: false,
};

const CASE_NOTE_REQUIREMENTS: {
  scope: string;
  title: string;
  description: string;
  evidenceKeys: EvidenceKey[];
}[] = [
  {
    scope: "Ride history",
    title: "Mobility chain: late trip",
    description: "Understand whether the badge timeline matches a real-world trip.",
    evidenceKeys: ["rideTrip"],
  },
  {
    scope: "Phone records",
    title: "Phone location: late tower event",
    description: "Compare phone movement with the story told by the badge logs.",
    evidenceKeys: ["telecomPing"],
  },
  {
    scope: "Message metadata",
    title: "SMS breadcrumb: ride corroboration",
    description: "A lightweight signal can support the mobility trail.",
    evidenceKeys: ["telecomMessage"],
  },
  {
    scope: "Map distance",
    title: "Feasibility check: tower vs. dropoff",
    description: "Measure whether two location claims can fit the same timeline.",
    evidenceKeys: ["mapsDistance"],
  },
  {
    scope: "Flight records",
    title: "Departure lead: held seat before dawn",
    description: "Check early departures for a seat that does not behave normally.",
    evidenceKeys: ["airlineManifest"],
  },
  {
    scope: "Banking records",
    title: "Money trail: seat reservation wire",
    description: "Understand what funded the unusual reservation.",
    evidenceKeys: ["bankingTransaction"],
  },
  {
    scope: "Mail folders",
    title: "Hidden route: unsent Mail message",
    description: "Look beyond delivered mail for a route that was never sent.",
    evidenceKeys: ["mailMessage"],
  },
  {
    scope: "Badge audit",
    title: "Badge duplicate: audit attachment",
    description: "Understand how a badge identity could be reused.",
    evidenceKeys: ["mailAttachment"],
  },
  {
    scope: "Public archive",
    title: "Background seed: revised archive page",
    description: "Understand the family context around Kai.",
    evidenceKeys: ["archivePage"],
  },
];

function bodyText(data: unknown) {
  return JSON.stringify(data) ?? "";
}

function includesAll(data: unknown, parts: string[]) {
  const text = bodyText(data).toLowerCase();
  return parts.every((part) => text.includes(part.toLowerCase()));
}

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : {};
}

const EVIDENCE_MISMATCH = "evidence-mismatch";

const SERVICES: ServiceDoc[] = [
  {
    id: "ride",
    label: "Ride Hailing",
    description:
      "Consumer mobility service. User records and trip records are separate resources.",
    providers: ["Grab", "Be", "Xanh SM"],
    endpoints: [
      {
        id: "ride-users",
        method: "GET",
        path: "/api/mock/ride",
        label: "Users",
        purpose:
          "Look up rider account records before querying trip history. Trips are keyed by rider_id, so names and phone numbers are only useful as identity-resolution filters.",
        params: ["provider", "resource=users", "name?", "phone?"],
        paramsDetail: [
          "provider: required. Supported providers: Grab, Be, Xanh SM.",
          "resource: required. Use users to select the rider directory resource.",
          "name: optional partial, case-insensitive display-name search.",
          "phone: optional exact phone-number match. Use when a phone number is known from another source.",
        ],
        sampleParams: { provider: "Be", resource: "users", name: "Kai" },
        sampleRequest: "/api/mock/ride?provider=Be&resource=users&name=Kai",
        returns: "Rider profiles, including rider_id used by trips.",
        responseShape: [
          "status: ok or error.",
          "resource: users.",
          "users[]: rider_id, name, phone, account_status.",
          "_docs: lightweight endpoint metadata from the service.",
        ],
        notes: [
          "A broad user-directory call is noisy. Narrow to one person before using the returned rider_id elsewhere.",
          "The returned rider_id is more stable than phone number for trip queries.",
        ],
        evidenceKey: "rideUser",
        starterParams: { resource: "users" },
        validate: (data) => {
          const users = asRecord(data).users;
          return Array.isArray(users) &&
            users.length === 1 &&
            includesAll(users[0], ["Grab", "RH-U-002", "Minh"])
            ? null
            : EVIDENCE_MISMATCH;
        },
      },
      {
        id: "ride-trips",
        method: "GET",
        path: "/api/mock/ride",
        label: "Trips",
        params: ["provider", "resource=trips", "rider_id?", "rider_phone?", "after?", "before?"],
        purpose:
          "Retrieve pickup and dropoff records for a rider. Use this after resolving a rider identity from the Users resource.",
        paramsDetail: [
          "provider: required. Supported providers: Grab, Be, Xanh SM.",
          "resource: required. Use trips to select trip records.",
          "rider_id: optional exact rider id. Preferred when available from Users.",
          "rider_phone: optional exact phone-number fallback.",
          "after: optional ISO timestamp lower bound applied to pickup_ts.",
          "before: optional ISO timestamp upper bound applied to pickup_ts.",
        ],
        sampleParams: {
          provider: "Be",
          resource: "trips",
          rider_id: "RH-U-001",
          after: "2026-03-17T00:00:00+07:00",
        },
        sampleRequest:
          "/api/mock/ride?provider=Be&resource=trips&rider_id=RH-U-001&after=2026-03-17T00%3A00%3A00%2B07%3A00",
        returns: "Trip pickup/dropoff records for a rider.",
        responseShape: [
          "status: ok or error.",
          "resource: trips.",
          "rides[]: provider, ride_id, rider_id, rider_phone, pickup, dropoff, pickup_ts, dropoff_ts, fare_vnd, driver, vehicle_plate.",
          "_meta.total: number of matching rides.",
        ],
        notes: [
          "Use the output of Users as input here. That is the intended cross-resource chain.",
          "Time filters are inclusive string comparisons over ISO timestamps.",
        ],
        evidenceKey: "rideTrip",
        starterParams: { resource: "trips" },
        validate: (data) => {
          const rides = asRecord(data).rides;
          return Array.isArray(rides) &&
            rides.length === 1 &&
            includesAll(rides[0], ["Grab", "RH-U-002", "22:28", "Thảo Điền"])
            ? null
            : EVIDENCE_MISMATCH;
        },
      },
      {
        id: "ride-drivers",
        method: "GET",
        path: "/api/mock/ride",
        label: "Drivers",
        purpose:
          "Inspect driver directory records. This resource can corroborate vehicle or driver details from a known ride, but it is not a rider lookup.",
        params: ["provider", "resource=drivers", "driver_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Grab, Be, Xanh SM.",
          "resource: required. Use drivers to select the driver directory.",
          "driver_id: optional exact driver id if one is known.",
        ],
        sampleParams: { provider: "Be", resource: "drivers", driver_id: "DRV-81" },
        sampleRequest: "/api/mock/ride?provider=Be&resource=drivers&driver_id=DRV-81",
        returns: "Driver directory records.",
        responseShape: [
          "status: ok or error.",
          "resource: drivers.",
          "drivers[]: driver_id, name, rating.",
        ],
        notes: [
          "This is a supporting resource. It is useful after you already have a ride record.",
          "Driver records do not prove where the rider went unless paired with a trip.",
        ],
        starterParams: { resource: "drivers" },
      },
      {
        id: "ride-payments",
        method: "GET",
        path: "/api/mock/ride",
        label: "Payments",
        purpose:
          "Inspect payment metadata for known ride ids. Use it to verify that a ride record has an attached transaction.",
        params: ["provider", "resource=payments", "ride_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Grab, Be, Xanh SM.",
          "resource: required. Use payments to select ride payment records.",
          "ride_id: optional exact ride id from Trips.",
        ],
        sampleParams: { provider: "Be", resource: "payments", ride_id: "RH-20260317-0814" },
        sampleRequest:
          "/api/mock/ride?provider=Be&resource=payments&ride_id=RH-20260317-0814",
        returns: "Payment records for rides.",
        responseShape: [
          "status: ok or error.",
          "resource: payments.",
          "payments[]: payment_id, ride_id, method, amount_vnd.",
        ],
        notes: [
          "Payment metadata is not enough by itself. Pair it with the ride pickup and dropoff timestamps.",
        ],
        starterParams: { resource: "payments" },
      },
    ],
  },
  {
    id: "telecom",
    label: "Telecom",
    description:
      "Cell-tower event service. It accepts SIM identifiers, not employee names or phone numbers.",
    providers: ["Viettel", "MobiFone", "VinaPhone"],
    endpoints: [
      {
        id: "telecom-subscribers",
        method: "GET",
        path: "/api/mock/telecom",
        label: "Subscribers",
        purpose:
          "Resolve a phone number to the telecom subscriber record and SIM id. This is the first hop from a character dossier into the provider system.",
        params: ["provider", "resource=subscribers", "phone?", "subscriber_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Viettel, MobiFone, VinaPhone.",
          "resource: required. Use subscribers to select subscriber records.",
          "phone: optional exact phone-number match.",
          "subscriber_id: optional exact subscriber id if already known.",
        ],
        sampleParams: {
          provider: "MobiFone",
          resource: "subscribers",
          phone: "0912-777-8899",
        },
        sampleRequest:
          "/api/mock/telecom?provider=MobiFone&resource=subscribers&phone=0912-777-8899",
        returns: "Subscriber profiles, including subscriber_id and sim_id.",
        responseShape: [
          "status: ok or error.",
          "provider: selected telecom provider.",
          "resource: subscribers.",
          "finding: plain-language next step.",
          "subscribers[]: provider, subscriber_id, phone, sim_id, account_name, plan, status.",
        ],
        notes: [
          "Use the character dossier to choose provider and phone.",
          "Carry sim_id into Pings, and use subscriber_id or phone for Messages.",
        ],
        evidenceKey: "telecomSubscriber",
        starterParams: { resource: "subscribers" },
        validate: (data) => {
          const subscribers = asRecord(data).subscribers;
          return Array.isArray(subscribers) &&
            subscribers.length === 1 &&
            includesAll(subscribers[0], ["Viettel", "SIM-4402", "Minh"])
            ? null
            : EVIDENCE_MISMATCH;
        },
      },
      {
        id: "telecom-pings",
        method: "GET",
        path: "/api/mock/telecom",
        label: "Tower pings",
        purpose:
          "Retrieve timestamped SIM-to-tower events. This is the raw location stream for a SIM id.",
        params: ["provider", "resource=pings", "sim_id?", "after?", "before?"],
        paramsDetail: [
          "provider: required. Supported providers: Viettel, MobiFone, VinaPhone.",
          "resource: required. Use pings to select tower events.",
          "sim_id: optional exact SIM id from Subscribers.",
          "after: optional ISO timestamp lower bound applied to ts_local.",
          "before: optional ISO timestamp upper bound applied to ts_local.",
        ],
        sampleParams: {
          provider: "MobiFone",
          resource: "pings",
          sim_id: "SIM-0912777889",
          after: "2026-03-17T19:00:00+07:00",
        },
        sampleRequest:
          "/api/mock/telecom?provider=MobiFone&resource=pings&sim_id=SIM-0912777889&after=2026-03-17T19%3A00%3A00%2B07%3A00",
        returns: "Timestamped tower pings for a SIM.",
        responseShape: [
          "status: ok or error.",
          "provider: selected telecom provider.",
          "resource: pings.",
          "finding: plain-language location implication.",
          "latest_tower_location_id: last returned tower location id.",
          "pings[]: provider, sim_id, tower_location_id, ts_local, signal_dbm.",
          "_meta.resources: sibling telecom resources available.",
        ],
        notes: [
          "Carry tower_location_id into Maps.",
          "Use a time window when you know the night you care about.",
        ],
        evidenceKey: "telecomPing",
        starterParams: { resource: "pings" },
        validate: (data) => {
          const pings = asRecord(data).pings;
          return Array.isArray(pings) &&
            pings.length > 0 &&
            pings.every((ping) => asRecord(ping).sim_id === "SIM-4402") &&
            includesAll(data, ["Viettel", "23:40", "VT-D2-047"])
            ? null
            : EVIDENCE_MISMATCH;
        },
      },
      {
        id: "telecom-messages",
        method: "GET",
        path: "/api/mock/telecom",
        label: "Messages",
        purpose:
          "Retrieve SMS metadata and short snippets. This surface can point back to another provider without exposing full private content.",
        params: [
          "provider",
          "resource=messages",
          "phone?",
          "subscriber_id?",
          "after?",
          "before?",
        ],
        paramsDetail: [
          "provider: required. Supported providers: Viettel, MobiFone, VinaPhone.",
          "resource: required. Use messages to select SMS metadata.",
          "phone: optional exact phone-number match.",
          "subscriber_id: optional exact subscriber id from Subscribers.",
          "after: optional ISO timestamp lower bound applied to ts_local.",
          "before: optional ISO timestamp upper bound applied to ts_local.",
        ],
        sampleParams: {
          provider: "MobiFone",
          resource: "messages",
          phone: "0912-777-8899",
        },
        sampleRequest:
          "/api/mock/telecom?provider=MobiFone&resource=messages&phone=0912-777-8899",
        returns: "SMS metadata and privacy-preserving snippets.",
        responseShape: [
          "status: ok or error.",
          "provider: selected telecom provider.",
          "resource: messages.",
          "finding: plain-language corroboration.",
          "messages[]: provider, subscriber_id, phone, message_id, direction, from, to, ts_local, snippet.",
        ],
        notes: [
          "Message metadata is a breadcrumb layer. It should nudge another provider query, not replace the location chain.",
          "Use subscriber_id or phone from Subscribers to avoid reading unrelated messages.",
        ],
        evidenceKey: "telecomMessage",
        starterParams: { resource: "messages" },
        validate: (data) => {
          const messages = asRecord(data).messages;
          return Array.isArray(messages) &&
            messages.length > 0 &&
            includesAll(data, ["Viettel", "GRAB", "Thao Dien"])
            ? null
            : EVIDENCE_MISMATCH;
        },
      },
    ],
  },
  {
    id: "maps",
    label: "Maps",
    description:
      "Distance service for comparing two known tower ids or location ids.",
    providers: ["VMap", "Google Maps", "Here"],
    endpoints: [
      {
        id: "maps-locations",
        method: "GET",
        path: "/api/mock/maps",
        label: "Locations",
        purpose:
          "List known location ids by provider, district, or exact id. Use this when another service gives a tower id or location hint.",
        params: ["provider", "resource=locations", "location_id?", "district?"],
        paramsDetail: [
          "provider: required. Supported providers: VMap, Google Maps, Here.",
          "resource: required. Use locations to list known ids.",
          "location_id: optional exact location id.",
          "district: optional district text filter.",
        ],
        sampleParams: { provider: "VMap", resource: "locations", district: "District 1" },
        sampleRequest: "/api/mock/maps?provider=VMap&resource=locations&district=District%201",
        returns: "Known location ids and coordinates.",
        responseShape: [
          "status: ok or error.",
          "locations[]: provider, location_id, alias, label, district, lat, lng.",
        ],
        notes: [
          "Location ids are the inputs for distance checks.",
          "Tower ids from Telecom are also valid map location ids when the provider supports them.",
        ],
        starterParams: { resource: "locations" },
      },
      {
        id: "maps-geocode",
        method: "GET",
        path: "/api/mock/maps",
        label: "Geocode",
        purpose:
          "Convert an address or district phrase into provider-specific location ids.",
        params: ["provider", "resource=geocode", "query"],
        paramsDetail: [
          "provider: required. Supported providers: VMap, Google Maps, Here.",
          "resource: required. Use geocode to search address text.",
          "query: required address, alias, or district text.",
        ],
        sampleParams: { provider: "VMap", resource: "geocode", query: "Oracle Labs" },
        sampleRequest: "/api/mock/maps?provider=VMap&resource=geocode&query=Oracle%20Labs",
        returns: "Matching location ids and coordinates.",
        responseShape: [
          "status: ok or error.",
          "query: normalized search query.",
          "finding: plain-language map interpretation.",
          "matches[]: provider, location_id, alias, label, district, lat, lng.",
        ],
        notes: [
          "Use geocode when you have a human address from ride data.",
          "Carry the returned location_id into distance.",
        ],
        evidenceKey: "mapsGeocode",
        starterParams: { resource: "geocode" },
        validate: (data) => {
          const matches = asRecord(data).matches;
          return Array.isArray(matches) &&
            matches.length > 0 &&
            includesAll(data, ["VMap", "LOC-THAODIEN-15LTT", "Thảo Điền"])
            ? null
            : EVIDENCE_MISMATCH;
        },
      },
      {
        id: "maps-distance",
        method: "GET",
        path: "/api/mock/maps",
        label: "Distance",
        purpose:
          "Compare two known location or tower ids and return distance plus a coarse feasibility note.",
        params: ["provider", "resource=distance", "from", "to"],
        paramsDetail: [
          "provider: required. Supported providers: VMap, Google Maps, Here.",
          "resource: required. Use distance to compare ids.",
          "from: required known location id.",
          "to: required known location id.",
        ],
        sampleParams: { provider: "VMap", resource: "distance", from: "VT-D1-012", to: "VT-D2-047" },
        sampleRequest: "/api/mock/maps?provider=VMap&resource=distance&from=VT-D1-012&to=VT-D2-047",
        returns: "Distance and a coarse feasibility note.",
        responseShape: [
          "status: ok or error.",
          "summary: plain-language map comparison.",
          "from: label, lat, lng.",
          "to: label, lat, lng.",
          "distance_km: rounded distance.",
          "finding: coarse movement-feasibility text.",
        ],
        notes: [
          "This service needs ids gathered from other services. It does not search names.",
          "Use it to test whether two timestamped location claims can both be true.",
        ],
        evidenceKey: "mapsDistance",
        starterParams: { resource: "distance" },
        validate: (data) =>
          includesAll(data, ["VMap", "6.4", "distinct"])
            ? null
            : EVIDENCE_MISMATCH,
      },
    ],
  },
  {
    id: "airline",
    label: "Airline GDS",
    description:
      "Paginated flight manifest service. A page field changes which passenger slice returns.",
    providers: ["Vietnam Airlines", "Vietjet", "Bamboo Airways"],
    endpoints: [
      {
        id: "airline-flights",
        method: "GET",
        path: "/api/mock/airline",
        label: "Flights",
        purpose:
          "Search scheduled flights by provider, date, and route before reading a manifest.",
        params: ["provider", "resource=flights", "date?", "route?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietnam Airlines, Vietjet, Bamboo Airways.",
          "resource: required. Use flights to list flights.",
          "date: optional YYYY-MM-DD investigation date. Searches include that date plus departures through 06:30 the next morning.",
          "route: optional route string such as SGN -> SIN.",
        ],
        sampleParams: { provider: "Vietnam Airlines", resource: "flights", date: "2026-03-17" },
        sampleRequest: "/api/mock/airline?provider=Vietnam%20Airlines&resource=flights&date=2026-03-17",
        returns: "Flight records and flight ids.",
        responseShape: [
          "status: ok or error.",
          "flights[]: provider, flight_id, flight, date, route, depart, status.",
        ],
        notes: [
          "Use the incident date from the case file first; the API handles overnight departures.",
          "Carry flight_id into manifest, seatmap, and booking checks.",
          "Provider preference comes from the suspect dossier.",
        ],
        evidenceKey: "airlineFlights",
        starterParams: { resource: "flights" },
        validate: (data) =>
          includesAll(data, ["Vietnam Airlines", "VN402-20260318", "06:00"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "airline-manifest",
        method: "GET",
        path: "/api/mock/airline",
        label: "Manifest",
        purpose:
          "Read a paginated passenger manifest for a specific early flight. Pagination metadata indicates whether more records exist.",
        params: ["provider", "resource=manifest", "flight_id?", "page?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietnam Airlines, Vietjet, Bamboo Airways.",
          "resource: required. Use manifest to list passengers.",
          "flight_id: optional flight id from Flights.",
          "page: optional positive integer. Defaults to 1.",
        ],
        sampleParams: { provider: "Vietjet", resource: "manifest", page: "1" },
        sampleRequest: "/api/mock/airline?provider=Vietjet&resource=manifest&page=1",
        returns: "Passenger manifest page plus pagination metadata.",
        responseShape: [
          "status: ok or error.",
          "flight, date, route, departure.",
          "passengers[]: seat, passenger, passport, flight, depart, dest, booking_ref, payment_method.",
          "_pagination: page, per_page, total, total_pages, has_next.",
        ],
        notes: [
          "Do not assume page 1 is complete. Follow _pagination.has_next and total_pages.",
          "The payment_method field may point to another external system.",
        ],
        evidenceKey: "airlineManifest",
        starterParams: { resource: "manifest" },
        validate: (data) =>
          includesAll(data, ["Vietnam Airlines", "5B", "OFFSHORE WIRE"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "airline-booking",
        method: "GET",
        path: "/api/mock/airline",
        label: "Booking",
        purpose:
          "Inspect booking detail for a booking reference found in the manifest.",
        params: ["provider", "resource=booking", "booking_ref?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietnam Airlines, Vietjet, Bamboo Airways.",
          "resource: required. Use booking for booking records.",
          "booking_ref: optional exact booking reference.",
        ],
        sampleParams: { provider: "Vietnam Airlines", resource: "booking", booking_ref: "BK-009" },
        sampleRequest: "/api/mock/airline?provider=Vietnam%20Airlines&resource=booking&booking_ref=BK-009",
        returns: "Booking detail, payment reference, and notes.",
        responseShape: [
          "status: ok or error.",
          "bookings[]: provider, booking_ref, flight_id, seat, passenger, payment_method, payment_ref, notes.",
        ],
        notes: [
          "Booking detail bridges the manifest to Banking.",
          "A nameless booking can still have a payment reference.",
        ],
        evidenceKey: "airlineBooking",
        starterParams: { resource: "booking" },
        validate: (data) =>
          includesAll(data, ["BK-010", "OFFSHORE WIRE", "SW-20260317-004"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "airline-seatmap",
        method: "GET",
        path: "/api/mock/airline",
        label: "Seatmap",
        purpose:
          "Check whether a seat is assigned, blocked, or reserved.",
        params: ["provider", "resource=seatmap", "flight_id?", "seat?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietnam Airlines, Vietjet, Bamboo Airways.",
          "resource: required. Use seatmap for seat status.",
          "flight_id: optional flight id.",
          "seat: optional exact seat.",
        ],
        sampleParams: { provider: "Vietnam Airlines", resource: "seatmap", flight_id: "VN402-20260318", seat: "5A" },
        sampleRequest: "/api/mock/airline?provider=Vietnam%20Airlines&resource=seatmap&flight_id=VN402-20260318&seat=5A",
        returns: "Seat status records.",
        responseShape: [
          "status: ok or error.",
          "seats[]: provider, flight_id, seat, status, booking_ref.",
        ],
        notes: [
          "Seat status corroborates the manifest anomaly.",
          "Use the booking_ref with the Booking endpoint.",
        ],
        evidenceKey: "airlineSeatmap",
        starterParams: { resource: "seatmap" },
        validate: (data) =>
          includesAll(data, ["5B", "reserved-payment-hold", "BK-010"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "airline-checkin",
        method: "GET",
        path: "/api/mock/airline",
        label: "Check-in",
        purpose:
          "Inspect check-in status and gate data for a booking reference.",
        params: ["provider", "resource=checkin", "booking_ref?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietnam Airlines, Vietjet, Bamboo Airways.",
          "resource: required. Use checkin for gate and check-in status.",
          "booking_ref: optional exact booking reference.",
        ],
        sampleParams: { provider: "Vietnam Airlines", resource: "checkin", booking_ref: "BK-009" },
        sampleRequest: "/api/mock/airline?provider=Vietnam%20Airlines&resource=checkin&booking_ref=BK-009",
        returns: "Check-in status, gate, and closing time.",
        responseShape: [
          "status: ok or error.",
          "checkins[]: provider, booking_ref, flight_id, seat, checkin_status, gate, closes_at.",
        ],
        notes: [
          "Gate data feeds the final case resolution later.",
          "Check-in status can be actionable even before the passenger appears.",
        ],
        evidenceKey: "airlineCheckin",
        starterParams: { resource: "checkin" },
        validate: (data) =>
          includesAll(data, ["BK-010", "gate", "17"])
            ? null
            : EVIDENCE_MISMATCH,
      },
    ],
  },
  {
    id: "banking",
    label: "Banking",
    description:
      "Wire-transfer trace service. It can filter by account, sender, or counterparty text.",
    providers: ["Vietcombank", "Cayman NatWest", "ACB"],
    endpoints: [
      {
        id: "banking-accounts",
        method: "GET",
        path: "/api/mock/banking",
        label: "Accounts",
        purpose:
          "Search account records before tracing wires. Account ids are stronger inputs than names.",
        params: ["provider", "resource=accounts", "query?", "account_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietcombank, Cayman NatWest, ACB.",
          "resource: required. Use accounts for account records.",
          "query: optional account/name text search.",
          "account_id: optional exact account id.",
        ],
        sampleParams: { provider: "Vietcombank", resource: "accounts", query: "Andy" },
        sampleRequest: "/api/mock/banking?provider=Vietcombank&resource=accounts&query=Andy",
        returns: "Account identity and risk metadata.",
        responseShape: [
          "status: ok or error.",
          "accounts[]: provider, account_id, account_name, jurisdiction, account_type, risk_flag.",
        ],
        notes: [
          "Use account ids with Wires and Transaction.",
          "Different providers can hold different sides of a transfer.",
        ],
        evidenceKey: "bankingAccounts",
        starterParams: { resource: "accounts" },
        validate: (data) =>
          includesAll(data, ["Cayman NatWest", "CAYMAN-NW-77291", "Horizon Pacific"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "banking-wires",
        method: "GET",
        path: "/api/mock/banking",
        label: "Wires",
        purpose:
          "Search SWIFT-style transfer records by counterparty text, account fragment, or sender/recipient string.",
        params: ["provider", "resource=wires", "counterparty?", "account_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietcombank, Cayman NatWest, ACB.",
          "resource: required. Use wires for transaction lists.",
          "counterparty: optional case-insensitive text filter applied to account ids and recipient names.",
          "account_id: optional exact sender or recipient account id.",
        ],
        sampleParams: { provider: "Vietcombank", resource: "wires", counterparty: "CAYMAN" },
        sampleRequest: "/api/mock/banking?provider=Vietcombank&resource=wires&counterparty=CAYMAN",
        returns: "SWIFT transaction records and account metadata.",
        responseShape: [
          "status: ok or error.",
          "transactions[]: tx_id, sender_account, sender_name, recipient_account, recipient_name, amount_usd, ts, swift_code, memo, status.",
          "_meta.total: number of matching transfers.",
          "_meta.query: the counterparty query you sent.",
          "_meta.flag: account-pattern note.",
        ],
        notes: [
          "The strongest evidence comes from a scoped counterparty search, not a full transaction dump.",
          "Look for repeated counterparties across unrelated senders.",
        ],
        evidenceKey: "bankingWires",
        starterParams: { resource: "wires" },
        validate: (data) =>
          includesAll(data, ["Horizon Pacific Consulting", "Andy", "Phúc"]) &&
          includesAll(data, ["Cayman NatWest", "query", "Horizon"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "banking-transaction",
        method: "GET",
        path: "/api/mock/banking",
        label: "Transaction",
        purpose:
          "Open one SWIFT transaction by tx_id to inspect its memo, amount, and direction.",
        params: ["provider", "resource=transaction", "tx_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Vietcombank, Cayman NatWest, ACB.",
          "resource: required. Use transaction for individual transaction detail.",
          "tx_id: optional exact transaction id from Wires.",
        ],
        sampleParams: { provider: "Cayman NatWest", resource: "transaction", tx_id: "SW-20260310-005" },
        sampleRequest: "/api/mock/banking?provider=Cayman%20NatWest&resource=transaction&tx_id=SW-20260310-005",
        returns: "Full transaction record for a selected tx_id.",
        responseShape: [
          "status: ok or error.",
          "transactions[]: tx_id, sender_account, sender_name, recipient_account, recipient_name, amount_usd, ts, memo.",
        ],
        notes: [
          "Use the airline payment_ref as a tx_id when the manifest points to a wire.",
          "Individual detail is cleaner evidence than a broad list.",
        ],
        evidenceKey: "bankingTransaction",
        starterParams: { resource: "transaction" },
        validate: (data) =>
          includesAll(data, ["SW-20260317-004", "seat reservation", "Horizon Pacific"])
            ? null
            : EVIDENCE_MISMATCH,
      },
    ],
  },
  {
    id: "mail",
    label: "Mail",
    description:
      "Mailbox search service. Folders are explicit resources, delivered mail is only one folder.",
    providers: ["Oracle Mail", "Google Workspace", "Outlook"],
    endpoints: [
      {
        id: "mail-folders",
        method: "GET",
        path: "/api/mock/mail",
        label: "Folders",
        purpose:
          "List mailbox folders. The useful message may not be in delivered inbox mail.",
        params: ["provider", "resource=folders"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Mail, Google Workspace, Outlook.",
          "resource: required. Use folders to list mailbox folders.",
        ],
        sampleParams: { provider: "Google Workspace", resource: "folders" },
        sampleRequest: "/api/mock/mail?provider=Google%20Workspace&resource=folders",
        returns: "Available folder names.",
        responseShape: [
          "status: ok or error.",
          "folders[]: folder names.",
        ],
        notes: [
          "Folder enumeration is the bridge from inbox-only thinking to full mailbox search.",
        ],
        evidenceKey: "mailFolders",
        starterParams: { resource: "folders" },
        validate: (data) =>
          includesAll(data, ["Oracle Mail", "drafts", "flagged"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "mail-messages",
        method: "GET",
        path: "/api/mock/mail",
        label: "Folder messages",
        purpose:
          "Read explicit mailbox folders. Draft and flagged folders are separate from delivered inbox mail.",
        params: ["provider", "resource=messages", "folder"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Mail, Google Workspace, Outlook.",
          "resource: required. Use messages to list folder messages.",
          "folder: required folder name. Supported folders: inbox, drafts, flagged.",
        ],
        sampleParams: { provider: "Google Workspace", resource: "messages", folder: "inbox" },
        sampleRequest: "/api/mock/mail?provider=Google%20Workspace&resource=messages&folder=inbox",
        returns: "Messages in a mailbox folder.",
        responseShape: [
          "status: ok or error.",
          "folder: folder returned.",
          "messages[]: id, from, to, subject, flags, attachments, has_body, has_url.",
          "_meta.folders: supported folder list.",
        ],
        notes: [
          "Delivered mail is not the whole mailbox. Check the folder list in _meta.",
          "Unsent or scheduled records can be more revealing than inbox records.",
        ],
        evidenceKey: "mailMessages",
        starterParams: { resource: "messages" },
        validate: (data) =>
          includesAll(data, ["Oracle Mail", "DRAFT-4101", "for the one who looks"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "mail-message",
        method: "GET",
        path: "/api/mock/mail",
        label: "Message",
        purpose:
          "Open one message by id to inspect its full body and flags.",
        params: ["provider", "resource=message", "id?"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Mail, Google Workspace, Outlook.",
          "resource: required. Use message for a single message lookup.",
          "id: optional exact message id from Folder messages or Search.",
        ],
        sampleParams: { provider: "Oracle Mail", resource: "message", id: "MSG-1001" },
        sampleRequest: "/api/mock/mail?provider=Oracle%20Mail&resource=message&id=MSG-1001",
        returns: "Full message body, flags, and attachment ids.",
        responseShape: [
          "status: ok or error.",
          "messages[]: id, folder, from, to, subject, flags, body, url, attachments.",
        ],
        notes: [
          "Use message id from folders or search.",
          "Open the message before trusting a subject line.",
        ],
        evidenceKey: "mailMessage",
        starterParams: { resource: "message" },
        validate: (data) =>
          includesAll(data, ["DRAFT-4101", "https://internal.projectxvietnam.org/theia/41", "scheduled"])
            ? null
            : EVIDENCE_MISMATCH,
      },
      {
        id: "mail-attachments",
        method: "GET",
        path: "/api/mock/mail",
        label: "Attachments",
        purpose:
          "List attachment metadata and previews for one message. Use this when a folder message includes attachment ids.",
        params: ["provider", "resource=attachments", "message_id?"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Mail, Google Workspace, Outlook.",
          "resource: required. Use attachments for message attachment records.",
          "message_id: optional exact message id from Folder messages or Message.",
        ],
        sampleParams: { provider: "Oracle Mail", resource: "attachments", message_id: "MSG-1001" },
        sampleRequest: "/api/mock/mail?provider=Oracle%20Mail&resource=attachments&message_id=MSG-1001",
        returns: "Attachment metadata and short previews.",
        responseShape: [
          "status: ok or error.",
          "attachments[]: provider, message_id, attachment_id, filename, mime, sha256, preview.",
        ],
        notes: [
          "Folder messages can reveal attachment ids before the attachment content is inspected.",
          "Attachment previews are enough for lightweight audit exports.",
        ],
        evidenceKey: "mailAttachment",
        starterParams: { resource: "attachments" },
        validate: (data) =>
          includesAll(data, ["ATT-1001", "badge-audit.csv", "Bảo Nguyễn", "BADGE_CLONE_AUTHORIZED", "B-1002"])
            ? null
            : EVIDENCE_MISMATCH,
      },
    ],
  },
  {
    id: "archive",
    label: "Public Archive",
    description:
      "A public web page, not a JSON API. Inspect the returned text like an OSINT scrape.",
    providers: ["Oracle Press Archive", "City Business Registry", "Launch Mirror"],
    endpoints: [
      {
        id: "archive-sources",
        method: "GET",
        path: "/api/mock/archive",
        label: "Sources",
        purpose:
          "List metadata for a public archive provider before searching pages.",
        params: ["provider", "resource=sources"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Press Archive, City Business Registry, Launch Mirror.",
          "resource: required. Use sources for archive source metadata.",
        ],
        sampleParams: { provider: "Oracle Press Archive", resource: "sources" },
        sampleRequest: "/api/mock/archive?provider=Oracle%20Press%20Archive&resource=sources",
        returns: "Archive source metadata.",
        responseShape: [
          "status: ok or error.",
          "sources[]: provider, source_id, label, coverage.",
        ],
        notes: [
          "Provider choice comes from character dossiers and archive coverage.",
        ],
        starterParams: { resource: "sources" },
      },
      {
        id: "archive-search",
        method: "GET",
        path: "/api/mock/archive",
        label: "Search",
        purpose:
          "Search archive page metadata by known people, organizations, or profile terms.",
        params: ["provider", "resource=search", "query?"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Press Archive, City Business Registry, Launch Mirror.",
          "resource: required. Use search to find archive pages.",
          "query: optional person-name search. Use the name of the person you want to know more about.",
        ],
        sampleParams: { provider: "City Business Registry", resource: "search", query: "Kai" },
        sampleRequest: "/api/mock/archive?provider=City%20Business%20Registry&resource=search&query=Kai",
        returns: "Archive page search results.",
        responseShape: [
          "status: ok or error.",
          "results[]: provider, page_id, slug, title, summary.",
        ],
        notes: [
          "Search gives page ids and slugs. Open the Page endpoint to inspect the URL and page text.",
          "The query should be a person's name.",
        ],
        starterParams: { resource: "search" },
      },
      {
        id: "archive-page",
        method: "GET",
        path: "/api/mock/archive",
        label: "Page",
        purpose:
          "Resolve archive page metadata by page id or slug, including the public URL to inspect.",
        params: ["provider", "resource=page", "page_id?", "slug?"],
        paramsDetail: [
          "provider: required. Supported providers: Oracle Press Archive, City Business Registry, Launch Mirror.",
          "resource: required. Use page for page metadata.",
          "page_id: optional exact page id from Search.",
          "slug: optional exact slug.",
        ],
        sampleParams: { provider: "City Business Registry", resource: "page", slug: "kai-profile" },
        sampleRequest: "/api/mock/archive?provider=City%20Business%20Registry&resource=page&slug=kai-profile",
        returns: "Page metadata, public URL, and cached page text.",
        responseShape: [
          "status: ok or error.",
          "pages[]: provider, page_id, slug, title, url, summary, body.",
        ],
        notes: [
          "This is the inspection step. Capture the evidence after the page text is returned.",
          "Use the public URL if you want to inspect the raw HTML page.",
        ],
        evidenceKey: "archivePage",
        starterParams: { resource: "page" },
        validate: (data) =>
          includesAll(data, [
            "PAGE-KAI-PROFILE",
            "/archive/kai-profile",
            "Đặng Vũ Khoa",
            "brother",
            "1993-03-17",
          ])
            ? null
            : EVIDENCE_MISMATCH,
      },
    ],
  },
];

export function buildM2CopyContext() {
  return [
    "Milestone 2 workspace: City external systems",
    "Investigators have read access to external provider systems under city police authorization.",
    "",
    "Case-note scopes:",
    ...CASE_NOTE_REQUIREMENTS.map(
      (requirement, index) =>
        `${index + 1}. ${requirement.scope}: ${requirement.title}. ${requirement.description}`
    ),
    "",
    "Service documentation:",
    ...SERVICES.flatMap((service) => [
      "",
      `${service.label}`,
      `Description: ${service.description}`,
      `Providers: ${service.providers.join(", ")}`,
      ...service.endpoints.flatMap((endpoint) => [
        "",
        `Endpoint: ${endpoint.label}`,
        `Method/path: ${endpoint.method} ${endpoint.path}`,
        `Params: ${endpoint.params.join(", ")}`,
        `Returns: ${endpoint.returns}`,
        `Response shape: ${endpoint.responseShape.join(" ")}`,
      ]),
    ]),
  ]
    .filter(Boolean)
    .join("\n");
}

function makeInitialWorkbench(): Record<string, WorkbenchState> {
  return Object.fromEntries(
    SERVICES.map((service) => {
      const first = service.endpoints[0];
      return [
        service.id,
        {
          endpointId: "",
          paramsText: JSON.stringify(first.starterParams ?? {}, null, 2),
          result: null,
          status: "idle" as const,
          message: null,
        },
      ];
    })
  );
}

function m2DraftKey(teamName?: string) {
  const scopedTeam = (teamName ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `theia:m2-draft:v${DRAFT_VERSION}:${scopedTeam || "team"}`;
}

function isServiceId(value: string | null) {
  return Boolean(value && SERVICES.some((service) => service.id === value));
}

function mergeEvidence(saved?: Partial<EvidenceState>) {
  const next = { ...INITIAL_EVIDENCE };
  if (!saved || typeof saved !== "object") return next;

  for (const key of Object.keys(next) as EvidenceKey[]) {
    next[key] = Boolean(saved[key]);
  }

  return next;
}

function mergeWorkbench(
  saved?: Record<string, Partial<WorkbenchState>>
): Record<string, WorkbenchState> {
  const initial = makeInitialWorkbench();
  if (!saved || typeof saved !== "object") return initial;

  return SERVICES.reduce<Record<string, WorkbenchState>>((acc, service) => {
      const base = initial[service.id];
      const draft = saved[service.id];
      const endpointId =
        typeof draft?.endpointId === "string" &&
        endpointFor(service, draft.endpointId)
          ? draft.endpointId
          : base.endpointId;

      acc[service.id] = {
        endpointId,
        paramsText:
          typeof draft?.paramsText === "string" ? draft.paramsText : base.paramsText,
        result: "result" in (draft ?? {}) ? draft?.result ?? null : base.result,
        status:
          draft?.status === "success" || draft?.status === "error"
            ? draft.status
            : "idle",
        message: typeof draft?.message === "string" ? draft.message : null,
      };

      return acc;
    }, {});
}

function endpointFor(service: ServiceDoc, endpointId: string) {
  return service.endpoints.find((endpoint) => endpoint.id === endpointId) ?? null;
}

function docKey(service: ServiceDoc, endpoint: EndpointDoc) {
  return `${service.id}:${endpoint.id}`;
}

function splitDocLine(line: string) {
  const index = line.indexOf(":");
  if (index === -1) {
    return { label: null, detail: line };
  }

  return {
    label: line.slice(0, index).trim(),
    detail: line.slice(index + 1).trim(),
  };
}

function paramsToQuery(paramsText: string) {
  const params = JSON.parse(paramsText || "{}") as Record<string, unknown>;
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

function buildM2EvidencePayload() {
  return JSON.stringify({
    minhCleared: true,
    badgeWasCloned: true,
    badgeCloneSuspect: "Bảo",
    placeToken: "ThaoDien",
    landmarkToken: "Bitexco",
    kaiLegalName: "Đặng Vũ Khoa",
    kaiBirthdate: "19930317",
    flight0600: "VN402-5B-0600",
    offshoreWire: "Horizon Pacific Consulting",
    dashboardLink: "https://internal.projectxvietnam.org/theia/41",
    twinSeed: "Kai had a brother",
  });
}

export function M2Puzzle({ onSolve, teamName }: Props) {
  const [workbench, setWorkbench] = useState<Record<string, WorkbenchState>>(
    makeInitialWorkbench
  );
  const [evidence, setEvidence] = useState<EvidenceState>(INITIAL_EVIDENCE);
  const [docsServiceId, setDocsServiceId] = useState<string | null>(null);
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const draftKey = useMemo(() => m2DraftKey(teamName), [teamName]);
  const complete = useMemo(
    () =>
      CASE_NOTE_REQUIREMENTS.every((requirement) =>
        requirement.evidenceKeys.every((key) => evidence[key])
      ),
    [evidence]
  );
  const completedRequirementCount = useMemo(
    () =>
      CASE_NOTE_REQUIREMENTS.filter((requirement) =>
        requirement.evidenceKeys.every((key) => evidence[key])
      ).length,
    [evidence]
  );
  const missingRequirementCount =
    CASE_NOTE_REQUIREMENTS.length - completedRequirementCount;
  const docsService = useMemo(
    () => SERVICES.find((service) => service.id === docsServiceId) ?? null,
    [docsServiceId]
  );

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(draftKey);
      if (!rawDraft) return;

      const draft = JSON.parse(rawDraft) as Partial<M2Draft>;
      if (draft.version !== DRAFT_VERSION) return;

      setWorkbench(mergeWorkbench(draft.workbench));
      setEvidence(mergeEvidence(draft.evidence));
      setDocsServiceId(isServiceId(draft.docsServiceId ?? null) ? draft.docsServiceId! : null);
      setExpandedDocs(
        draft.expandedDocs && typeof draft.expandedDocs === "object"
          ? draft.expandedDocs
          : {}
      );
    } catch {
      window.localStorage.removeItem(draftKey);
    } finally {
      setDraftLoaded(true);
    }
  }, [draftKey]);

  useEffect(() => {
    if (!draftLoaded) return;

    const draft: M2Draft = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      evidence,
      workbench,
      docsServiceId,
      expandedDocs,
    };

    try {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      // Ignore storage quota/private-mode failures; the puzzle should still work.
    }
  }, [docsServiceId, draftKey, draftLoaded, evidence, expandedDocs, workbench]);

  function updateService(serviceId: string, patch: Partial<WorkbenchState>) {
    setWorkbench((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], ...patch },
    }));
  }

  function chooseEndpoint(service: ServiceDoc, endpointId: string) {
    const endpoint = endpointFor(service, endpointId);
    updateService(service.id, {
      endpointId,
      paramsText: JSON.stringify(endpoint?.starterParams ?? {}, null, 2),
      result: null,
      status: "idle",
      message: null,
    });
  }

  function openDocs(service: ServiceDoc) {
    const first = service.endpoints[0];
    setDocsServiceId(service.id);
    setExpandedDocs((prev) => ({
      ...prev,
      [docKey(service, first)]: prev[docKey(service, first)] ?? true,
    }));
  }

  function toggleDoc(service: ServiceDoc, endpoint: EndpointDoc) {
    const key = docKey(service, endpoint);
    setExpandedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function runEndpoint(service: ServiceDoc) {
    const state = workbench[service.id];
    const endpoint = endpointFor(service, state.endpointId);

    if (!endpoint) {
      updateService(service.id, {
        status: "error",
        message: "Choose an endpoint from the service docs first.",
      });
      return;
    }

    updateService(service.id, { status: "running", message: null });

    try {
      const url = `${endpoint.path}${paramsToQuery(state.paramsText)}`;
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        updateService(service.id, {
          status: "error",
          result: data,
          message: "The service rejected this request. Check required params.",
        });
        return;
      }

      const validationMessage = endpoint.validate?.(data) ?? null;
      if (validationMessage) {
        updateService(service.id, {
          status: "idle",
          result: data,
          message: null,
        });
        return;
      }

      if (endpoint.evidenceKey) {
        setEvidence((prev) => ({ ...prev, [endpoint.evidenceKey!]: true }));
      }

      const capturedEvidence = Boolean(endpoint.evidenceKey);
      updateService(service.id, {
        status: capturedEvidence ? "success" : "idle",
        result: data,
        message: capturedEvidence
          ? "Evidence captured. Keep the returned identifiers in your notes."
          : null,
      });
    } catch (error) {
      updateService(service.id, {
        status: "error",
        result: null,
        message:
          error instanceof Error
            ? error.message
            : "Request failed. Check your params JSON.",
      });
    }
  }

  async function submitEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!complete || submitting) return;

    setSubmitting(true);
    try {
      await onSolve(buildM2EvidencePayload());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg border border-warm-accent/15 bg-warm-accent/5 text-sm text-warm-text space-y-2">
        <p className="font-heading text-xs text-warm-accent uppercase tracking-wider">
          City external systems
        </p>
        <p>
          As investigators working with city police authorization, you have
          read access to external provider systems. Use case-brief details to
          choose providers, endpoints, and request params.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = SERVICE_ICONS[service.id];
          return (
            <div
              key={service.id}
              className="rounded-lg border border-warm-border bg-warm-surface px-3 py-3"
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-warm-accent shrink-0" aria-hidden="true" />}
                <p className="font-heading text-sm text-warm-heading">
                  {service.label}
                </p>
              </div>
              <p className="mt-1 text-xs leading-5 text-warm-text-muted">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-5">
        {SERVICES.map((service) => {
          const state = workbench[service.id];
          const selected = endpointFor(service, state.endpointId);
          const Icon = SERVICE_ICONS[service.id];

          return (
            <section
              key={service.id}
              className="rounded-xl border border-warm-border bg-warm-surface"
            >
              <div className="px-4 py-3 border-b border-warm-border/60 flex items-start justify-between gap-4 rounded-t-xl">
                <div>
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-warm-accent shrink-0" aria-hidden="true" />}
                    <p className="font-heading text-sm text-warm-heading">
                      {service.label}
                    </p>
                  </div>
                  <p className="text-xs text-warm-text-muted mt-1">
                    {service.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] text-warm-text-muted">
                    {state.status === "success"
                      ? "Captured"
                      : state.status === "error"
                        ? "Inspect"
                        : "Open"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openDocs(service)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-warm-border bg-warm-bg px-2.5 py-1.5 text-[11px] font-medium text-warm-text-muted transition-colors hover:bg-warm-surface-dark hover:text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-accent/25"
                    aria-label={`Open ${service.label} documents`}
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Docs
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid gap-3 lg:grid-cols-[minmax(220px,320px)_1fr] lg:items-start">
                  <div>
                  <label className="block text-[11px] uppercase tracking-wider text-warm-text-muted">
                    Endpoint
                  </label>
                  <Select
                    value={state.endpointId}
                    onChange={(val) => chooseEndpoint(service, val)}
                    placeholder="Choose endpoint..."
                    options={service.endpoints.map((endpoint) => ({
                      value: endpoint.id,
                      label: `${endpoint.method} ${endpoint.label}`,
                    }))}
                  />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-text-muted mb-1.5">
                      Params JSON
                    </label>
                    <textarea
                      value={state.paramsText}
                      onChange={(event) =>
                        updateService(service.id, {
                          paramsText: event.target.value,
                          status: "idle",
                          message: null,
                        })
                      }
                      rows={selected?.params.length ? 5 : 3}
                      spellCheck={false}
                      className="w-full px-3 py-3 rounded-lg bg-warm-code border border-warm-border text-xs text-warm-heading font-mono resize-y focus:outline-none focus:border-warm-accent/50"
                    />
                  </div>
                </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => runEndpoint(service)}
                      disabled={state.status === "running"}
                      className="px-4 py-1.5 text-xs font-semibold bg-warm-btn text-warm-bg rounded-md hover:bg-warm-btn-hover transition-colors disabled:opacity-50"
                    >
                      {state.status === "running" ? "Running..." : "Run request"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateService(service.id, {
                          result: null,
                          status: "idle",
                          message: null,
                        })
                      }
                      className="px-3 py-1.5 text-[11px] text-warm-text-muted hover:text-warm-text border border-warm-border rounded-md transition-colors"
                    >
                      Clear output
                    </button>
                  </div>

                  {state.message && (
                    <p
                      className={`text-xs ${
                        state.status === "success"
                          ? "text-warm-success"
                          : "text-warm-error"
                      }`}
                    >
                      {state.message}
                    </p>
                  )}

                  {state.result !== null && (
                    <details open className="rounded-lg bg-warm-code border border-warm-border group">
                      <summary className="px-3 py-2 text-xs font-mono text-warm-text-muted cursor-pointer select-none hover:text-warm-text transition-colors">
                        Response
                        <span className="ml-1 text-warm-text-muted/60">
                          ({JSON.stringify(state.result).length} chars)
                        </span>
                      </summary>
                      <pre className="px-3 pb-3 text-xs text-warm-text font-mono overflow-x-auto whitespace-pre-wrap">
                        {typeof state.result === "string"
                          ? state.result
                          : JSON.stringify(state.result, null, 2)}
                      </pre>
                    </details>
                  )}
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-warm-border pt-6">
        <div className="rounded-xl border border-warm-border bg-warm-surface px-4 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-heading text-[11px] uppercase tracking-wider text-warm-text-muted">
                Expected output
              </p>
              <h3 className="mt-1 font-heading text-base text-warm-heading">
                M2 external-evidence case note
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-warm-text-muted">
                Build the note from the scopes below. Each section needs one
                captured provider response that supports the claim, then the
                hidden route can be filed.
              </p>
            </div>
            <div className="rounded-lg border border-warm-border bg-warm-bg px-3 py-2 text-right">
              <p className="font-heading text-[10px] uppercase tracking-wider text-warm-text-muted">
                Case sections
              </p>
              <p className="mt-0.5 text-sm font-semibold text-warm-heading">
                {completedRequirementCount}/{CASE_NOTE_REQUIREMENTS.length} ready
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {CASE_NOTE_REQUIREMENTS.map((requirement, index) => {
              const ready = requirement.evidenceKeys.every((key) => evidence[key]);

              return (
                <div
                  key={requirement.title}
                  className={`rounded-lg border px-3.5 py-3.5 ${
                    ready
                      ? "border-warm-success/30 bg-warm-success/5"
                      : "border-warm-border bg-warm-bg"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                        ready
                          ? "border-warm-success/25 bg-warm-success/10 text-warm-success"
                          : "border-warm-border bg-warm-surface text-warm-text-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-accent">
                            {requirement.scope}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-warm-heading">
                            {requirement.title}
                          </p>
                          <p className="mt-1 max-w-xl text-xs leading-5 text-warm-text-muted">
                            {requirement.description}
                          </p>
                        </div>
                        <span
                          className={`w-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            ready
                              ? "bg-warm-success/10 text-warm-success"
                              : "bg-warm-surface-dark text-warm-text-muted"
                          }`}
                        >
                          {ready ? "Captured" : "Need evidence"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={submitEvidence}
          className="mt-4 rounded-xl border border-warm-accent/15 bg-warm-accent/5 px-4 py-3"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-[11px] uppercase tracking-wider text-warm-accent">
                {complete ? "Hidden route ready" : "Hidden route locked"}
              </p>
              <p className="mt-1 text-sm leading-6 text-warm-text-muted">
                {complete
                  ? "All case-note sections are ready. File the note to unlock the THEIA link recovered from the Mail service."
                  : `Capture the remaining ${missingRequirementCount} case-note section${
                      missingRequirementCount === 1 ? "" : "s"
                    } before filing. The Mail route stays locked until the evidence is complete.`}
              </p>
            </div>
            <button
              type="submit"
              disabled={!complete || submitting}
              className="shrink-0 rounded-lg bg-warm-btn px-6 py-3 font-semibold text-warm-bg transition-colors hover:bg-warm-btn-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Filing..." : "Submit M2 case note"}
            </button>
          </div>
        </form>
      </section>

      {docsService && (
        <div
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label={`${docsService.label} service documents`}
        >
          <button
            type="button"
            aria-label="Close documents"
            onClick={() => setDocsServiceId(null)}
            className="absolute inset-0 bg-warm-heading/25"
          />
          <aside className="absolute bottom-3 right-3 top-3 flex w-[calc(100%-1.5rem)] max-w-2xl flex-col overflow-hidden rounded-xl border border-warm-border bg-warm-bg shadow-2xl sm:bottom-4 sm:right-4 sm:top-4 sm:w-full">
            <div className="flex items-start justify-between gap-4 border-b border-warm-border bg-warm-surface px-5 py-4">
              <div>
                <p className="font-heading text-[11px] uppercase tracking-wider text-warm-text-muted">
                  Service documents
                </p>
                <h2 className="mt-1 font-heading text-lg text-warm-heading">
                  {docsService.label}
                </h2>
                <p className="mt-1 text-xs leading-5 text-warm-text-muted">
                  {docsService.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {docsService.providers.map((provider) => (
                    <span
                      key={provider}
                      className="rounded-full border border-warm-border bg-warm-bg px-2 py-0.5 text-[10px] font-medium text-warm-text-muted"
                    >
                      {provider}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDocsServiceId(null)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-warm-border bg-warm-surface text-warm-text-muted transition-colors hover:bg-warm-surface-dark hover:text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-accent/25"
                aria-label="Close documents"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-4 rounded-lg border border-warm-accent/15 bg-warm-accent/5 px-3 py-3">
                <p className="text-xs font-medium text-warm-heading">
                  Pick the endpoint, paste the JSON, run the request.
                </p>
                <p className="mt-1 text-xs leading-5 text-warm-text-muted">
                  Use each response&apos;s finding, ids, and returned fields as your evidence trail.
                </p>
              </div>

              <div className="space-y-2.5">
                {docsService.endpoints.map((endpoint) => {
                  const expanded = Boolean(
                    expandedDocs[docKey(docsService, endpoint)]
                  );

                  return (
                    <div
                      key={endpoint.id}
                      className="overflow-hidden rounded-lg border border-warm-border bg-warm-surface"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDoc(docsService, endpoint)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-warm-surface-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-warm-accent/25"
                        aria-expanded={expanded}
                      >
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="rounded-md border border-warm-border bg-warm-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-warm-accent">
                              {endpoint.method}
                            </span>
                            <span className="block text-sm font-semibold text-warm-heading">
                            {endpoint.label}
                            </span>
                          </span>
                          <span className="mt-1 block truncate font-mono text-[11px] text-warm-text-muted">
                            {endpoint.path}
                          </span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-warm-text-muted transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {expanded && (
                        <div className="border-t border-warm-border bg-warm-bg/60 px-4 py-4 text-xs leading-5 text-warm-text-muted">
                          <p className="text-sm leading-6 text-warm-text">
                            {endpoint.purpose}
                          </p>

                          <div className="mt-4 space-y-3">
                            {endpoint.paramsDetail.length > 0 && (
                              <div>
                                <p className="mb-1.5 font-heading text-[10px] uppercase tracking-wider text-warm-text-faint">
                                  Parameters
                                </p>
                                <table className="w-full text-xs">
                                  <tbody>
                                    {endpoint.paramsDetail.map((param) => {
                                      const parsed = splitDocLine(param);
                                      return (
                                        <tr key={param} className="border-b border-warm-border/50 last:border-b-0">
                                          <td className="whitespace-nowrap py-1.5 pr-3 align-top font-mono text-[11px] font-semibold text-warm-heading">
                                            {parsed.label ?? "note"}
                                          </td>
                                          <td className="py-1.5 text-warm-text-muted">
                                            {parsed.detail}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            <div>
                              <p className="mb-1.5 font-heading text-[10px] uppercase tracking-wider text-warm-text-faint">
                                Try it
                              </p>
                              <pre className="overflow-x-auto rounded-lg bg-warm-code px-3 py-2.5 font-mono text-[11px] leading-5 text-warm-heading">
                                {endpoint.sampleRequest}
                              </pre>
                            </div>

                            <details className="group">
                              <summary className="cursor-pointer select-none text-[11px] font-medium text-warm-accent hover:text-warm-heading transition-colors">
                                Sample params JSON
                              </summary>
                              <pre className="mt-1.5 overflow-x-auto rounded-lg bg-warm-code px-3 py-2.5 font-mono text-[11px] leading-5 text-warm-heading">
                                {JSON.stringify(endpoint.sampleParams, null, 2)}
                              </pre>
                            </details>

                            <details className="group">
                              <summary className="cursor-pointer select-none text-[11px] font-medium text-warm-accent hover:text-warm-heading transition-colors">
                                Response shape
                              </summary>
                              <div className="mt-1.5">
                                <table className="w-full text-xs">
                                  <tbody>
                                    {endpoint.responseShape.map((field) => {
                                      const parsed = splitDocLine(field);
                                      return (
                                        <tr key={field} className="border-b border-warm-border/50 last:border-b-0">
                                          <td className="whitespace-nowrap py-1.5 pr-3 align-top font-mono text-[11px] font-semibold text-warm-heading">
                                            {parsed.label ?? "field"}
                                          </td>
                                          <td className="py-1.5 text-warm-text-muted">
                                            {parsed.detail}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </details>

                            {endpoint.notes.length > 0 && (
                              <details className="group">
                                <summary className="cursor-pointer select-none text-[11px] font-medium text-warm-accent hover:text-warm-heading transition-colors">
                                  Tips
                                </summary>
                                <ul className="mt-1.5 space-y-1">
                                  {endpoint.notes.map((note) => (
                                    <li key={note} className="flex gap-2">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warm-accent/60" />
                                      <span className="text-warm-text-muted">{note}</span>
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
