# Submission Doc Template (copy into public Google Doc, set Anyone-with-link)

Title: T3N Invoice Approver — useful enterprise agent, thin TEE, easy handover

1. Repo: <github-url> (public). Run: `npm install` → `npx tsx --env-file=.env app/quickstart.ts`.
2. What it does: `review-invoice` (no PII) + `approve-payment` (PII via placeholders, Stripe test). Single egress host, config limits, activity log. Why useful: finance teams approve without pasting bank keys into prompts.
3. Maintainability: Rust ~200 lines (2 fns), Node/Express + Postgres mirror, one `config.ts` for policy, versioned contract, `LOCAL_TEST.md` repeatable, `HANDOVER.md` running-vs-handover choice (prefer continue via startup program/listing).
4. Screenshots: paste 6 from SCREENSHOTS.md (keys redacted).
5. Bugs faced: paste BUGLOG.md table (request_ids where present).
6. Handover: continue running + handover steps from HANDOVER.md.
