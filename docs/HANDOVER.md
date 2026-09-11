# HANDOVER / RUNNING CHOICE (include in Google Doc submission)

**Choice:** Continue running via startup program + listing page (preferred), with handover-ready docs below.

Why continue: invoice approver needs operator Stripe keys + delegation upkeep — low cost if we run it, higher friction to transfer cold.

## Handover (if judges prefer Terminal 3 maintains)
1. Rotate keys: new tenant `T3N_API_KEY` via claim page, new Stripe test→prod key in `z:<tid>:secrets` via `map-entry-set`.
2. Re-register contract: bump `version`, `contracts.register`, record new `contract_id`, re-grant map ACLs (`readers`/`writers`) + user `updateMemberDelegation{ functions: ["review-invoice","approve-payment"], allowed_hosts: ["api.stripe.com"] }`.
3. Agent: claim fresh `AGENT_KEY`, `t3n agent create-card` + `host-card`, verify `/api/agent-card/<did>`, re-issue delegation.
4. Hand over: repo + `.env.example` + contract_id/version log + `getActivityLog()` export + Stripe dashboard + delegation JSON.
5. Revoke old keys/grants (`grants: []` to revoke), confirm `TenantClient ready` + 1 test approve on testnet.

## Running (weekly, ~30 min)
- Check credits (`getUsage`), activity log anomalies, Stripe test failures, delegation expiries (`window`), SDK 5.2.0 → latest changelog.
- All config (limits, allowlist, vendor list) in one `config.ts` — no Rust change for policy tweaks.
