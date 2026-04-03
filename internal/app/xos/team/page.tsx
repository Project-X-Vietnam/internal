import { TeamSection } from "@/components/team/TeamSection";

export const metadata = {
  title: "xOS",
  description: "Different paths. Same energy."
};

export default function TeamPage() {
  return (
    <main className="bg-black min-h-screen">
      <TeamSection />
    </main>
  );
}
