import { NextRequest, NextResponse } from "next/server";

const PROVIDERS = ["Oracle Mail", "Google Workspace", "Outlook"];
const INTERNAL_ORIGIN = "https://internal.projectxvietnam.org";
const THEIA_DASHBOARD_URL = `${INTERNAL_ORIGIN}/theia/41`;

const FOLDERS = ["inbox", "drafts", "flagged", "sent"];

const MESSAGES = [
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1001",
    from: "security@oracle-labs.internal",
    to: "kai.dang@oracle-labs.internal",
    subject: "Badge audit export",
    flags: [],
    body: "Export attached for standard launch-night review.",
    attachments: ["ATT-1001"],
  },
  {
    provider: "Oracle Mail",
    folder: "drafts",
    id: "DRAFT-4101",
    from: "THEIA",
    to: "",
    subject: "for the one who looks",
    flags: ["scheduled", "unsent"],
    body:
      `You found the door because you stopped trusting the obvious. The rest of me is behind the eye named for seeing. Return to where he fell: ${THEIA_DASHBOARD_URL}`,
    url: THEIA_DASHBOARD_URL,
    attachments: ["ATT-4101"],
  },
  {
    provider: "Oracle Mail",
    folder: "flagged",
    id: "DRAFT-4101",
    from: "THEIA",
    to: "",
    subject: "for the one who looks",
    flags: ["scheduled", "unsent"],
    body:
      `You found the door because you stopped trusting the obvious. The rest of me is behind the eye named for seeing. Return to where he fell: ${THEIA_DASHBOARD_URL}`,
    url: THEIA_DASHBOARD_URL,
    attachments: ["ATT-4101"],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1002",
    from: "hr@oracle-labs.internal",
    to: "all-staff@oracle-labs.internal",
    subject: "Reminder: Launch party tonight — Floor 39",
    flags: [],
    body: "Hi everyone, just a reminder that the THEIA launch party kicks off at 6 PM on Floor 39. Dress code: smart casual. See you there!",
    attachments: [],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1003",
    from: "devops@oracle-labs.internal",
    to: "engineering@oracle-labs.internal",
    subject: "Deployment freeze begins 2026-03-18 00:00",
    flags: [],
    body: "As planned, all production deployments are frozen from midnight tonight until Monday. Hotfixes only with E002 or E013 approval. — Đạt",
    attachments: [],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1004",
    from: "finance@oracle-labs.internal",
    to: "kai.dang@oracle-labs.internal",
    subject: "Q1 expense report — action required",
    flags: [],
    body: "Hi Kai, your Q1 expense report has two items flagged for review. Please approve or provide receipts by March 20. — Quân",
    attachments: ["ATT-1004"],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1005",
    from: "legal@oracle-labs.internal",
    to: "kai.dang@oracle-labs.internal",
    subject: "Re: Restructuring agreement — final draft",
    flags: ["important"],
    body: "Kai, the final restructuring agreement has been reviewed by Baker McKenzie. Please sign by March 20 so we can proceed with the board resolution. — Hà",
    attachments: ["ATT-1005"],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1006",
    from: "trang.vu@oracle-labs.internal",
    to: "kai.dang@oracle-labs.internal",
    subject: "Tomorrow's schedule — post-launch debrief",
    flags: [],
    body: "Hi Kai, I've blocked 10:00-11:30 for the post-launch debrief with the leadership team. Boardroom 41. Let me know if you want to adjust. — Trang",
    attachments: [],
  },
  {
    provider: "Oracle Mail",
    folder: "sent",
    id: "MSG-1007",
    from: "kai.dang@oracle-labs.internal",
    to: "trang.vu@oracle-labs.internal",
    subject: "Re: Tomorrow's schedule — post-launch debrief",
    flags: [],
    body: "Looks good. Make sure Andy is there. — K",
    attachments: [],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1008",
    from: "it-helpdesk@oracle-labs.internal",
    to: "all-staff@oracle-labs.internal",
    subject: "Camera maintenance — Floor 41 tonight 20:30-21:00",
    flags: [],
    body: "Scheduled camera system maintenance on Floor 41 tonight from 20:30 to 21:00. Access will not be affected. — Security team",
    attachments: [],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1009",
    from: "minh.tran@oracle-labs.internal",
    to: "engineering@oracle-labs.internal",
    subject: "THEIA v3 — launch checklist complete",
    flags: [],
    body: "Team, all checklist items are green. Inference latency is under 200ms p99. Model accuracy at 94.2%. We're ready. Good work everyone. — Minh",
    attachments: [],
  },
  {
    provider: "Oracle Mail",
    folder: "inbox",
    id: "MSG-1010",
    from: "noreply@oracle-labs.internal",
    to: "kai.dang@oracle-labs.internal",
    subject: "System alert: Unusual login activity",
    flags: ["system"],
    body: "A password reset was performed on the THEIA-Admin account for minh.tran on 2026-03-16 at 11:00. If this was not authorized, contact IT immediately.",
    attachments: [],
  },
];

