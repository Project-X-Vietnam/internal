import { NextRequest, NextResponse } from "next/server";

const USERS = [
  {
    provider: "Be",
    rider_id: "RH-U-001",
    name: "Kai Đặng",
    phone: "0908-321-7744",
    account_status: "active",
  },
  {
    provider: "Grab",
    rider_id: "RH-U-002",
    name: "Minh Trần",
    phone: "0908-222-3344",
    account_status: "active",
  },
  {
    provider: "Be",
    rider_id: "RH-U-006",
    name: "Minh Trần",
    phone: "0908-222-3344",
    account_status: "active",
  },
  {
    provider: "Xanh SM",
    rider_id: "RH-U-003",
    name: "Andy Đức Lê",
    phone: "0912-777-8899",
    account_status: "active",
  },
  {
    provider: "Grab",
    rider_id: "RH-U-004",
    name: "Linh Phạm",
    phone: "0903-111-2233",
    account_status: "active",
  },
  {
    provider: "Be",
    rider_id: "RH-U-005",
    name: "Phúc Hoàng",
    phone: "0909-666-5544",
    account_status: "active",
  },
  {
    provider: "Grab",
    rider_id: "RH-U-007",
    name: "Thảo Đinh",
    phone: "0905-444-5566",
    account_status: "active",
  },
  {
    provider: "Grab",
    rider_id: "RH-U-008",
    name: "Trang Vũ",
    phone: "0907-333-4455",
    account_status: "active",
  },
  {
    provider: "Be",
    rider_id: "RH-U-009",
    name: "Sơn Phan",
    phone: "0911-888-9900",
    account_status: "active",
  },
  {
    provider: "Xanh SM",
    rider_id: "RH-U-010",
    name: "Nguyễn Thị Hoa",
    phone: "0901-999-1122",
    account_status: "active",
  },
  {
    provider: "Grab",
    rider_id: "RH-U-011",
    name: "Trần Văn Bình",
    phone: "0902-888-3344",
    account_status: "active",
  },
  {
    provider: "Be",
    rider_id: "RH-U-012",
    name: "Lê Thị Mai",
    phone: "0903-777-5566",
    account_status: "active",
  },
  {
    provider: "Grab",
    rider_id: "RH-U-013",
    name: "Đạt Trương",
    phone: "0902-333-2277",
    account_status: "active",
  },
];

