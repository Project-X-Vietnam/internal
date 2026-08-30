import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 8;
const PROVIDERS = ["Vietnam Airlines", "Vietjet", "Bamboo Airways"];

const FLIGHTS = [
  {
    provider: "Vietnam Airlines",
    flight_id: "VN118-20260317",
    flight: "VN118",
    date: "2026-03-17",
    route: "SGN -> HAN",
    depart: "21:30",
    status: "departed",
  },
  {
    provider: "Vietnam Airlines",
    flight_id: "VN773-20260317",
    flight: "VN773",
    date: "2026-03-17",
    route: "SGN -> CXR",
    depart: "23:10",
    status: "departed",
  },
  {
    provider: "Vietnam Airlines",
    flight_id: "VN402-20260318",
    flight: "VN402",
    date: "2026-03-18",
    route: "SGN -> SIN",
    depart: "06:00",
    status: "boarding scheduled",
  },
  {
    provider: "Vietjet",
    flight_id: "VJ840-20260317",
    flight: "VJ840",
    date: "2026-03-17",
    route: "SGN -> SIN",
    depart: "22:45",
    status: "departed",
  },
  {
    provider: "Vietjet",
    flight_id: "VJ811-20260318",
    flight: "VJ811",
    date: "2026-03-18",
    route: "SGN -> SIN",
    depart: "07:15",
    status: "scheduled",
  },
  {
    provider: "Bamboo Airways",
    flight_id: "QH144-20260317",
    flight: "QH144",
    date: "2026-03-17",
    route: "SGN -> DAD",
    depart: "20:20",
    status: "departed",
  },
  {
    provider: "Bamboo Airways",
    flight_id: "QH307-20260318",
    flight: "QH307",
    date: "2026-03-18",
    route: "SGN -> BKK",
    depart: "06:20",
    status: "scheduled",
  },
  {
    provider: "Vietnam Airlines",
    flight_id: "VN220-20260317",
    flight: "VN220",
    date: "2026-03-17",
    route: "SGN -> DAD",
    depart: "14:30",
    status: "departed",
  },
  {
    provider: "Vietnam Airlines",
    flight_id: "VN605-20260317",
    flight: "VN605",
    date: "2026-03-17",
    route: "SGN -> BKK",
    depart: "18:45",
    status: "departed",
  },
  {
    provider: "Vietjet",
    flight_id: "VJ152-20260317",
    flight: "VJ152",
    date: "2026-03-17",
    route: "SGN -> HAN",
    depart: "06:00",
    status: "departed",
  },
  {
    provider: "Vietjet",
    flight_id: "VJ356-20260317",
    flight: "VJ356",
    date: "2026-03-17",
    route: "SGN -> DAD",
    depart: "16:20",
    status: "departed",
  },
  {
    provider: "Bamboo Airways",
    flight_id: "QH202-20260317",
    flight: "QH202",
    date: "2026-03-17",
    route: "SGN -> HAN",
    depart: "10:30",
    status: "departed",
  },
  {
    provider: "Vietnam Airlines",
    flight_id: "VN10-20260318",
    flight: "VN10",
    date: "2026-03-18",
    route: "SGN -> NRT",
    depart: "00:15",
    status: "departed",
  },
];

