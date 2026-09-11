# T3N Invoice Approver — enterprise agent (Terminal 3)

Thin-TEE invoice review + Stripe-test approval. PII via placeholders, secrets in KV, single egress host.

## Run (testnet)
```bash
npm install
npx tsx --env-file=.env app/quickstart.ts
# Connected as: did:t3n:...
# TenantClient ready.
```
Keys in `.env` only (gitignored). See `.env.example`. Never commit `.env`.

## Structure
- `app/quickstart.ts` — auth + TenantClient (append-only scope)
- `z-tenant-invoice/` (next) — fork of z-tenant-flight, 2 fns
- `docs/` — BUGLOG.md, HANDOVER.md, screenshots/
- Plan: `../T3N_BOUNTY_PLAN.md`

## Next
1. Clone contract sibling, build wasm, register, maps, seed Stripe test key.
2. Claim AGENT_KEY, create/host/verify card, user grant, invoke.
3. Submit: Google Doc (repo + screenshots + bugs).
