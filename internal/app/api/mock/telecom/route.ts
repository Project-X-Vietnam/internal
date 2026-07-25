import { NextRequest, NextResponse } from "next/server";

const PROVIDERS = ["Viettel", "MobiFone", "VinaPhone"];

const TOWERS = [
  {
    provider: "Viettel",
    tower_id: "VT-D1-012",
    location: "District 1, near Bitexco Financial Tower",
    district: "District 1",
    lat: 10.7769,
    lng: 106.7009,
    coverage_radius_m: 420,
  },
  {
    provider: "Viettel",
    tower_id: "VT-D2-047",
    location: "Thảo Điền, District 2",
    district: "Thảo Điền",
    lat: 10.8031,
    lng: 106.734,
    coverage_radius_m: 510,
  },
  {
    provider: "VinaPhone",
    tower_id: "VT-D3-008",
    location: "District 3, Võ Văn Tần area",
    district: "District 3",
    lat: 10.783,
    lng: 106.692,
    coverage_radius_m: 390,
  },
];

const SUBSCRIBERS = [
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4402",
    phone: "0908-222-3344",
    sim_id: "SIM-4402",
    account_name: "Minh Trần",
    plan: "Viettel Corporate Postpaid",
    status: "active",
  },
  {
    provider: "MobiFone",
    subscriber_id: "SUB-MF-7789",
    phone: "0912-777-8899",
    sim_id: "SIM-0912777889",
    account_name: "Andy Đức Lê",
    plan: "MobiFone Business",
    status: "active",
  },
  {
    provider: "VinaPhone",
    subscriber_id: "SUB-VP-1223",
    phone: "0903-111-2233",
    sim_id: "SIM-0903111223",
    account_name: "Linh Phạm",
    plan: "VinaPhone Premium",
    status: "active",
  },
];

const DEVICES = [
  {
    provider: "Viettel",
    sim_id: "SIM-4402",
    imei: "356938112204402",
    device_model: "iPhone 15 Pro",
    first_seen: "2026-02-02T09:11:00+07:00",
    last_seen: "2026-03-17T23:40:00+07:00",
  },
  {
    provider: "MobiFone",
    sim_id: "SIM-0912777889",
    imei: "357001777889900",
    device_model: "Samsung Galaxy S25",
    first_seen: "2026-01-18T12:00:00+07:00",
    last_seen: "2026-03-17T23:30:00+07:00",
  },
  {
    provider: "VinaPhone",
    sim_id: "SIM-0903111223",
    imei: "358881031112233",
    device_model: "Pixel 10",
    first_seen: "2026-03-01T08:30:00+07:00",
    last_seen: "2026-03-17T23:20:00+07:00",
  },
];

