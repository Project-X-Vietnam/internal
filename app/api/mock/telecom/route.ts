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
  {
    provider: "Viettel",
    tower_id: "VT-TB-019",
    location: "Tân Bình, near airport",
    district: "Tân Bình",
    lat: 10.8184,
    lng: 106.6588,
    coverage_radius_m: 450,
  },
  {
    provider: "Viettel",
    tower_id: "VT-TD-003",
    location: "Thủ Đức, near Bách Khoa University",
    district: "Thủ Đức",
    lat: 10.8809,
    lng: 106.8056,
    coverage_radius_m: 480,
  },
  {
    provider: "Viettel",
    tower_id: "VT-D7-033",
    location: "District 7, Phú Mỹ Hưng",
    district: "District 7",
    lat: 10.7292,
    lng: 106.7219,
    coverage_radius_m: 400,
  },
  {
    provider: "Viettel",
    tower_id: "VT-PN-011",
    location: "Phú Nhuận, near Phan Xích Long",
    district: "Phú Nhuận",
    lat: 10.7990,
    lng: 106.6802,
    coverage_radius_m: 380,
  },
  {
    provider: "Viettel",
    tower_id: "VT-D5-022",
    location: "District 5, Trần Hưng Đạo area",
    district: "District 5",
    lat: 10.7560,
    lng: 106.6742,
    coverage_radius_m: 410,
  },
  {
    provider: "MobiFone",
    tower_id: "MF-D1-005",
    location: "District 1, Nguyễn Huệ area",
    district: "District 1",
    lat: 10.7739,
    lng: 106.7030,
    coverage_radius_m: 350,
  },
  {
    provider: "MobiFone",
    tower_id: "MF-BT-014",
    location: "Bình Thạnh, near Landmark 81",
    district: "Bình Thạnh",
    lat: 10.7952,
    lng: 106.7219,
    coverage_radius_m: 430,
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
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4401",
    phone: "0901-555-0101",
    sim_id: "SIM-4401",
    account_name: "Kai Đặng",
    plan: "Viettel Enterprise",
    status: "active",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4409",
    phone: "0911-888-9900",
    sim_id: "SIM-4409",
    account_name: "Sơn Phan",
    plan: "Viettel Youth Postpaid",
    status: "active",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4407",
    phone: "0907-333-4455",
    sim_id: "SIM-4407",
    account_name: "Trang Vũ",
    plan: "Viettel Corporate Postpaid",
    status: "active",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4404",
    phone: "0904-555-4455",
    sim_id: "SIM-4404",
    account_name: "Bảo Nguyễn",
    plan: "Viettel Corporate Postpaid",
    status: "active",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4410",
    phone: "0905-444-5566",
    sim_id: "SIM-4410",
    account_name: "Thảo Đinh",
    plan: "Viettel Premium Postpaid",
    status: "active",
  },
  {
    provider: "MobiFone",
    subscriber_id: "SUB-MF-6644",
    phone: "0909-666-5544",
    sim_id: "SIM-4406",
    account_name: "Phúc Hoàng",
    plan: "MobiFone VIP",
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
  {
    provider: "Viettel",
    sim_id: "SIM-4401",
    imei: "356938112204401",
    device_model: "iPhone 16 Pro Max",
    first_seen: "2026-01-10T10:00:00+07:00",
    last_seen: "2026-03-17T21:00:00+07:00",
  },
  {
    provider: "Viettel",
    sim_id: "SIM-4409",
    imei: "356938112204409",
    device_model: "iPhone 14",
    first_seen: "2026-09-01T09:00:00+07:00",
    last_seen: "2026-03-17T22:30:00+07:00",
  },
  {
    provider: "Viettel",
    sim_id: "SIM-4407",
    imei: "356938112204407",
    device_model: "iPhone 15",
    first_seen: "2026-08-15T14:00:00+07:00",
    last_seen: "2026-03-18T00:30:00+07:00",
  },
  {
    provider: "Viettel",
    sim_id: "SIM-4404",
    imei: "356938112204404",
    device_model: "Samsung Galaxy A55",
    first_seen: "2026-06-10T08:00:00+07:00",
    last_seen: "2026-03-18T00:10:00+07:00",
  },
  {
    provider: "Viettel",
    sim_id: "SIM-4410",
    imei: "356938112204410",
    device_model: "MacBook Pro (eSIM)",
    first_seen: "2026-11-20T11:00:00+07:00",
    last_seen: "2026-03-17T18:00:00+07:00",
  },
  {
    provider: "MobiFone",
    sim_id: "SIM-4406",
    imei: "357001666554400",
    device_model: "iPhone 16 Pro",
    first_seen: "2026-01-05T09:00:00+07:00",
    last_seen: "2026-03-17T15:45:00+07:00",
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
  // Kai (SIM-4401)
  { provider: "Viettel", sim_id: "SIM-4401", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T08:15:00+07:00", signal_dbm: -65 },
  { provider: "Viettel", sim_id: "SIM-4401", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T12:00:00+07:00", signal_dbm: -68 },
  { provider: "Viettel", sim_id: "SIM-4401", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T18:00:00+07:00", signal_dbm: -70 },
  { provider: "Viettel", sim_id: "SIM-4401", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T21:00:00+07:00", signal_dbm: -71 },
  // Sơn (SIM-4409)
  { provider: "Viettel", sim_id: "SIM-4409", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T09:30:00+07:00", signal_dbm: -69 },
  { provider: "Viettel", sim_id: "SIM-4409", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T14:00:00+07:00", signal_dbm: -72 },
  { provider: "Viettel", sim_id: "SIM-4409", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T21:30:00+07:00", signal_dbm: -70 },
  { provider: "Viettel", sim_id: "SIM-4409", tower_location_id: "VT-TD-003", ts_local: "2026-03-17T22:30:00+07:00", signal_dbm: -63 },
  // Trang (SIM-4407)
  { provider: "Viettel", sim_id: "SIM-4407", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T08:20:00+07:00", signal_dbm: -66 },
  { provider: "Viettel", sim_id: "SIM-4407", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T12:00:00+07:00", signal_dbm: -69 },
  { provider: "Viettel", sim_id: "SIM-4407", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T17:00:00+07:00", signal_dbm: -67 },
  { provider: "Viettel", sim_id: "SIM-4407", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T22:00:00+07:00", signal_dbm: -71 },
  { provider: "Viettel", sim_id: "SIM-4407", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T23:30:00+07:00", signal_dbm: -70 },
  { provider: "Viettel", sim_id: "SIM-4407", tower_location_id: "VT-D1-012", ts_local: "2026-03-18T00:30:00+07:00", signal_dbm: -72 },
  // Bảo (SIM-4404) — at tower all day/night
  { provider: "Viettel", sim_id: "SIM-4404", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T07:55:00+07:00", signal_dbm: -64 },
  { provider: "Viettel", sim_id: "SIM-4404", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T12:00:00+07:00", signal_dbm: -66 },
  { provider: "Viettel", sim_id: "SIM-4404", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T16:00:00+07:00", signal_dbm: -68 },
  { provider: "Viettel", sim_id: "SIM-4404", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T20:00:00+07:00", signal_dbm: -65 },
  { provider: "Viettel", sim_id: "SIM-4404", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T23:00:00+07:00", signal_dbm: -67 },
  { provider: "Viettel", sim_id: "SIM-4404", tower_location_id: "VT-D1-012", ts_local: "2026-03-18T00:10:00+07:00", signal_dbm: -66 },
  // Thảo (SIM-4410) — leaves in evening
  { provider: "Viettel", sim_id: "SIM-4410", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T09:15:00+07:00", signal_dbm: -70 },
  { provider: "Viettel", sim_id: "SIM-4410", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T14:00:00+07:00", signal_dbm: -71 },
  { provider: "Viettel", sim_id: "SIM-4410", tower_location_id: "VT-D1-012", ts_local: "2026-03-17T18:00:00+07:00", signal_dbm: -69 },
  { provider: "Viettel", sim_id: "SIM-4410", tower_location_id: "VT-TD-003", ts_local: "2026-03-17T18:45:00+07:00", signal_dbm: -62 },
  // Phúc (SIM-4406 on MobiFone)
  { provider: "MobiFone", sim_id: "SIM-4406", tower_location_id: "MF-D1-005", ts_local: "2026-03-17T09:00:00+07:00", signal_dbm: -65 },
  { provider: "MobiFone", sim_id: "SIM-4406", tower_location_id: "MF-D1-005", ts_local: "2026-03-17T11:00:00+07:00", signal_dbm: -68 },
  { provider: "MobiFone", sim_id: "SIM-4406", tower_location_id: "MF-D1-005", ts_local: "2026-03-17T15:00:00+07:00", signal_dbm: -66 },
  { provider: "MobiFone", sim_id: "SIM-4406", tower_location_id: "MF-BT-014", ts_local: "2026-03-17T15:45:00+07:00", signal_dbm: -60 },
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
  {
    provider: "Viettel",
    sim_id: "SIM-4409",
    from_tower: "VT-D1-012",
    to_tower: "VT-TD-003",
    started_at: "2026-03-17T22:05:00+07:00",
    completed_at: "2026-03-17T22:30:00+07:00",
    movement: "District 1 to Thủ Đức",
  },
  {
    provider: "Viettel",
    sim_id: "SIM-4410",
    from_tower: "VT-D1-012",
    to_tower: "VT-TD-003",
    started_at: "2026-03-17T18:10:00+07:00",
    completed_at: "2026-03-17T18:45:00+07:00",
    movement: "District 1 to Thủ Đức",
  },
  {
    provider: "MobiFone",
    sim_id: "SIM-4406",
    from_tower: "MF-D1-005",
    to_tower: "MF-BT-014",
    started_at: "2026-03-17T15:15:00+07:00",
    completed_at: "2026-03-17T15:45:00+07:00",
    movement: "District 1 to Bình Thạnh",
  },
  {
    provider: "Viettel",
    sim_id: "SIM-4404",
    from_tower: "VT-D1-012",
    to_tower: "VT-D1-012",
    started_at: "2026-03-17T07:55:00+07:00",
    completed_at: "2026-03-18T00:10:00+07:00",
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
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4402",
    phone: "0908-222-3344",
    message_id: "SMS-20260317-0830",
    direction: "inbound",
    from: "VIETTEL",
    to: "0908-222-3344",
    ts_local: "2026-03-17T08:30:00+07:00",
    snippet: "Good morning! Your Viettel bill for March is ready. View at my.viettel.vn",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4402",
    phone: "0908-222-3344",
    message_id: "SMS-20260317-1830",
    direction: "outbound",
    from: "0908-222-3344",
    to: "0901-555-0101",
    ts_local: "2026-03-17T18:30:00+07:00",
    snippet: "[content redacted — subscriber privacy]",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4401",
    phone: "0901-555-0101",
    message_id: "SMS-20260317-2030",
    direction: "outbound",
    from: "0901-555-0101",
    to: "0907-333-4455",
    ts_local: "2026-03-17T20:30:00+07:00",
    snippet: "[content redacted — subscriber privacy]",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4409",
    phone: "0911-888-9900",
    message_id: "SMS-20260317-2145",
    direction: "inbound",
    from: "VIETTEL",
    to: "0911-888-9900",
    ts_local: "2026-03-17T21:45:00+07:00",
    snippet: "Your data usage has reached 80% of your monthly limit.",
  },
  {
    provider: "Viettel",
    subscriber_id: "SUB-VT-4404",
    phone: "0904-555-4455",
    message_id: "SMS-20260317-2035",
    direction: "outbound",
    from: "0904-555-4455",
    to: "0912-777-8899",
    ts_local: "2026-03-17T20:35:00+07:00",
    snippet: "[content redacted — subscriber privacy]",
  },
  {
    provider: "MobiFone",
    subscriber_id: "SUB-MF-7789",
    phone: "0912-777-8899",
    message_id: "SMS-20260317-2040",
    direction: "inbound",
    from: "0904-555-4455",
    to: "0912-777-8899",
    ts_local: "2026-03-17T20:40:00+07:00",
    snippet: "[content redacted — subscriber privacy]",
  },
  {
    provider: "VinaPhone",
    subscriber_id: "SUB-VP-1223",
    phone: "0903-111-2233",
    message_id: "SMS-20260317-2300",
    direction: "inbound",
    from: "VINAPHONE",
    to: "0903-111-2233",
    ts_local: "2026-03-17T23:00:00+07:00",
    snippet: "Your VinaPhone Premium plan auto-renewed. Charge: 199,000 VND.",
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
