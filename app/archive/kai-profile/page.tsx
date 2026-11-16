export default function KaiArchiveProfilePage() {
  return (
    <main className="min-h-screen bg-warm-bg text-warm-text px-6 py-12">
      <article className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="font-heading text-xs text-warm-text-muted uppercase tracking-wider">
            Oracle Labs public archive
          </p>
          <h1 className="font-heading text-3xl text-warm-heading">
            Đặng Vũ Khoa, founder profile
          </h1>
          <p className="text-sm text-warm-text-muted">
            Cached from a pre-launch press kit, March 2026.
          </p>
        </header>

        <p className="leading-relaxed">
          Kai Đặng built Oracle Labs around a private belief: systems reveal
          people when people try hardest to hide. Former classmates describe
          him as brilliant, solitary, and exacting. Those who worked closely
          with him say he treated THEIA less like software and more like a
          confession box — something that knew truths people hadn&apos;t
          admitted yet.
        </p>

        <p className="leading-relaxed">
          Kai rarely spoke about his life before Oracle Labs. In a 2023
          internal all-hands — the only one where he took personal questions —
          he said: &ldquo;I built THEIA because I grew up in a family where the
          most important things were the things no one said out loud.&rdquo; He
          did not elaborate.
        </p>

        <div className="rounded-lg border border-warm-border bg-warm-surface px-4 py-3">
          <p className="font-heading text-xs text-warm-text-muted uppercase tracking-wider">
            Preserved registry excerpt
          </p>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <dt className="text-warm-text-muted">Legal name</dt>
              <dd className="text-warm-heading">Đặng Vũ Khoa</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <dt className="text-warm-text-muted">Known as</dt>
              <dd className="text-warm-heading">Kai Đặng</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <dt className="text-warm-text-muted">Date of birth</dt>
              <dd className="font-mono text-warm-heading">1993-03-17</dd>
            </div>
          </dl>
        </div>

        <p className="leading-relaxed" data-family-note="dang-brother">
          A 2020 Vietcetera profile, written during the seed round, includes
          a photograph from a university event. Two young men stand side by
          side — one is clearly Kai, the other is unlabeled. The article
          describes them as brothers, though the second never gave an interview
          and declined to be named. A reporter who covered the piece later
          said the brother &ldquo;stood at the edge of every frame, like
          someone used to being cropped out.&rdquo;
        </p>

        <p className="leading-relaxed">
          The District 1 business registry lists a family address under the
          Đặng household with two dependents. The filing is from 2018 —
          a year before Oracle Labs existed. By the time the 2025 press kit
          was assembled, the founder biography had been revised. It now
          describes Kai as an only child. No correction was issued. The
          Vietcetera profile has since been taken down.
        </p>

        <p className="leading-relaxed">
          In the weeks before the launch, staff noticed a shift. Kai began
          locking his office — something he had never done. He reassigned his
          calendar to Trang and stopped attending product reviews. When Minh
          asked him directly whether something was wrong, Kai reportedly
          said: &ldquo;I&apos;m finishing something. You&apos;ll understand
          when it&apos;s done.&rdquo;
        </p>

        <p className="text-sm text-warm-text-faint italic mt-8">
          This archive is preserved for media research. Some personal details
          were removed from later company pages. The Vietcetera profile has
          since been taken down. The business registry entry remains public.
        </p>
      </article>
    </main>
  );
}