const MANIFEST = [
  { seat: "1A", passenger: "Nguyễn Thị Mai", passport: "VN-29384756", flight_id: "VN402-20260318", booking_ref: "BK-001", payment_method: "Visa *4421" },
  { seat: "1B", passenger: "Trần Văn Hùng", passport: "VN-83746251", flight_id: "VN402-20260318", booking_ref: "BK-002", payment_method: "Mastercard *7788" },
  { seat: "2A", passenger: "Phạm Quốc Dũng", passport: "VN-19283746", flight_id: "VN402-20260318", booking_ref: "BK-003", payment_method: "VNPay wallet" },
  { seat: "2B", passenger: "Lê Thị Hoa", passport: "VN-56473829", flight_id: "VN402-20260318", booking_ref: "BK-004", payment_method: "Cash (counter)" },
  { seat: "3A", passenger: "Võ Minh Tuấn", passport: "VN-73625140", flight_id: "VN402-20260318", booking_ref: "BK-005", payment_method: "Visa *1199" },
  { seat: "3B", passenger: "Hoàng Thị Lan", passport: "VN-40516273", flight_id: "VN402-20260318", booking_ref: "BK-006", payment_method: "Momo transfer" },
  { seat: "4A", passenger: "Đỗ Thanh Sơn", passport: "VN-61524837", flight_id: "VN402-20260318", booking_ref: "BK-007", payment_method: "Visa *3300" },
  { seat: "4B", passenger: "Bùi Thị Ngọc", passport: "VN-82736451", flight_id: "VN402-20260318", booking_ref: "BK-008", payment_method: "Mastercard *5522" },
  { seat: "5A", passenger: "Ngô Văn Phúc", passport: "VN-34567890", flight_id: "VN402-20260318", booking_ref: "BK-009", payment_method: "JCB *6644" },
  { seat: "5B", passenger: "-", passport: "-", flight_id: "VN402-20260318", booking_ref: "BK-010", payment_method: "OFFSHORE WIRE (Cayman NatWest acct)" },
  { seat: "6A", passenger: "Trịnh Minh Khoa", passport: "VN-45678901", flight_id: "VN402-20260318", booking_ref: "BK-011", payment_method: "Visa *8877" },
  { seat: "6B", passenger: "Lý Thị Phương", passport: "VN-56789012", flight_id: "VN402-20260318", booking_ref: "BK-012", payment_method: "Cash (counter)" },
  { seat: "7A", passenger: "Đinh Hoàng Vũ", passport: "VN-67890123", flight_id: "VN402-20260318", booking_ref: "BK-013", payment_method: "VNPay wallet" },
  { seat: "7B", passenger: "Phan Thị Vy", passport: "VN-78901234", flight_id: "VN402-20260318", booking_ref: "BK-014", payment_method: "Momo transfer" },
  { seat: "8A", passenger: "Huỳnh Văn Long", passport: "VN-89012345", flight_id: "VN402-20260318", booking_ref: "BK-015", payment_method: "Visa *2211" },
  { seat: "8B", passenger: "Dương Thị Tuyết", passport: "VN-90123456", flight_id: "VN402-20260318", booking_ref: "BK-016", payment_method: "Mastercard *4433" },
  { seat: "9A", passenger: "Tạ Quốc Anh", passport: "VN-01234567", flight_id: "VN402-20260318", booking_ref: "BK-017", payment_method: "Cash (counter)" },
  { seat: "9B", passenger: "Châu Thị Hạnh", passport: "VN-12345670", flight_id: "VN402-20260318", booking_ref: "BK-018", payment_method: "VNPay wallet" },
  { seat: "10A", passenger: "Lương Minh Đạt", passport: "VN-23456701", flight_id: "VN402-20260318", booking_ref: "BK-019", payment_method: "Visa *9966" },
  { seat: "10B", passenger: "Kiều Thị Nga", passport: "VN-34567012", flight_id: "VN402-20260318", booking_ref: "BK-020", payment_method: "Momo transfer" },
  { seat: "11A", passenger: "Trương Đức Phong", passport: "VN-45670123", flight_id: "VN402-20260318", booking_ref: "BK-021", payment_method: "Mastercard *7744" },
  { seat: "11B", passenger: "Mai Thị Xuân", passport: "VN-56701234", flight_id: "VN402-20260318", booking_ref: "BK-022", payment_method: "Visa *5533" },
  { seat: "12A", passenger: "Đoàn Hải Sơn", passport: "SG-88227744", flight_id: "VN402-20260318", booking_ref: "BK-023", payment_method: "Visa *1100" },
  { seat: "12B", passenger: "Tan Wei Lin", passport: "SG-77553311", flight_id: "VN402-20260318", booking_ref: "BK-024", payment_method: "OCBC card *8822" },
];

const BOOKINGS = [
  {
    provider: "Vietnam Airlines",
    booking_ref: "BK-010",
    flight_id: "VN402-20260318",
    seat: "5B",
    passenger: "-",
    payment_method: "OFFSHORE WIRE",
    payment_ref: "SW-20260317-004",
    notes: "counter staff override, identity deferred",
  },
  {
    provider: "Vietnam Airlines",
    booking_ref: "BK-009",
    flight_id: "VN402-20260318",
    seat: "5A",
    passenger: "Ngô Văn Phúc",
    payment_method: "JCB *6644",
    payment_ref: "CARD-6644",
    notes: "standard booking",
  },
  {
    provider: "Vietnam Airlines",
    booking_ref: "BK-001",
    flight_id: "VN402-20260318",
    seat: "1A",
    passenger: "Nguyễn Thị Mai",
    payment_method: "Visa *4421",
    payment_ref: "CARD-4421",
    notes: "standard booking",
  },
  {
    provider: "Vietnam Airlines",
    booking_ref: "BK-015",
    flight_id: "VN402-20260318",
    seat: "8A",
    passenger: "Huỳnh Văn Long",
    payment_method: "Visa *2211",
    payment_ref: "CARD-2211",
    notes: "standard booking",
  },
  {
    provider: "Vietnam Airlines",
    booking_ref: "BK-023",
    flight_id: "VN402-20260318",
    seat: "12A",
    passenger: "Đoàn Hải Sơn",
    payment_method: "Visa *1100",
    payment_ref: "CARD-1100",
    notes: "Singapore passport holder — transit passenger",
  },
];

