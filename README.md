# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review — 2026-10-30

Added a signed review at `src/routes/kb/incidents/4471-review/+page.svx`.
The desk-facing rendered page is `build/kb/incidents/4471-review/index.html`, with its assets in `build/_app/`.
Serve the whole `build/` folder over HTTP so the original `/kb/` links and interactive components work.

```bash
npm ci
npm run check
npm run build
npm run preview
```

Open `http://localhost:4173/kb/incidents/4471-review/`. The original export and accepted decision are preserved.
Counts are computed from the export's unique report IDs and supplied tenant-aware classifier: 379 parser, 33 hint.
The parser count includes five anomalous reports explicitly retained for investigation, not a proven third cause.
This is the course's fictional support data dated 4 October 2026, not a current production incident.