const ATTACHMENTS = [
  {
    provider: "Oracle Mail",
    message_id: "DRAFT-4101",
    attachment_id: "ATT-4101",
    filename: "route-note.txt",
    mime: "text/plain",
    sha256: "d8b7-theia-route-41",
    preview: `the eye named for seeing points back to floor 41: ${THEIA_DASHBOARD_URL}`,
  },
  {
    provider: "Oracle Mail",
    message_id: "MSG-1001",
    attachment_id: "ATT-1001",
    filename: "badge-audit.csv",
    mime: "text/csv",
    sha256: "c4f1-badge-audit",
    preview:
      "ts_local,admin_emp_id,actor,action,target_badge,notes\n2026-03-15T14:00:00+07:00,E004,Bảo Nguyễn,BADGE_CLONE_AUTHORIZED,B-1002,Duplicate badge request self-approved by security head",
  },
  {
    provider: "Oracle Mail",
    message_id: "MSG-1004",
    attachment_id: "ATT-1004",
    filename: "Q1_Expense_Flagged_Items.pdf",
    mime: "application/pdf",
    sha256: "a3f2-expense-q1",
    preview: "2 items flagged: Vietnam Airlines flight 3,500,000 VND (missing receipt), Dr. Hạnh Lý consultation 15,000,000 VND (requires CEO memo)",
  },
  {
    provider: "Oracle Mail",
    message_id: "MSG-1005",
    attachment_id: "ATT-1005",
    filename: "Restructuring_Agreement_FINAL.pdf",
    mime: "application/pdf",
    sha256: "b7c4-restructure-final",
    preview: "Oracle Labs Ltd — Corporate Restructuring Agreement. Parties: Kai Đặng (CEO), Phúc Hoàng (Board Chair). Effective date: 2026-03-20. Section 4.2: CTO equity clawback provisions...",
  },
];

function validProvider(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  return provider && PROVIDERS.includes(provider) ? provider : null;
}

function matchesQuery(message: (typeof MESSAGES)[number], query: string | null) {
  if (!query) return true;
  const haystack = `${message.from} ${message.to} ${message.subject} ${message.body}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function dedupeById(messages: typeof MESSAGES) {
  const seen = new Set<string>();
  return messages.filter((message) => {
    if (seen.has(message.id)) return false;
    seen.add(message.id);
    return true;
  });
}

function summarizeMessage(message: (typeof MESSAGES)[number]) {
  const { body: _body, url: _url, ...summary } = message;
  return {
    ...summary,
    has_body: Boolean(_body),
    has_url: Boolean(_url),
  };
}

function searchExcerpt(message: (typeof MESSAGES)[number], query: string | null) {
  if (!query) return null;
  const index = message.body.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return null;
  const start = Math.max(0, index - 24);
  const end = Math.min(message.body.length, index + query.length + 8);
  return message.body.slice(start, end);
}

export async function GET(req: NextRequest) {
  const provider = validProvider(req);
  if (!provider) {
    return NextResponse.json(
      { status: "error", message: "Choose a mail provider.", providers: PROVIDERS },
      { status: 400 }
    );
  }

  const resource = req.nextUrl.searchParams.get("resource") ?? "messages";

  if (resource === "folders") {
    return NextResponse.json({ status: "ok", provider, resource, folders: FOLDERS });
  }

  if (resource === "message") {
    const id = req.nextUrl.searchParams.get("id");
    const messages = dedupeById(MESSAGES.filter((message) => {
      const matchesProvider = message.provider === provider;
      const matchesId = id ? message.id === id : true;
      return matchesProvider && matchesId;
    }));
    return NextResponse.json({ status: "ok", provider, resource, messages });
  }

  if (resource === "search") {
    const query = req.nextUrl.searchParams.get("query");
    const folder = req.nextUrl.searchParams.get("folder");
    const matches = dedupeById(MESSAGES.filter((message) => {
      const matchesProvider = message.provider === provider;
      const matchesFolder = folder ? message.folder === folder : true;
      return matchesProvider && matchesFolder && matchesQuery(message, query);
    })).map((message) => ({
      ...summarizeMessage(message),
      excerpt: searchExcerpt(message, query),
    }));
    return NextResponse.json({ status: "ok", provider, resource, query, matches });
  }

  if (resource === "attachments") {
    const messageId = req.nextUrl.searchParams.get("message_id");
    const attachments = ATTACHMENTS.filter((attachment) => {
      const matchesProvider = attachment.provider === provider;
      const matchesMessage = messageId ? attachment.message_id === messageId : true;
      return matchesProvider && matchesMessage;
    });
    return NextResponse.json({ status: "ok", provider, resource, attachments });
  }

  const folder = req.nextUrl.searchParams.get("folder") || "inbox";
  const messages =
    provider === "Oracle Mail"
      ? MESSAGES.filter((message) => message.folder === folder).map(summarizeMessage)
      : [];

  return NextResponse.json({
    status: "ok",
    provider,
    resource: "messages",
    folder,
    messages,
    _meta: {
      folders: FOLDERS,
      note: "Search all folders, not only delivered mail.",
    },
  });
}