const SEATMAP = [
  { provider: "Vietnam Airlines", flight_id: "VN402-20260318", seat: "5A", status: "assigned", booking_ref: "BK-009" },
  { provider: "Vietnam Airlines", flight_id: "VN402-20260318", seat: "5B", status: "reserved-payment-hold", booking_ref: "BK-010" },
  { provider: "Vietnam Airlines", flight_id: "VN402-20260318", seat: "5C", status: "blocked", booking_ref: null },
];

const CHECKINS = [
  {
    provider: "Vietnam Airlines",
    booking_ref: "BK-010",
    flight_id: "VN402-20260318",
    seat: "5B",
    checkin_status: "not checked in",
    gate: "17",
    closes_at: "2026-03-18T05:40:00+07:00",
  },
];

function validProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

function nextYmd(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return next.toISOString().slice(0, 10);
}

function matchesInvestigativeDate(flight: (typeof FLIGHTS)[number], date: string | null) {
  if (!date || flight.date === date) {
    return true;
  }

  const isNextMorning = flight.date === nextYmd(date);
  const [hour, minute] = flight.depart.split(":").map(Number);
  const minutesAfterMidnight = hour * 60 + minute;

  return isNextMorning && minutesAfterMidnight <= 390;
}

export async function GET(req: NextRequest) {
  const provider = validProvider(req);
  if (!provider) {
    return NextResponse.json(
      { status: "error", message: "Choose an airline provider.", providers: PROVIDERS },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "manifest";

  if (resource === "flights") {
    const date = req.nextUrl.searchParams.get("date");
    const route = req.nextUrl.searchParams.get("route");
    const flights = FLIGHTS.filter((flight) => {
      const matchesProvider = flight.provider === provider;
      const matchesDate = matchesInvestigativeDate(flight, date);
      const matchesRoute = route ? flight.route === route : true;
      return matchesProvider && matchesDate && matchesRoute;
    });
    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      flights,
      _meta: {
        search_date: date,
        date_window:
          "Date searches include that calendar day plus departures through 06:30 the next morning.",
      },
    });
  }

  if (resource === "booking") {
    const bookingRef = req.nextUrl.searchParams.get("booking_ref");
    const bookings = BOOKINGS.filter((booking) => {
      const matchesProvider = booking.provider === provider;
      const matchesRef = bookingRef ? booking.booking_ref === bookingRef : true;
      return matchesProvider && matchesRef;
    });
    return NextResponse.json({ status: "ok", provider, resource, bookings });
  }

  if (resource === "seatmap") {
    const flightId = req.nextUrl.searchParams.get("flight_id");
    const seat = req.nextUrl.searchParams.get("seat");
    const seats = SEATMAP.filter((row) => {
      const matchesProvider = row.provider === provider;
      const matchesFlight = flightId ? row.flight_id === flightId : true;
      const matchesSeat = seat ? row.seat === seat : true;
      return matchesProvider && matchesFlight && matchesSeat;
    });
    return NextResponse.json({ status: "ok", provider, resource, seats });
  }

  if (resource === "checkin") {
    const bookingRef = req.nextUrl.searchParams.get("booking_ref");
    const checkins = CHECKINS.filter((checkin) => {
      const matchesProvider = checkin.provider === provider;
      const matchesRef = bookingRef ? checkin.booking_ref === bookingRef : true;
      return matchesProvider && matchesRef;
    });
    return NextResponse.json({ status: "ok", provider, resource, checkins });
  }

  const flightId = req.nextUrl.searchParams.get("flight_id") ?? "VN402-20260318";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const providerManifest =
    provider === "Vietnam Airlines"
      ? MANIFEST.filter((row) => row.flight_id === flightId)
      : [];
  const start = (page - 1) * PAGE_SIZE;
  const passengers = providerManifest.slice(start, start + PAGE_SIZE);

  return NextResponse.json({
    status: "ok",
    provider,
    resource: "manifest",
    flight_id: flightId,
    passengers,
    _pagination: {
      page,
      per_page: PAGE_SIZE,
      total: providerManifest.length,
      total_pages: Math.ceil(providerManifest.length / PAGE_SIZE),
      has_next: start + PAGE_SIZE < providerManifest.length,
    },
  });
}
