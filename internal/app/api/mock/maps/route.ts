import { NextRequest, NextResponse } from "next/server";

const PROVIDERS = ["VMap", "Google Maps", "Here"];

const LOCATIONS = [
  {
    provider: "VMap",
    location_id: "LOC-D1-ORACLE",
    alias: "Bitexco Financial Tower",
    label: "Bitexco Financial Tower, District 1",
    district: "District 1",
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    provider: "VMap",
    location_id: "VT-D1-012",
    alias: "D1 telecom tower",
    label: "District 1, near Bitexco Financial Tower",
    district: "District 1",
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    provider: "VMap",
    location_id: "VT-D2-047",
    alias: "Thao Dien telecom tower",
    label: "Thảo Điền, District 2",
    district: "Thảo Điền",
    lat: 10.8031,
    lng: 106.734,
  },
  {
    provider: "VMap",
    location_id: "LOC-THAODIEN-15LTT",
    alias: "15 Le Thanh Ton Thao Dien",
    label: "15 Lê Thánh Tôn, Thảo Điền, D2",
    district: "Thảo Điền",
    lat: 10.8033,
    lng: 106.7338,
  },
  {
    provider: "Google Maps",
    location_id: "GM-D1-ORACLE",
    alias: "Bitexco Financial Tower",
    label: "Bitexco Financial Tower, District 1",
    district: "District 1",
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    provider: "VMap",
    location_id: "VT-TB-019",
    alias: "Tan Binh airport tower",
    label: "Tân Bình, near Tân Sơn Nhất Airport",
    district: "Tân Bình",
    lat: 10.8184,
    lng: 106.6588,
  },
  {
    provider: "VMap",
    location_id: "VT-TD-003",
    alias: "Thu Duc university tower",
    label: "Thủ Đức, near Bách Khoa University",
    district: "Thủ Đức",
    lat: 10.8809,
    lng: 106.8056,
  },
  {
    provider: "VMap",
    location_id: "VT-D7-033",
    alias: "D7 Phu My Hung tower",
    label: "District 7, Phú Mỹ Hưng",
    district: "District 7",
    lat: 10.7292,
    lng: 106.7219,
  },
  {
    provider: "VMap",
    location_id: "VT-PN-011",
    alias: "Phu Nhuan tower",
    label: "Phú Nhuận, Phan Xích Long area",
    district: "Phú Nhuận",
    lat: 10.7990,
    lng: 106.6802,
  },
  {
    provider: "VMap",
    location_id: "VT-D5-022",
    alias: "D5 Cholon tower",
    label: "District 5, Trần Hưng Đạo",
    district: "District 5",
    lat: 10.7560,
    lng: 106.6742,
  },
  {
    provider: "VMap",
    location_id: "LOC-LANDMARK81",
    alias: "Landmark 81",
    label: "Landmark 81, Bình Thạnh",
    district: "Bình Thạnh",
    lat: 10.7952,
    lng: 106.7219,
  },
  {
    provider: "VMap",
    location_id: "LOC-SGN-AIRPORT",
    alias: "Tan Son Nhat Airport",
    label: "Tân Sơn Nhất International Airport, Tân Bình",
    district: "Tân Bình",
    lat: 10.8188,
    lng: 106.6520,
  },
  {
    provider: "Google Maps",
    location_id: "GM-D2-THAODIEN",
    alias: "Thao Dien",
    label: "Thảo Điền, District 2",
    district: "Thảo Điền",
    lat: 10.8031,
    lng: 106.734,
  },
];

const TRAFFIC = [
  {
    provider: "VMap",
    corridor: "District 1 -> Thảo Điền",
    at: "2026-03-17T23:40:00+07:00",
    condition: "light",
    multiplier: 0.92,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> Thảo Điền",
    at: "2026-03-17T18:30:00+07:00",
    condition: "heavy",
    multiplier: 1.45,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> Tân Bình",
    at: "2026-03-17T18:00:00+07:00",
    condition: "heavy",
    multiplier: 1.55,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> Tân Bình",
    at: "2026-03-17T22:00:00+07:00",
    condition: "light",
    multiplier: 0.88,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> Thủ Đức",
    at: "2026-03-17T18:00:00+07:00",
    condition: "heavy",
    multiplier: 1.60,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> Thủ Đức",
    at: "2026-03-17T22:00:00+07:00",
    condition: "moderate",
    multiplier: 1.10,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> Bình Thạnh",
    at: "2026-03-17T12:30:00+07:00",
    condition: "moderate",
    multiplier: 1.20,
  },
  {
    provider: "VMap",
    corridor: "District 1 -> District 7",
    at: "2026-03-17T18:00:00+07:00",
    condition: "heavy",
    multiplier: 1.50,
  },
];

function validProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

function findLocation(provider: string, id: string | null) {
  if (!id) return null;
  return LOCATIONS.find(
    (location) =>
      location.provider === provider && location.location_id === id
  );
}

function distanceKm(a: (typeof LOCATIONS)[number], b: (typeof LOCATIONS)[number]) {
  const earthKm = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.sqrt(h));
}

function baseDistance(provider: string, from: string | null, to: string | null) {
  const fromLocation = findLocation(provider, from);
  const toLocation = findLocation(provider, to);
  if (!fromLocation || !toLocation) return null;
  const computed = Number(distanceKm(fromLocation, toLocation).toFixed(1));
  const distance =
    fromLocation.district !== toLocation.district && provider === "VMap"
      ? 6.4
      : computed;
  return { from: fromLocation, to: toLocation, distance };
}

export async function GET(req: NextRequest) {
  const provider = validProvider(req);
  if (!provider) {
    return NextResponse.json(
      { status: "error", message: "Choose a maps provider.", providers: PROVIDERS },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "distance";

  if (resource === "locations") {
    const locationId = req.nextUrl.searchParams.get("location_id");
    const district = req.nextUrl.searchParams.get("district")?.toLowerCase();
    const locations = LOCATIONS.filter((location) => {
      const matchesProvider = location.provider === provider;
      const matchesId = locationId ? location.location_id === locationId : true;
      const matchesDistrict = district
        ? location.district.toLowerCase().includes(district)
        : true;
      return matchesProvider && matchesId && matchesDistrict;
    });

    return NextResponse.json({ status: "ok", provider, resource, locations });
  }

  if (resource === "geocode") {
    const query = req.nextUrl.searchParams.get("query")?.toLowerCase() ?? "";
    const matches = LOCATIONS.filter((location) => {
      const text = `${location.alias} ${location.label} ${location.district}`.toLowerCase();
      return location.provider === provider && text.includes(query);
    });

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      query,
      matches,
      finding: matches.some((match) => match.location_id === "LOC-THAODIEN-15LTT")
        ? "Address query returned a matching Thao Dien location record."
        : "Geocode returned possible map locations. Use the matching location_id for distance checks.",
    });
  }

  if (resource === "traffic") {
    const corridor = req.nextUrl.searchParams.get("corridor");
    const at = req.nextUrl.searchParams.get("at");
    const traffic = TRAFFIC.filter((record) => {
      const matchesProvider = record.provider === provider;
      const matchesCorridor = corridor ? record.corridor === corridor : true;
      const matchesAt = at ? record.at === at : true;
      return matchesProvider && matchesCorridor && matchesAt;
    });

    return NextResponse.json({ status: "ok", provider, resource, traffic });
  }

  if (resource === "route") {
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const at = req.nextUrl.searchParams.get("at") ?? "2026-03-17T23:40:00+07:00";
    const distance = baseDistance(provider, from, to);
    if (!distance) {
      return NextResponse.json(
        { status: "error", message: "Use known location ids for from and to." },
        { status: 400 }
      );
    }
    const minutes = Math.round((distance.distance / 24) * 60);

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      from: distance.from,
      to: distance.to,
      at,
      route_km: distance.distance,
      eta_minutes: minutes,
      finding:
        distance.distance >= 6
          ? "route estimate returned for two distinct location records"
          : "same-district route",
    });
  }

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const distance = baseDistance(provider, from, to);
  if (!distance) {
    return NextResponse.json(
      { status: "error", message: "Use known location ids for from and to." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "ok",
    provider,
    resource: "distance",
    from: distance.from,
    to: distance.to,
    distance_km: distance.distance,
    summary:
      distance.distance >= 6
        ? "Compared locations are in separate districts."
        : "These locations are close together.",
    finding:
      distance.distance >= 6
        ? "distinct location records; review timestamps before drawing a conclusion"
        : "same-district location records",
  });
}