const RIDES = [
  {
    provider: "Be",
    ride_id: "RH-20260317-0814",
    rider_id: "RH-U-001",
    rider_phone: "0908-321-7744",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "Vincom Center, D1",
    pickup_ts: "2026-03-17T08:14:00+07:00",
    dropoff_ts: "2026-03-17T08:32:00+07:00",
    fare_vnd: 45000,
    driver: "Nguyễn Văn Tâm",
    vehicle_plate: "51F-123.45",
  },
  {
    provider: "Xanh SM",
    ride_id: "RH-20260317-1230",
    rider_id: "RH-U-003",
    rider_phone: "0912-777-8899",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "Landmark 81, Bình Thạnh",
    pickup_ts: "2026-03-17T12:30:00+07:00",
    dropoff_ts: "2026-03-17T12:58:00+07:00",
    fare_vnd: 68000,
    driver: "Trần Thanh Hùng",
    vehicle_plate: "51G-456.78",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-2228",
    rider_id: "RH-U-002",
    rider_phone: "0908-222-3344",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "15 Lê Thánh Tôn, Thảo Điền, D2",
    pickup_ts: "2026-03-17T22:28:00+07:00",
    dropoff_ts: "2026-03-17T22:51:00+07:00",
    fare_vnd: 87000,
    driver: "Lê Minh Đức",
    vehicle_plate: "51H-789.01",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-2315",
    rider_id: "RH-U-004",
    rider_phone: "0903-111-2233",
    pickup: "Cafe Runam, D3",
    dropoff: "201 Võ Văn Tần, D3",
    pickup_ts: "2026-03-17T23:15:00+07:00",
    dropoff_ts: "2026-03-17T23:22:00+07:00",
    fare_vnd: 22000,
    driver: "Phạm Quốc Bảo",
    vehicle_plate: "51K-234.56",
  },
  {
    provider: "Be",
    ride_id: "RH-20260317-1945",
    rider_id: "RH-U-005",
    rider_phone: "0909-666-5544",
    pickup: "Thảo Điền Pearl, D2",
    dropoff: "Bitexco Financial Tower, D1",
    pickup_ts: "2026-03-17T19:45:00+07:00",
    dropoff_ts: "2026-03-17T20:10:00+07:00",
    fare_vnd: 72000,
    driver: "Hoàng Văn Tú",
    vehicle_plate: "51M-345.67",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-0905",
    rider_id: "RH-U-007",
    rider_phone: "0905-444-5566",
    pickup: "55 Nguyễn Thị Minh Khai, D1",
    dropoff: "Bitexco Financial Tower, D1",
    pickup_ts: "2026-03-17T09:05:00+07:00",
    dropoff_ts: "2026-03-17T09:13:00+07:00",
    fare_vnd: 28000,
    driver: "Võ Thanh Liêm",
    vehicle_plate: "51F-567.89",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-1810",
    rider_id: "RH-U-007",
    rider_phone: "0905-444-5566",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "55 Nguyễn Thị Minh Khai, D1",
    pickup_ts: "2026-03-17T18:10:00+07:00",
    dropoff_ts: "2026-03-17T18:18:00+07:00",
    fare_vnd: 28000,
    driver: "Ngô Hoàng Phúc",
    vehicle_plate: "51G-890.12",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-0820",
    rider_id: "RH-U-008",
    rider_phone: "0907-333-4455",
    pickup: "33 Bến Vân Đồn, D4",
    dropoff: "Bitexco Financial Tower, D1",
    pickup_ts: "2026-03-17T08:20:00+07:00",
    dropoff_ts: "2026-03-17T08:35:00+07:00",
    fare_vnd: 35000,
    driver: "Đinh Minh Trí",
    vehicle_plate: "51H-123.99",
  },
  {
    provider: "Be",
    ride_id: "RH-20260317-2200",
    rider_id: "RH-U-009",
    rider_phone: "0911-888-9900",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "KTX Đại học Bách Khoa, Thủ Đức",
    pickup_ts: "2026-03-17T22:00:00+07:00",
    dropoff_ts: "2026-03-17T22:35:00+07:00",
    fare_vnd: 115000,
    driver: "Lý Văn Quang",
    vehicle_plate: "51K-678.90",
  },
  {
    provider: "Xanh SM",
    ride_id: "RH-20260317-0730",
    rider_id: "RH-U-010",
    rider_phone: "0901-999-1122",
    pickup: "Vinhomes Central Park, Bình Thạnh",
    dropoff: "Bitexco Financial Tower, D1",
    pickup_ts: "2026-03-17T07:30:00+07:00",
    dropoff_ts: "2026-03-17T07:55:00+07:00",
    fare_vnd: 55000,
    driver: "Bùi Quốc Hưng",
    vehicle_plate: "51G-111.22",
  },
  {
    provider: "Xanh SM",
    ride_id: "RH-20260317-1830",
    rider_id: "RH-U-010",
    rider_phone: "0901-999-1122",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "Vinhomes Central Park, Bình Thạnh",
    pickup_ts: "2026-03-17T18:30:00+07:00",
    dropoff_ts: "2026-03-17T18:55:00+07:00",
    fare_vnd: 58000,
    driver: "Bùi Quốc Hưng",
    vehicle_plate: "51G-111.22",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-1215",
    rider_id: "RH-U-011",
    rider_phone: "0902-888-3344",
    pickup: "Saigon Centre, D1",
    dropoff: "Bitexco Financial Tower, D1",
    pickup_ts: "2026-03-17T12:15:00+07:00",
    dropoff_ts: "2026-03-17T12:22:00+07:00",
    fare_vnd: 18000,
    driver: "Phạm Quốc Bảo",
    vehicle_plate: "51K-234.56",
  },
  {
    provider: "Be",
    ride_id: "RH-20260317-1730",
    rider_id: "RH-U-012",
    rider_phone: "0903-777-5566",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "Tân Sơn Nhất Airport, Tân Bình",
    pickup_ts: "2026-03-17T17:30:00+07:00",
    dropoff_ts: "2026-03-17T18:05:00+07:00",
    fare_vnd: 145000,
    driver: "Nguyễn Văn Tâm",
    vehicle_plate: "51F-123.45",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-1905",
    rider_id: "RH-U-013",
    rider_phone: "0902-333-2277",
    pickup: "Bitexco Financial Tower, D1",
    dropoff: "17 Pasteur, D1",
    pickup_ts: "2026-03-17T19:05:00+07:00",
    dropoff_ts: "2026-03-17T19:12:00+07:00",
    fare_vnd: 22000,
    driver: "Lê Minh Đức",
    vehicle_plate: "51H-789.01",
  },
  {
    provider: "Grab",
    ride_id: "RH-20260317-0745",
    rider_id: "RH-U-002",
    rider_phone: "0908-222-3344",
    pickup: "15 Lê Thánh Tôn, Thảo Điền, D2",
    dropoff: "Bitexco Financial Tower, D1",
    pickup_ts: "2026-03-17T07:45:00+07:00",
    dropoff_ts: "2026-03-17T08:15:00+07:00",
    fare_vnd: 82000,
    driver: "Trần Đức Minh",
    vehicle_plate: "51F-456.78",
  },
];

