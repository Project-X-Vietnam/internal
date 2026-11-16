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
    coverage: "cached web pages, social media snapshots, and interview transcripts from launch week",
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
  {
    provider: "Oracle Press Archive",
    page_id: "PAGE-ORACLE-TEAM",
    slug: "oracle-leadership-team",
    title: "Oracle Labs leadership team — March 2026",
    url: `${INTERNAL_ORIGIN}/archive/oracle-leadership-team`,
    summary: "Official leadership page cached at launch. Lists C-suite and board members.",
    body:
      "Oracle Labs Leadership Team (as of March 2026). CEO & Founder: Kai Đặng. CTO: Minh Trần. COO & Co-founder: Andy Đức Lê. Board Chair: Phúc Hoàng. Head of Product: Linh Phạm. Head of Security: Bảo Nguyễn. The leadership page was last updated on 2026-03-15 and does not reflect any pending personnel changes.",
  },
  {
    provider: "City Business Registry",
    page_id: "PAGE-ORACLE-FILING",
    slug: "oracle-labs-filing",
    title: "Oracle Labs Ltd — Company registration filing",
    url: `${INTERNAL_ORIGIN}/archive/oracle-labs-filing`,
    summary: "Business registration record for Oracle Labs Ltd. Directors and founding date.",
    body:
      "Oracle Labs Ltd. Registered: 2019-01-15. Registration No: 0316-ORACLE-2019. Registered office: Bitexco Financial Tower, Floor 38-41, 2 Hải Triều, Bến Nghé, District 1, Ho Chi Minh City. Directors: Đặng Vũ Khoa (CEO), Lê Đức An (COO), Trần Quang Minh (CTO). Share capital: 50,000,000,000 VND. Industry classification: Information technology — AI and analytics services.",
  },
  {
    provider: "City Business Registry",
    page_id: "PAGE-PHUC-DIRECTORSHIPS",
    slug: "phuc-hoang-directorships",
    title: "Phúc Hoàng — Board directorships",
    url: `${INTERNAL_ORIGIN}/archive/phuc-hoang-directorships`,
    summary: "Public directorship filings for Phúc Hoàng. Multiple board seats listed.",
    body:
      "Phúc Hoàng, DOB 1968-09-12. Active board seats: Oracle Labs Ltd (Chair, since 2020-01-01), Mekong Growth Partners (Advisory Board, since 2018), VN Digital Holdings (Non-executive Director, since 2021). Previous: Saigon Fintech Group (Board, 2015-2019, resigned). Public note: Mr. Hoàng has been associated with Mekong Capital portfolio companies for over a decade.",
  },
  {
    provider: "Launch Mirror",
    page_id: "PAGE-VIETCETERA-INTERVIEW",
    slug: "vietcetera-kai-interview-2020",
    title: "Vietcetera interview: Kai Đặng (2020 cached copy)",
    url: `${INTERNAL_ORIGIN}/archive/vietcetera-kai-interview-2020`,
    summary: "Cached 2020 Vietcetera profile interview with Kai Đặng. Pre-Oracle era.",
    body:
      "Cached from Vietcetera, originally published September 2020. Title: 'The Kid Who Watched Everything — Kai Đặng on building the future of investigative AI.' In the interview, Kai discusses growing up in District 1, his early interest in surveillance systems, and founding Oracle Labs. The interviewer asks about family; Kai mentions growing up 'with someone who saw the world from the opposite side of the same face' but declines to elaborate. The full interview ran 2,400 words. This cached copy preserves only the biographical excerpt.",
  },
  {
    provider: "Launch Mirror",
    page_id: "PAGE-LAUNCH-SOCIAL",
    slug: "launch-social-feed",
    title: "Social media snapshot — THEIA launch night",
    url: `${INTERNAL_ORIGIN}/archive/launch-social-feed`,
    summary: "Aggregated public social posts from launch night. Employee and attendee posts.",
    body:
      "Aggregated from public Instagram and LinkedIn posts tagged #THEIALaunch or #OracleLabs, 2026-03-17 18:00–2026-03-18 01:00. 23 posts total. Notable: @linh.pham posted a champagne toast photo at 19:15 (Floor 39). @vy.le.mktg posted a team selfie at 20:00. @son.codes posted 'Still pushing commits while everyone parties 😅' at 21:30. @trang.vu posted 'Tonight is going to change everything' at 18:45. No posts from Kai, Minh, Andy, or Bảo during this window.",
  },
  {
    provider: "Oracle Press Archive",
    page_id: "PAGE-THEIA-WHITEPAPER",
    slug: "theia-whitepaper-abstract",
    title: "THEIA platform whitepaper abstract",
    url: `${INTERNAL_ORIGIN}/archive/theia-whitepaper-abstract`,
    summary: "Technical abstract for the THEIA platform. Published at launch.",
    body:
      "THEIA: Transparent Heuristic Engine for Investigative Analytics. Version 3.0. Authors: Minh Trần (CTO), Tuấn Đỗ (ML Engineering), Mai Ngô (Data Science). Abstract: THEIA is a multi-modal investigative intelligence platform that integrates sensor fusion, natural language analysis, and anomaly detection to support enterprise security and law enforcement partners. The platform processes real-time feeds from badge access systems, telecommunications metadata, financial transaction records, and environmental sensors to surface investigative leads. This whitepaper describes the system architecture, model training methodology, and benchmark results.",
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