const PINGS = [
  { provider: "Viettel", sim_id: "SIM-4402", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T08:10:00+07:00", signal_dbm: -67 },
  { provider: "Viettel", sim_id: "SIM-4402", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T12:45:00+07:00", signal_dbm: -71 },
  { provider: "Viettel", sim_id: "SIM-4402", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T18:30:00+07:00", signal_dbm: -69 },
  { provider: "Viettel", sim_id: "SIM-4402", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T22:15:00+07:00", signal_dbm: -72 },
  { provider: "Viettel", sim_id: "SIM-4402", tower_location_id: "VT-D2-047", ts_local: "2026-03-17T22:55:00+07:00", signal_dbm: -64 },
  { provider: "Viettel", sim_id: "SIM-4402", tower_location_id: "VT-D2-047", ts_local: "2026-03-17T23:40:00+07:00", signal_dbm: -61 },
  { provider: "MobiFone", sim_id: "SIM-0912777889", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T19:50:00+07:00", signal_dbm: -68 },
  { provider: "MobiFone", sim_id: "SIM-0912777889", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T23:30:00+07:00", signal_dbm: -70 },
  { provider: "VinaPhone", sim_id: "SIM-0903111223", tower_location_id: "VT-D3-008", ts_local: "2026-03-17T22:00:00+07:00", signal_dbm: -73 },
  { provider: "VinaPhone", sim_id: "SIM-0903111223", tower_location_id: "VT-D3-008", ts_local: "2026-03-17T23:20:00+07:00", signal_dbm: -66 },
];

const HANDOFFS = [
  {
    provider: "Viettel",
    sim_id: "SIM-4402",
    from_tower: "VT-D1-012",
    to_tower: "VT-D2-047",
    started_at: "2026-03-17T22:46:00+07:00",
    completed_at: "2026-03-17T22:55:00+07:00",
    movement: "District 1 to Thảo Điền",
  },
  {
    provider: "MobiFone",
    sim_id: "SIM-0912777889",
    from_tower: "VT-D1-012",
    to_tower: "VT-D1-012",
    started_at: "2026-03-17T19:50:00+07:00",
    completed_at: "2026-03-17T23:30:00+07:00",
    movement: "No district change detected",
  },
  {
    provider: "VinaPhone",
    sim_id: "SIM-0903111223",
    from_tower: "VT-D3-008",
    to_tower: "VT-D3-008",
    started_at: "2026-03-17T22:00:00+07:00",
    completed_at: "2026-03-17T23:20:00+07:00",
    movement: "No district change detected",
  },
];

const MESSAGES = [
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4402",
    phone: "0908-222-3344",
    message_id: "SMS-20260317-2249",
    direction: "inbound",
    from: "GRAB",
    to: "0908-222-3344",
    ts_local: "2026-03-17T22:49:00+07:00",
    snippet: "Your driver has arrived near Thao Dien. Reply 1 if you need assistance.",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4402",
    phone: "0908-222-3344",
    message_id: "SMS-20260317-2302",
    direction: "inbound",
    from: "VIETTEL",
    to: "0908-222-3344",
    ts_local: "2026-03-17T23:02:00+07:00",
    snippet: "Network handoff completed. Data session resumed.",
  },
  {
    provider: "MobiFone",
    subscriber_id: "SUB-MF-7789",
    phone: "0912-777-8899",
    message_id: "SMS-20260317-1930",
    direction: "inbound",
    from: "MOBIFONE",
    to: "0912-777-8899",
    ts_local: "2026-03-17T19:30:00+07:00",
    snippet: "Your business roaming package renews tomorrow.",
  },
];

function validProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

function inWindow(ts: string, after: string | null, before: string | null) {
  const matchesAfter = after ? ts >= after : true;
  const matchesBefore = before ? ts <= before : true;
  return matchesAfter && matchesBefore;
}

export async function GET(req: NextRequest) {
  const provider = validProvider(req);
  if (!provider) {
    return NextResponse.json(
      {
        status: "error",
        message: "Choose a telecom provider.",
        providers: PROVIDERS,
      },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "pings";

  if (resource === "subscribers") {
    const phone = req.nextUrl.searchParams.get("phone");
    const subscriberId = req.nextUrl.searchParams.get("subscriber_id");
    const subscribers = SUBSCRIBERS.filter((subscriber) => {
      const matchesProvider = subscriber.provider === provider;
      const matchesPhone = phone ? subscriber.phone === phone : true;
      const matchesSubscriber = subscriberId
        ? subscriber.subscriber_id === subscriberId
        : true;
      return matchesProvider && matchesPhone && matchesSubscriber;
    });

    const minh = subscribers.find((subscriber) => subscriber.sim_id === "SIM-4402");

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      subscribers,
      finding: minh
        ? "Subscriber lookup returned one matching owner and SIM."
        : "Subscriber lookup returned records. Use the matching sim_id for location pings.",
    });
  }

  if (resource === "devices") {
    const simId = req.nextUrl.searchParams.get("sim_id");
    const devices = DEVICES.filter((device) => {
      const matchesProvider = device.provider === provider;
      const matchesSim = simId ? device.sim_id === simId : true;
      return matchesProvider && matchesSim;
    });

    return NextResponse.json({ status: "ok", provider, resource, devices });
  }

  if (resource === "towers") {
    const towerLocationId =
      req.nextUrl.searchParams.get("tower_location_id") ??
      req.nextUrl.searchParams.get("tower_id");
    const towers = TOWERS.filter((tower) => {
      const matchesProvider = tower.provider === provider;
      const matchesTower = towerLocationId ? tower.tower_id === towerLocationId : true;
      return matchesProvider && matchesTower;
    }).map(({ tower_id, ...tower }) => ({
      ...tower,
      tower_location_id: tower_id,
    }));

    return NextResponse.json({ status: "ok", provider, resource, towers });
  }

  if (resource === "handoffs") {
    const simId = req.nextUrl.searchParams.get("sim_id");
    const after = req.nextUrl.searchParams.get("after");
    const before = req.nextUrl.searchParams.get("before");
    const handoffs = HANDOFFS.filter((handoff) => {
      const matchesProvider = handoff.provider === provider;
      const matchesSim = simId ? handoff.sim_id === simId : true;
      const matchesWindow = inWindow(handoff.completed_at, after, before);
      return matchesProvider && matchesSim && matchesWindow;
    });

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      handoffs: handoffs.map(({ from_tower, to_tower, ...handoff }) => ({
        ...handoff,
        from_tower_location_id: from_tower,
        to_tower_location_id: to_tower,
      })),
    });
  }

  if (resource === "messages") {
    const phone = req.nextUrl.searchParams.get("phone");
    const subscriberId = req.nextUrl.searchParams.get("subscriber_id");
    const after = req.nextUrl.searchParams.get("after");
    const before = req.nextUrl.searchParams.get("before");
    const messages = MESSAGES.filter((message) => {
      const matchesProvider = message.provider === provider;
      const matchesPhone = phone ? message.phone === phone : true;
      const matchesSubscriber = subscriberId
        ? message.subscriber_id === subscriberId
        : true;
      const matchesWindow = inWindow(message.ts_local, after, before);
      return matchesProvider && matchesPhone && matchesSubscriber && matchesWindow;
    });

    const rideMessage = messages.find((message) => message.from === "GRAB");

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      messages,
      finding: rideMessage
        ? "Message metadata includes one ride-provider arrival notice."
        : "Message metadata returned. Look for provider messages that corroborate movement.",
    });
  }

  const simId = req.nextUrl.searchParams.get("sim_id");
  const after = req.nextUrl.searchParams.get("after");
  const before = req.nextUrl.searchParams.get("before");
  const pings = PINGS.filter((ping) => {
    const matchesProvider = ping.provider === provider;
    const matchesSim = simId ? ping.sim_id === simId : true;
    const matchesWindow = inWindow(ping.ts_local, after, before);
    return matchesProvider && matchesSim && matchesWindow;
  });

  return NextResponse.json({
    status: "ok",
    provider,
    resource: "pings",
    pings,
    finding:
      "Tower pings returned. Use tower_location_id values with Maps to interpret the locations.",
    latest_tower_location_id: pings.length
      ? pings[pings.length - 1].tower_location_id
      : null,
    _meta: {
      total: pings.length,
      resources: ["subscribers", "pings", "messages"],
    },
  });
}