const DRIVERS = [
  { provider: "Be", driver_id: "DRV-81", name: "Nguyễn Văn Tâm", rating: 4.91 },
  { provider: "Xanh SM", driver_id: "DRV-82", name: "Trần Thanh Hùng", rating: 4.88 },
  { provider: "Grab", driver_id: "DRV-83", name: "Lê Minh Đức", rating: 4.94 },
  { provider: "Grab", driver_id: "DRV-84", name: "Võ Thanh Liêm", rating: 4.87 },
  { provider: "Grab", driver_id: "DRV-85", name: "Ngô Hoàng Phúc", rating: 4.92 },
  { provider: "Grab", driver_id: "DRV-86", name: "Đinh Minh Trí", rating: 4.85 },
  { provider: "Grab", driver_id: "DRV-87", name: "Phạm Quốc Bảo", rating: 4.90 },
  { provider: "Grab", driver_id: "DRV-88", name: "Trần Đức Minh", rating: 4.93 },
  { provider: "Be", driver_id: "DRV-89", name: "Lý Văn Quang", rating: 4.86 },
  { provider: "Be", driver_id: "DRV-90", name: "Hoàng Văn Tú", rating: 4.89 },
  { provider: "Xanh SM", driver_id: "DRV-91", name: "Bùi Quốc Hưng", rating: 4.91 },
];

