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
];

const DRIVERS = [
  { provider: "Be", driver_id: "DRV-81", name: "Nguyễn Văn Tâm", rating: 4.91 },
  { provider: "Xanh SM", driver_id: "DRV-82", name: "Trần Thanh Hùng", rating: 4.88 },
  { provider: "Grab", driver_id: "DRV-83", name: "Lê Minh Đức", rating: 4.94 },
];

const PAYMENTS = [
  { provider: "Be", payment_id: "PAY-001", ride_id: "RH-20260317-0814", method: "card", amount_vnd: 45000 },
  { provider: "Grab", payment_id: "PAY-002", ride_id: "RH-20260317-2228", method: "wallet", amount_vnd: 87000 },
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
