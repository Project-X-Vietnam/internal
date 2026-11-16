export const MILESTONES = [
  {
    id: 1,
    title: "Data Analysis",
    discipline: "Data Analyst",
    question: "What happened?",
    belief: "You are going the right way!",
    icon: "database",
  },
  {
    id: 2,
    title: "Automation",
    discipline: "Backend Engineer",
    question: "What does the world say?",
    belief: "Minh was framed.",
    icon: "git-branch",
  },
  {
    id: 3,
    title: "SWE Frontend",
    discipline: "Software Engineer",
    question: "What was hidden?",
    belief: "The victim knew he was going to die.",
    icon: "code",
  },
  {
    id: 4,
    title: "AI Interrogation",
    discipline: "AI Engineer",
    question: "Who is lying?",
    belief: "Kai may be alive.",
    icon: "bot",
  },
  {
    id: 5,
    title: "Cyber Break-in",
    discipline: "Security Engineer",
    question: "Can we reach the truth?",
    belief: "Catch Kai at dawn.",
    icon: "shield",
  },
] as const;

export const SUSPECTS = [
  {
    id: "kai",
    name: "Kai",
    fullName: "Đặng Vũ Khoa",
    role: "Founder / CEO",
    initial: "K",
    email: "kai.dang@oracle-labs.internal",
    phone: "0901-555-0101",
    simId: "SIM-4401",
    badgeId: "B-1001",
    office: "41F, Office 4101",
    district: "District 1",
    providerPreferences: [
      "Mail: Oracle Mail",
      "Public records: Oracle Press Archive, City Business Registry",
      "Ride hailing: Be",
    ],
    profile:
      "Founder of Oracle Labs and architect of THEIA. Brilliant, controlled, and unusually private about his family history.",
    m2Use:
      "Use the email domain and public archive trail when searching for THEIA's hidden message and background records.",
    backstory:
      "Kai built Oracle Labs around the idea that systems remember what people edit out. His own biography is the exception: early family details, school records, and old press mentions were gradually softened until only the founder myth remained. People close to him say he was not sentimental, but he kept private archives with a care that looked almost devotional.",
  },
  {
    id: "minh",
    name: "Minh",
    fullName: "Minh Trần",
    role: "CTO",
    initial: "M",
    email: "minh.tran@oracle-labs.internal",
    phone: "0908-222-3344",
    simId: "SIM-4402",
    badgeId: "B-1002",
    office: "38F, Engineering",
    district: "District 1",
    providerPreferences: [
      "Ride hailing: Grab, Be",
      "Telecom: Viettel",
      "Maps: VMap",
    ],
    profile:
      "Kai's technical partner for nine years. He had motive on paper: a termination action and equity dilution both pointed at him.",
    m2Use:
      "Use Minh's phone and SIM id to query ride logs, telecom pings, and the distance check.",
    backstory:
      "Minh was the rare engineer Kai trusted enough to argue with in public. Their fights were sharp, technical, and usually productive until the board started treating Minh as expendable. He lives through devices, logs, and systems, but the night of the incident those systems begin to disagree with each other. In this case, identity records are not the same thing as bodies.",
  },
  {
    id: "andy",
    name: "Andy",
    fullName: "Andy Đức Lê",
    role: "Co-founder",
    initial: "A",
    email: "andy.le@oracle-labs.internal",
    phone: "0912-777-8899",
    simId: "SIM-4403",
    badgeId: "B-1003",
    office: "40F, Operations",
    district: "Thảo Điền",
    providerPreferences: [
      "Ride hailing: Xanh SM",
      "Banking: Vietcombank, Cayman NatWest",
      "Mail: Outlook",
    ],
    profile:
      "Co-founder, operator, public face during launch week. Calm under pressure, careful with money, and close enough to Kai to know his habits.",
    m2Use:
      "Use his name and district when checking banking records and the external money trail.",
    backstory:
      "Andy understands the company as a machine of contracts, favors, investors, and carefully timed explanations. He can make any payment sound operational and any crisis sound temporary. During launch week he was calm enough to comfort the team, but several financial threads bend toward him before bending away again, as if someone expected the paper trail to become confusing.",
  },
  {
    id: "bao",
    name: "Bảo",
    fullName: "Bảo Nguyễn",
    role: "Head of Security",
    initial: "B",
    email: "bao.nguyen@oracle-labs.internal",
    phone: "0904-555-4455",
    simId: "SIM-4404",
    badgeId: "B-1004",
    office: "2F, Security",
    district: "District 7",
    providerPreferences: [
      "Ride hailing: Grab",
      "Telecom: VinaPhone",
      "Maps: VMap",
    ],
    profile:
      "Owns facilities, door controllers, badge exceptions, and response protocols. Most people only notice him after something has gone wrong.",
    m2Use:
      "Use his badge and security role when interpreting whether a badge event proves a person's location.",
    backstory:
      "Bảo joined before Oracle Labs had a formal security department, when access control meant trust, spare keys, and whoever answered the phone at midnight. He knows every camera dead zone, maintenance exception, and badge rule because he wrote half of them. Nothing about his access looks unusual on paper, which is exactly why it matters when the hour is wrong.",
  },
  {
    id: "linh",
    name: "Linh",
    fullName: "Linh Phạm",
    role: "Head of Product",
    initial: "L",
    email: "linh.pham@oracle-labs.internal",
    phone: "0903-111-2233",
    simId: "SIM-4405",
    badgeId: "B-1005",
    office: "35F, Product",
    district: "District 3",
    providerPreferences: [
      "Ride hailing: Grab",
      "Telecom: VinaPhone",
      "Mail: Google Workspace",
    ],
    profile:
      "Product lead and Kai's former fiancée. Knows how Kai presents himself in public, and what changes when he thinks no one is watching.",
    m2Use:
      "Use her phone and badge trail as a comparison point for lobby versus office presence.",
    backstory:
      "Linh helped turn THEIA from Kai's obsession into a product people could understand. Their engagement ended quietly, but not cleanly; the company learned to pretend private history did not affect launch decisions. She notices changes in Kai's behavior faster than anyone admits, and some of her strongest evidence is the kind people hesitate to say out loud.",
  },
  {
    id: "phuc",
    name: "Phúc",
    fullName: "Phúc Hoàng",
    role: "Board Chair",
    initial: "P",
    email: "phuc.hoang@oracle-labs.internal",
    phone: "0909-666-5544",
    simId: "SIM-4406",
    badgeId: "B-1006",
    office: "Board, external",
    district: "Thảo Điền",
    providerPreferences: [
      "Ride hailing: Be",
      "Banking: Vietcombank, Cayman NatWest",
      "Airline: Vietnam Airlines",
    ],
    profile:
      "Lead investor with enough leverage to benefit from a leadership crisis. His money moves faster than his public statements.",
    m2Use:
      "Use his name when tracing offshore wires and separating fraud from physical opportunity.",
    backstory:
      "Phúc is patient in public and ruthless in term sheets. He has backed Kai for years, but his loyalty is to control, valuation, and the board seat that lets him survive every version of the company. The money around him is real enough to matter, yet money can point at guilt without proving who stood in the room.",
  },
  {
    id: "trang",
    name: "Trang",
    fullName: "Trang Vũ",
    role: "Executive Assistant",
    initial: "T",
    email: "trang.vu@oracle-labs.internal",
    phone: "0907-333-4455",
    simId: "SIM-4407",
    badgeId: "B-1007",
    office: "41F, Executive desk",
    district: "District 4",
    providerPreferences: [
      "Mail: Oracle Mail",
      "Calendar: Google Workspace",
      "Ride hailing: Xanh SM",
    ],
    profile:
      "Kai's executive assistant. She edits calendars, receives last-minute instructions, and knows which version of a schedule was official.",
    m2Use:
      "Use her calendar edits as context when testing whether a person was acting with knowledge or just following instructions.",
    backstory:
      "Trang has spent years translating Kai's abrupt decisions into calendar invites, apology emails, and plausible timelines. She knows which meetings were official, which ones were theater, and which ones were moved because Kai was afraid. A changed meeting can be a clue even when the person who changed it is telling the truth.",
  },
  {
    id: "hanh",
    name: "Dr. Hạnh",
    fullName: "Dr. Hạnh Lý",
    role: "Company Physician",
    initial: "H",
    email: "hanh.ly@oracle-labs.internal",
    phone: "0902-222-1188",
    simId: "SIM-4408",
    badgeId: "B-1008",
    office: "Medical consult room",
    district: "District 5",
    providerPreferences: [
      "Mail: Outlook",
      "Telecom: MobiFone",
      "Public records: City Business Registry",
    ],
    profile:
      "Company physician under strict confidentiality rules. Her notes rarely appear in operational data, but absence is not the same as irrelevance.",
    m2Use:
      "Use her name as a medical context anchor after hidden-system evidence surfaces.",
    backstory:
      "Dr. Hạnh keeps her distance from company politics by being painfully precise. That precision makes her useful and dangerous: she notices when medical language is too neat, when a file is missing a normal detail, and when a body does not quite match the story attached to it. Her silence is professional, not necessarily empty.",
  },
  {
    id: "son",
    name: "Sơn",
    fullName: "Sơn Phan",
    role: "Junior Engineer",
    initial: "S",
    email: "son.phan@oracle-labs.internal",
    phone: "0911-888-9900",
    simId: "SIM-4409",
    badgeId: "B-1009",
    office: "38F, Engineering",
    district: "Thủ Đức",
    providerPreferences: [
      "Mail: Google Workspace",
      "Telecom: MobiFone",
      "Ride hailing: Be",
    ],
    profile:
      "Junior engineer with access to ordinary systems and a habit of printing things nobody asked him to print.",
    m2Use:
      "Use his activity as a control case: late work can look suspicious without being central.",
    backstory:
      "Sơn is junior enough to be ignored and observant enough to know when that is useful. He fixes printers, watches deploy logs, and hears senior people speak freely because they forget he is there. A small file left in the right place can be help, fear, or both.",
  },
  {
    id: "kien",
    name: "???",
    fullName: "Unknown Subject",
    role: "Unidentified",
    initial: "?",
    email: "—",
    phone: "—",
    simId: "—",
    badgeId: "—",
    office: "Unknown",
    district: "Unknown",
    providerPreferences: ["No known accounts"],
    profile:
      "A shadow in the evidence. Witness reports describe a second figure resembling Kai. Medical records contradict the official story. Someone is missing from this board.",
    m2Use:
      "This person has no known digital footprint in any provider system.",
    backstory:
      "The evidence keeps pointing at a gap: Linh saw two Kais three weeks before the incident. Dr. Hạnh's examination notes a body that does not match the medical history on file. A quiet family detail surfaced in the public archives. These threads converge on someone with no employee record, no badge, and no name in any Oracle Labs system — but who may be the most important figure in the case.",
  },
] as const;

export type Suspect = (typeof SUSPECTS)[number];

export type MilestoneStatus = "locked" | "active" | "solved";

const SUSPECT_REVEAL_CLUES: Record<string, string> = {
  kien: "twin_seed",
};

export function getVisibleSuspects(
  clueTokens: { key: string; value: string }[]
): Suspect[] {
  const clueKeys = new Set(clueTokens.map((t) => t.key));
  return SUSPECTS.filter((s) => {
    const revealClue = SUSPECT_REVEAL_CLUES[s.id];
    if (!revealClue) return true;
    return clueKeys.has(revealClue);
  });
}

export function getMilestoneStatus(
  milestoneId: number,
  currentMilestone: number,
  solvedMilestones: number[]
): MilestoneStatus {
  if (solvedMilestones.includes(milestoneId)) return "solved";
  if (milestoneId === currentMilestone) return "active";
  return "locked";
}
