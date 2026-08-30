import { Section } from "@/components/platform/page";
import { SelectField } from "@/components/platform/select-field";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ResourceKind, ResourceStatus } from "@/lib/generated/prisma/enums";

const LABEL = "block text-sm font-medium";
const HINT = "type-meta mt-1.5";

type Editable = {
  slug: string;
  title: string;
  summary: string | null;
  kind: ResourceKind;
  status: ResourceStatus;
  body: string | null;
  url: string | null;
  byline: string | null;
  collectionId: string | null;
  sortOrder: number;
};

/**
 * The create and edit form, shared so the two surfaces can't drift apart.
 *
 * Both the body and the destination field are always visible rather than
 * swapped by the kind picker. That keeps this a server component with no client
 * JavaScript, and it means switching a half-written doc to a link and back
 * doesn't make the writing look like it vanished — the action keeps both
 * columns either way.
 */
export function ResourceForm({
  action,
  resource,
  collections,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  resource?: Editable;
  collections: { id: string; name: string }[];
  submitLabel: string;
}) {
  return (
    <form action={action}>
      <Section label="What it is">
        <div className="mt-3 grid max-w-2xl gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={LABEL} htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={resource?.title ?? ""}
              placeholder="A letter from the President"
              className="mt-1.5"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={LABEL} htmlFor="summary">
              Summary
            </label>
            <Textarea
              id="summary"
              name="summary"
              rows={2}
              defaultValue={resource?.summary ?? ""}
              placeholder="One line, shown under the title in the index."
              className="mt-1.5"
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="kind">
              Kind
            </label>
            <div className="mt-1.5">
              <SelectField
                id="kind"
                name="kind"
                defaultValue={resource?.kind ?? ResourceKind.DOC}
                options={[
                  { value: ResourceKind.DOC, label: "Document — written here" },
                  { value: ResourceKind.LINK, label: "Link — lives elsewhere" },
                ]}
              />
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="collectionId">
              Collection
            </label>
            <div className="mt-1.5">
              <SelectField
                id="collectionId"
                name="collectionId"
                defaultValue={resource?.collectionId ?? ""}
                placeholder="—"
                options={[
                  { value: "", label: "—" },
                  ...collections.map((collection) => ({
                    value: collection.id,
                    label: collection.name,
                  })),
                ]}
              />
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="byline">
              Byline
            </label>
            <Input
              id="byline"
              name="byline"
              defaultValue={resource?.byline ?? ""}
              placeholder="Liam Lee · President"
              className="mt-1.5"
              aria-describedby="byline-hint"
            />
            <p id="byline-hint" className={HINT}>
              Free text, not a directory link — attribution outlives the account.
            </p>
          </div>

          <div>
            <label className={LABEL} htmlFor="slug">
              Slug
            </label>
            <Input
              id="slug"
              name="slug"
              defaultValue={resource?.slug ?? ""}
              placeholder="welcome-letter"
              className="mt-1.5"
              aria-describedby="slug-hint"
            />
            <p id="slug-hint" className={HINT}>
              Blank derives it from the title. Changing it breaks old links.
            </p>
          </div>
        </div>
      </Section>

      <Section label="Content">
        <div className="mt-3 max-w-2xl space-y-4">
          <div>
            <label className={LABEL} htmlFor="url">
              Destination
            </label>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={resource?.url ?? ""}
              placeholder="https://…"
              className="mt-1.5"
              aria-describedby="url-hint"
            />
            <p id="url-hint" className={HINT}>
              Used when the kind is Link. Members go straight there from the index.
            </p>
          </div>

          <div>
            <label className={LABEL} htmlFor="body">
              Body
            </label>
            <Textarea
              id="body"
              name="body"
              rows={22}
              defaultValue={resource?.body ?? ""}
              placeholder={"## A heading\n\nA paragraph with **emphasis** and a [link](https://…).\n\n> A callout.\n\n- A list item"}
              className="mt-1.5 font-mono text-[0.8125rem] leading-relaxed"
              aria-describedby="body-hint"
            />
            <p id="body-hint" className={HINT}>
              Markdown: ## headings, &gt; callouts, - lists, --- dividers, **bold**, *italic*,
              [links](url). A line that is only a YouTube URL becomes a player.
            </p>
          </div>
        </div>
      </Section>

      <Section label="Publishing">
        <div className="mt-3 grid max-w-2xl gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="status">
              Status
            </label>
            <div className="mt-1.5">
              <SelectField
                id="status"
                name="status"
                defaultValue={resource?.status ?? ResourceStatus.DRAFT}
                options={[
                  { value: ResourceStatus.DRAFT, label: "Draft — only admins see it" },
                  { value: ResourceStatus.PUBLISHED, label: "Published — visible to members" },
                ]}
              />
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="sortOrder">
              Sort order
            </label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              step="1"
              defaultValue={resource?.sortOrder ?? 0}
              className="mt-1.5"
              aria-describedby="sort-hint"
            />
            <p id="sort-hint" className={HINT}>
              Low to high within a collection; ties fall back to title.
            </p>
          </div>
        </div>
      </Section>

      <div className="rule mt-14 flex items-center gap-3 pt-6">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
