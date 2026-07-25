import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const seedPath = path.join(root, "public/data/m1-seed.sql");
const seedSql = fs.readFileSync(seedPath, "utf8");

const bannedSeedPhrases = [
  "This is actually Bảo",
  "using a CLONED badge",
  "THE FRAME:",
  "the splinter",
];

for (const phrase of bannedSeedPhrases) {
  assert(!seedSql.includes(phrase), `Seed leaks spoiler phrase: ${phrase}`);
}

const expectedTables = [
  "employees",
  "hr_directory",
  "device_registry",
  "badge_access",
  "phone_logs",
  "bank_transactions",
  "equity_ledger",
  "hr_actions",
  "system_events",
  "theia_call_log",
  "security_admin_log",
  "calendar_audit",
  "parking_gate",
  "wifi_sessions",
  "helpdesk_tickets",
  "printer_jobs",
  "visitor_registry",
  "git_activity",
  "cafeteria_purchases",
  "hvac_sensors",
];

for (const table of expectedTables) {
  assert(
    seedSql.includes(`CREATE TABLE ${table}`),
    `Missing M1 table: ${table}`
  );
}

const SQL = await initSqlJs({
  locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
});
const db = new SQL.Database();
db.run(seedSql);

const starterQueries = [
  "SELECT * FROM employees;",
  "SELECT *, datetime(ts_utc, '+7 hours') AS ts_local FROM badge_access WHERE ts_utc BETWEEN '2026-03-17 13:00:00' AND '2026-03-17 17:00:00' ORDER BY ts_utc;",
  "SELECT ba.*, datetime(ba.ts_utc, '+7 hours') AS ts_local, e.name FROM badge_access ba JOIN device_registry dr ON ba.badge_id = dr.badge_id JOIN employees e ON dr.emp_id = e.emp_id WHERE ba.floor = 41 ORDER BY ba.ts_utc;",
  "SELECT bt.*, hd.emp_id, e.name FROM bank_transactions bt JOIN hr_directory hd ON bt.tax_no = hd.tax_no JOIN employees e ON hd.emp_id = e.emp_id WHERE bt.amount > 50000000 ORDER BY bt.amount DESC;",
];

for (const query of starterQueries) {
  db.exec(query);
}

const sourceChecks = [
  {
    file: "lib/clues.ts",
    phrases: [
      "incident_date",
      "kai_signature",
      "kai_birthdate",
      "19930317",
      "password_place",
      "Bitexco",
      "dashboard_link",
      "validateMilestoneSubmission",
      "hasM5Prerequisites",
    ],
  },
  {
    file: "app/api/m3/reveal/route.ts",
    phrases: ["m3_console_arg", "DEAD-MAN'S SWITCH"],
  },
  {
    file: "app/api/m5/verify-password/route.ts",
    phrases: ["ciphertextB64", "hasM5Prerequisites"],
  },
  {
    file: "app/archive/kai-profile/page.tsx",
    phrases: ["Date of birth", "1993-03-17"],
  },
  {
    file: "lib/prologue.ts",
    phrases: ["inside Bitexco"],
  },
  {
    file: "ANSWER_KEY.md",
    phrases: ["DangVuKhoa_ORACLE-EYES_ocxetiB_19930317"],
  },
];

for (const check of sourceChecks) {
  const content = fs.readFileSync(path.join(root, check.file), "utf8");
  for (const phrase of check.phrases) {
    assert(content.includes(phrase), `${check.file} missing ${phrase}`);
  }
}

console.log("THEIA smoke checks passed.");
