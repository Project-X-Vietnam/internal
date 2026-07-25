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
