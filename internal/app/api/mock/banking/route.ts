import { NextRequest, NextResponse } from "next/server";

const PROVIDERS = ["Vietcombank", "Cayman NatWest", "ACB"];

const ACCOUNTS = [
  {
    provider: "Cayman NatWest",
    account_id: "CAYMAN-NW-77291",
    account_name: "Horizon Pacific Consulting",
    jurisdiction: "KY",
    account_type: "corporate",
    risk_flag: "offshore advisory shell",
  },
  {
    provider: "Vietcombank",
    account_id: "VCB-****1190",
    account_name: "Andy Đức Lê (personal)",
    jurisdiction: "VN",
    account_type: "personal",
    risk_flag: "related party",
  },
  {
    provider: "Vietcombank",
    account_id: "VCB-****3304",
    account_name: "Phúc Hoàng (personal)",
    jurisdiction: "VN",
    account_type: "personal",
    risk_flag: "board-related party",
  },
];

const WIRES = [
  {
    provider: "Cayman NatWest",
    tx_id: "SW-20260301-001",
    sender_account: "VCB-****8821",
    sender_name: "Oracle Labs Ltd",
    recipient_account: "CAYMAN-NW-77291",
    recipient_name: "Horizon Pacific Consulting",
    amount_usd: 2450000,
    ts: "2026-03-01T14:22:00+07:00",
    swift_code: "NATW-KY-001",
    memo: "Advisory services Q1 - tranche A",
    status: "completed",
  },
  {
    provider: "Cayman NatWest",
    tx_id: "SW-20260308-002",
    sender_account: "VCB-****8821",
    sender_name: "Oracle Labs Ltd",
    recipient_account: "CAYMAN-NW-77291",
    recipient_name: "Horizon Pacific Consulting",
    amount_usd: 1890000,
    ts: "2026-03-08T09:15:00+07:00",
    swift_code: "NATW-KY-001",
    memo: "Strategic partnership fee - tranche B",
    status: "completed",
  },
  {
    provider: "Cayman NatWest",
    tx_id: "SW-20260315-003",
    sender_account: "VCB-****3304",
    sender_name: "Phúc Hoàng (personal)",
    recipient_account: "CAYMAN-NW-77291",
    recipient_name: "Horizon Pacific Consulting",
    amount_usd: 3120000,
    ts: "2026-03-15T16:40:00+07:00",
    swift_code: "NATW-KY-001",
    memo: "Investment return - private arrangement / bridge placement",
    status: "completed",
  },
  {
    provider: "Cayman NatWest",
    tx_id: "SW-20260317-004",
    sender_account: "CAYMAN-NW-77291",
    sender_name: "Horizon Pacific Consulting",
    recipient_account: "UNKNOWN",
    recipient_name: "-",
    amount_usd: 50000,
    ts: "2026-03-17T18:00:00+07:00",
    swift_code: "NATW-KY-001",
    memo: "Operational - seat reservation",
    status: "completed",
  },
  {
    provider: "Cayman NatWest",
    tx_id: "SW-20260310-005",
    sender_account: "VCB-****1190",
    sender_name: "Andy Đức Lê (personal)",
    recipient_account: "CAYMAN-NW-77291",
    recipient_name: "Horizon Pacific Consulting",
    amount_usd: 1750000,
    ts: "2026-03-10T11:30:00+07:00",
    swift_code: "NATW-KY-001",
    memo: "Consulting retainer - success premium",
    status: "completed",
  },
];

function validProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

function matchesText(value: string, query: string | null) {
  return query ? value.toLowerCase().includes(query.toLowerCase()) : true;
}

export async function GET(req: NextRequest) {
  const provider = validProvider(req);
  if (!provider) {
    return NextResponse.json(
      { status: "error", message: "Choose a banking provider.", providers: PROVIDERS },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "wires";

  if (resource === "accounts") {
    const query = req.nextUrl.searchParams.get("query");
    const accountId = req.nextUrl.searchParams.get("account_id");
    const accounts = ACCOUNTS.filter((account) => {
      const matchesProvider = account.provider === provider;
      const matchesId = accountId ? account.account_id === accountId : true;
      const matchesQuery = query
        ? matchesText(`${account.account_id} ${account.account_name}`, query)
        : true;
      return matchesProvider && matchesId && matchesQuery;
    });
    return NextResponse.json({ status: "ok", provider, resource, accounts });
  }

  if (resource === "transaction") {
    const txId = req.nextUrl.searchParams.get("tx_id");
    const transactions = WIRES.filter((wire) => {
      const matchesProvider = wire.provider === provider;
      const matchesTx = txId ? wire.tx_id === txId : true;
      return matchesProvider && matchesTx;
    });
    return NextResponse.json({ status: "ok", provider, resource, transactions });
  }

  const counterparty = req.nextUrl.searchParams.get("counterparty");
  const accountId = req.nextUrl.searchParams.get("account_id");
  const transactions = WIRES.filter((wire) => {
    const matchesProvider = wire.provider === provider;
    const matchesAccount = accountId
      ? wire.sender_account === accountId || wire.recipient_account === accountId
      : true;
    const matchesCounterparty = counterparty
      ? matchesText(
          `${wire.sender_account} ${wire.sender_name} ${wire.recipient_account} ${wire.recipient_name}`,
          counterparty
        )
      : true;
    return matchesProvider && matchesAccount && matchesCounterparty;
  });

  return NextResponse.json({
    status: "ok",
    provider,
    resource: "wires",
    transactions,
    _meta: {
      total: transactions.length,
      query: counterparty,
      total_amount_usd: transactions.reduce((sum, wire) => sum + wire.amount_usd, 0),
      flag: "CAYMAN-NW-77291 appears in high-value transactions across different senders",
    },
  });
}
