import { Input, Textarea } from "@/components/ui/input";

const LABEL = "block text-sm font-medium";
const HINT = "type-meta mt-1.5";

type ContactDefaults = {
  name?: string;
  email?: string | null;
  title?: string | null;
  location?: string | null;
  expertise?: string;
  note?: string | null;
};

/**
 * The admin-editable identity of a network contact. Accounts never render this —
 * their identity comes from Google and /me; the only thing an admin writes on an
 * account is the note.
 */
export function ContactFields({
  idPrefix,
  defaults = {},
}: {
  idPrefix: string;
  defaults?: ContactDefaults;
}) {
  const id = (field: string) => `${idPrefix}-${field}`;

  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div>
        <label className={LABEL} htmlFor={id("name")}>
          Name
        </label>
        <Input
          id={id("name")}
          name="name"
          required
          defaultValue={defaults.name ?? ""}
          placeholder="Nguyễn Minh Anh"
          className="mt-1.5"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor={id("email")}>
          Email
        </label>
        <Input
          id={id("email")}
          name="email"
          type="email"
          defaultValue={defaults.email ?? ""}
          placeholder="optional"
          className="mt-1.5"
          aria-describedby={id("email-hint")}
        />
        <p id={id("email-hint")} className={HINT}>
          If they ever sign in with it, this record becomes their account — history intact.
        </p>
      </div>

      <div>
        <label className={LABEL} htmlFor={id("title")}>
          Title
        </label>
        <Input
          id={id("title")}
          name="title"
          defaultValue={defaults.title ?? ""}
          placeholder="Head of Design at VNG"
          className="mt-1.5"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor={id("location")}>
          Location
        </label>
        <Input
          id={id("location")}
          name="location"
          defaultValue={defaults.location ?? ""}
          placeholder="Ho Chi Minh City"
          className="mt-1.5"
        />
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor={id("expertise")}>
          Expertise
        </label>
        <Input
          id={id("expertise")}
          name="expertise"
          defaultValue={defaults.expertise ?? ""}
          placeholder="Product design, Fundraising"
          className="mt-1.5"
          aria-describedby={id("expertise-hint")}
        />
        <p id={id("expertise-hint")} className={HINT}>
          Comma-separated — the same tags members search the directory by.
        </p>
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor={id("note")}>
          Note
        </label>
        <Textarea
          id={id("note")}
          name="note"
          rows={2}
          defaultValue={defaults.note ?? ""}
          placeholder="Context on the person — write it as if they might read it."
          className="mt-1.5"
          aria-describedby={id("note-hint")}
        />
        <p id={id("note-hint")} className={HINT}>
          Admins only — members never see this.
        </p>
      </div>
    </div>
  );
}

type OrganizationDefaults = {
  name?: string;
  website?: string | null;
  note?: string | null;
};

export function OrganizationFields({
  idPrefix,
  defaults = {},
}: {
  idPrefix: string;
  defaults?: OrganizationDefaults;
}) {
  const id = (field: string) => `${idPrefix}-${field}`;

  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div>
        <label className={LABEL} htmlFor={id("name")}>
          Name
        </label>
        <Input
          id={id("name")}
          name="name"
          required
          defaultValue={defaults.name ?? ""}
          placeholder="VNG Corporation"
          className="mt-1.5"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor={id("website")}>
          Website
        </label>
        <Input
          id={id("website")}
          name="website"
          defaultValue={defaults.website ?? ""}
          placeholder="https://…"
          className="mt-1.5"
        />
      </div>

      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor={id("note")}>
          Note
        </label>
        <Textarea
          id={id("note")}
          name="note"
          rows={2}
          defaultValue={defaults.note ?? ""}
          placeholder="How the relationship stands."
          className="mt-1.5"
          aria-describedby={id("note-hint")}
        />
        <p id={id("note-hint")} className={HINT}>
          Admins only — members never see this.
        </p>
      </div>
    </div>
  );
}
