import { redirect } from "next/navigation";

/**
 * Kept as a redirect rather than deleted. `/pending` was where unapproved
 * members landed before the onboarding flow existed, so it is in bookmarks and
 * in at least one sign-in email; /welcome is a superset of what it showed.
 */
export default function PendingPage() {
  redirect("/welcome");
}