const PAYMENTS = [
  { provider: "Be", payment_id: "PAY-001", ride_id: "RH-20260317-0814", method: "card", amount_vnd: 45000 },
  { provider: "Grab", payment_id: "PAY-002", ride_id: "RH-20260317-2228", method: "wallet", amount_vnd: 87000 },
  { provider: "Grab", payment_id: "PAY-003", ride_id: "RH-20260317-2315", method: "card", amount_vnd: 22000 },
  { provider: "Xanh SM", payment_id: "PAY-004", ride_id: "RH-20260317-1230", method: "wallet", amount_vnd: 68000 },
  { provider: "Be", payment_id: "PAY-005", ride_id: "RH-20260317-1945", method: "cash", amount_vnd: 72000 },
  { provider: "Grab", payment_id: "PAY-006", ride_id: "RH-20260317-0905", method: "wallet", amount_vnd: 28000 },
  { provider: "Grab", payment_id: "PAY-007", ride_id: "RH-20260317-1810", method: "wallet", amount_vnd: 28000 },
  { provider: "Be", payment_id: "PAY-008", ride_id: "RH-20260317-2200", method: "card", amount_vnd: 115000 },
  { provider: "Grab", payment_id: "PAY-009", ride_id: "RH-20260317-0745", method: "wallet", amount_vnd: 82000 },
  { provider: "Be", payment_id: "PAY-010", ride_id: "RH-20260317-1730", method: "card", amount_vnd: 145000 },
];

const PROVIDERS = ["Grab", "Be", "Xanh SM"];

function readProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

export async function GET(req: NextRequest) {
  const provider = readProvider(req);
  if (!provider) {
    return NextResponse.json(
      {
        status: "error",
        message: "Choose a ride-hailing provider.",
        providers: PROVIDERS,
      },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "trips";

  if (resource === "users") {
    const name = req.nextUrl.searchParams.get("name")?.toLowerCase();
    const phone = req.nextUrl.searchParams.get("phone");
    const users = USERS.filter((user) => {
      const matchesProvider = user.provider === provider;
      const matchesName = name ? user.name.toLowerCase().includes(name) : true;
      const matchesPhone = phone ? user.phone === phone : true;
      return matchesProvider && matchesName && matchesPhone;
    });

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      users,
      _docs: {
        endpoint: "GET /api/mock/ride?provider={provider}&resource=users",
        params: ["provider", "name", "phone"],
      },
    });
  }

  if (resource === "drivers") {
    const driverId = req.nextUrl.searchParams.get("driver_id");
    const drivers = DRIVERS.filter((driver) => {
      const matchesProvider = driver.provider === provider;
      const matchesDriver = driverId ? driver.driver_id === driverId : true;
      return matchesProvider && matchesDriver;
    });

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      drivers,
      _docs: {
        endpoint: "GET /api/mock/ride?provider={provider}&resource=drivers",
        params: ["provider", "driver_id"],
      },
    });
  }

  if (resource === "payments") {
    const rideId = req.nextUrl.searchParams.get("ride_id");
    const payments = PAYMENTS.filter((payment) => {
      const matchesProvider = payment.provider === provider;
      const matchesRide = rideId ? payment.ride_id === rideId : true;
      return matchesProvider && matchesRide;
    });

    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      payments,
      _docs: {
        endpoint: "GET /api/mock/ride?provider={provider}&resource=payments",
        params: ["provider", "ride_id"],
      },
    });
  }

  const riderId = req.nextUrl.searchParams.get("rider_id");
  const riderPhone = req.nextUrl.searchParams.get("rider_phone");
  const after = req.nextUrl.searchParams.get("after");
  const before = req.nextUrl.searchParams.get("before");
  const rides = RIDES.filter((ride) => {
    const matchesProvider = ride.provider === provider;
    const matchesRiderId = riderId ? ride.rider_id === riderId : true;
    const matchesPhone = riderPhone ? ride.rider_phone === riderPhone : true;
    const matchesAfter = after ? ride.pickup_ts >= after : true;
    const matchesBefore = before ? ride.pickup_ts <= before : true;
    return matchesProvider && matchesRiderId && matchesPhone && matchesAfter && matchesBefore;
  });

  return NextResponse.json({
    status: "ok",
    provider,
    resource: "trips",
    rides,
    _docs: {
      endpoint: "GET /api/mock/ride?provider={provider}&resource=trips",
      params: ["provider", "rider_id", "rider_phone", "after", "before"],
    },
    _meta: { total: rides.length, note: "Ride hailing service records" },
  });
}
