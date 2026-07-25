import { NextRequest, NextResponse } from "next/server";

const PROVIDERS = ["Oracle Press Archive", "City Business Registry", "Launch Mirror"];
const INTERNAL_ORIGIN = "https://internal.projectxvietnam.org";

const SOURCES = [
  {
    provider: "Oracle Press Archive",
    source_id: "SRC-OPA",
    label: "Oracle Press Archive",
    coverage: "press kits and launch profiles",
  },
  {
    provider: "City Business Registry",
    source_id: "SRC-CBR",
    label: "City Business Registry",
    coverage: "directorships, family-linked filings, public business records",
  },
  {
    provider: "Launch Mirror",
    source_id: "SRC-LM",
    label: "Launch Mirror",
    coverage: "cached web pages from launch week",
  },
];

const PAGES = [
  {
    provider: "City Business Registry",
    page_id: "PAGE-KAI-PROFILE",
    slug: "kai-profile",
    title: "Kai Đặng / Đặng Vũ Khoa, founder profile",
    url: `${INTERNAL_ORIGIN}/archive/kai-profile`,
    summary:
      "Cached founder profile. Multiple captured versions are available for comparison.",
    body:
      "Cached from a pre-launch press kit, March 2026. Kai Đặng built Oracle Labs around a private belief: systems reveal people when people try hardest to hide. Preserved registry excerpt: legal name Đặng Vũ Khoa, known as Kai Đặng, date of birth 1993-03-17. Older event materials, including a 2020 Vietcetera profile and a District 1 business registry filing, mention that Kai grew up with a brother who rarely appeared in public photographs. The brother's name does not appear in any Oracle Labs filing. By the time the 2025 press kit was assembled, all references to siblings had been quietly removed. Oracle's current biography describes Kai as an only child.",
  },
  {
    provider: "Oracle Press Archive",
    page_id: "PAGE-ORACLE-LAUNCH",
    slug: "oracle-launch-brief",
    title: "Oracle Labs launch brief",
    url: `${INTERNAL_ORIGIN}/archive/oracle-launch-brief`,
    summary: "Launch-week press boilerplate with no biographical revision trail.",
    body:
      "Oracle Labs announces THEIA, a private investigative intelligence platform for enterprise and public-sector partners. The launch brief contains product positioning and executive quotes, but no detailed founder biography.",
  },
];

function validProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

export async function GET(req: NextRequest) {
  const provider = validProvider(req);
  if (!provider) {
    return NextResponse.json(
      { status: "error", message: "Choose an archive provider.", providers: PROVIDERS },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "search";

  if (resource === "sources") {
    return NextResponse.json({
      status: "ok",
      provider,
      resource,
      sources: SOURCES.filter((source) => source.provider === provider),
    });
  }

  if (resource === "page") {
    const pageId = req.nextUrl.searchParams.get("page_id");
    const slug = req.nextUrl.searchParams.get("slug");
    const pages = PAGES.filter((page) => {
      const matchesProvider = page.provider === provider;
      const matchesPage = pageId ? page.page_id === pageId : true;
      const matchesSlug = slug ? page.slug === slug : true;
      return matchesProvider && matchesPage && matchesSlug;
    });
    return NextResponse.json({ status: "ok", provider, resource, pages });
  }

  if (resource !== "search") {
    return NextResponse.json(
      {
        status: "error",
        message: "Unsupported archive resource.",
        resources: ["sources", "search", "page"],
      },
      { status: 400 }
    );
  }

  const query = req.nextUrl.searchParams.get("query")?.toLowerCase() ?? "";
  const results = PAGES.filter((page) => {
    const matchesProvider = page.provider === provider;
    const text = `${page.title} ${page.summary}`.toLowerCase();
    return matchesProvider && text.includes(query);
  }).map(({ provider, page_id, slug, title, summary }) => ({
    provider,
    page_id,
    slug,
    title,
    summary,
  }));

  return NextResponse.json({ status: "ok", provider, resource: "search", query, results });
}
