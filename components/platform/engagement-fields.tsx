import { SelectField } from "@/components/platform/select-field";
import { Input, Textarea } from "@/components/ui/input";
import { ROLE_LABELS } from "@/lib/network";

const LABEL = "block text-sm font-medium";
const HINT = "type-meta mt-1.5";

/**
 * The fields an engagement form posts, shared by /me (own history) and the
 * admin network pages. Server-renderable — plain inputs, no client state.
 *
 * `withNote` is the admin difference: notes are admin-only in both directions,
 * so the self-service form doesn't even render the field, and the self-service
 * action wouldn't read it if it did.
 */
export function EngagementFields({
  programs,
  departments,
  organizationNames,
  withNote,
  idPrefix,
}: {
  programs: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  organizationNames: string[];
  withNote?: boolean;
  /** Keeps label/for pairs and the datalist unique when a page holds two forms. */
  idPrefix: string;
}) {
  const id = (field: string) => `${idPrefix}-${field}`;
  const datalist = id("organizations");

  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div>
        <label className={LABEL} htmlFor={id("role")}>
          Role
        </label>
        <div className="mt-1.5">
          <SelectField
            id={id("role")}
            name="role"
            defaultValue=""
            placeholder="Pick a role"
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor={id("title")}>
          Title
        </label>
        <Input
          id={id("title")}
          name="title"
          placeholder="President · Judge, final round · session name"
          className="mt-1.5"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor={id("startYear")}>
          Year
        </label>
        <Input
          id={id("startYear")}
          name="startYear"
          type="number"
          inputMode="numeric"
          placeholder="2026"
          className="mt-1.5"
          aria-describedby={id("startYear-hint")}
        />
        <p id={id("startYear-hint")} className={HINT}>
          When it started — or the one year it happened.
        </p>
      </div>

      <div>
        <label className={LABEL} htmlFor={id("endYear")}>
          End year
        </label>
        <Input
          id={id("endYear")}
          name="endYear"
          type="number"
          inputMode="numeric"
          placeholder=""
          className="mt-1.5"
          aria-describedby={id("endYear-hint")}
        />
        <p id={id("endYear-hint")} className={HINT}>
          Leave blank while it&rsquo;s ongoing.
        </p>
      </div>

      <div>
        <label className={LABEL} htmlFor={id("programId")}>
          Program
        </label>
        <div className="mt-1.5">
          <SelectField
            id={id("programId")}
            name="programId"
            defaultValue=""
            placeholder="—"
            options={programs.map((program) => ({ value: program.id, label: program.name }))}
          />
        </div>
        <p className={HINT}>A program engagement belongs to that year&rsquo;s edition.</p>
      </div>

      <div>
        <label className={LABEL} htmlFor={id("departmentId")}>
          Department
        </label>
        <div className="mt-1.5">
          <SelectField
            id={id("departmentId")}
            name="departmentId"
            defaultValue=""
            placeholder="—"
            options={departments.map((department) => ({
              value: department.id,
              label: department.name,
            }))}
          />
        </div>
      </div>

      <div className={withNote ? undefined : "sm:col-span-2"}>
        <label className={LABEL} htmlFor={id("organization")}>
          Organization
        </label>
        <Input
          id={id("organization")}
          name="organization"
          list={datalist}
          placeholder="VNG"
          className="mt-1.5"
          aria-describedby={id("organization-hint")}
        />
        <datalist id={datalist}>
          {organizationNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <p id={id("organization-hint")} className={HINT}>
          Who they represented or came from. Required for partners.
        </p>
      </div>

      {withNote && (
        <div>
          <label className={LABEL} htmlFor={id("note")}>
            Note
          </label>
          <Textarea
            id={id("note")}
            name="note"
            rows={2}
            placeholder="How it went, and whether we'd work with them again."
            className="mt-1.5"
            aria-describedby={id("note-hint")}
          />
          <p id={id("note-hint")} className={HINT}>
            Admins only — members never see this.
          </p>
        </div>
      )}
    </div>
  );
}
