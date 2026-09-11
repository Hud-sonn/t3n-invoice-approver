# BUGLOG — append every bug faced (judges score this)

| Date | Step | Symptom | request_id | Cause | Fix | Docs link |
|------|------|---------|------------|-------|-----|-----------|
| 2026-09-11 | Phase 0 auth | `Missing T3N_API_KEY` | n/a | .env not auto-loaded; `set -a` blocked by runner | Use `npx tsx --env-file=.env app/quickstart.ts` (Node 20+ native) | quickstart / running-code-samples |
| 2026-09-11 | Phase 0 install | `npm install` timeout 120s | n/a | full install + audit slow | Split install: `npm install @terminal3/t3n-sdk@5.2.0 tsx --no-audit --no-fund` (21s) | — |
| 2026-09-11 | Clone | `git clone` timeout 120s, no dir | n/a | full history large | `git clone --depth 1` + `git ls-remote HEAD` check first | — |
| 2026-09-11 | Rust | `rustc 1.75`, no rustup, no wasm target | n/a | system Rust too old for wasip2 | Install rustup stable → 1.98.1, `rustup target add wasm32-wasip2` | set-up-dev-env / build-contract |
| 2026-09-11 | Build | `cargo build` OK 1m26s, 199K wasm | n/a | — | Verified `target/wasm32-wasip2/release/z_tenant_flight.wasm` | build-contract |
| 2026-09-11 | Test | `cargo test --lib` tried to exec wasm, perm denied | n/a | `.cargo/config target=wasm32-wasip2` | `cargo test --lib --target x86_64-unknown-linux-gnu` → 7 pass | — |
| 2026-09-11 | Register | Registered invoice-contracts v0.4.1 | n/a | — | `z:3281…:invoice-contracts` contract_id 987, saved docs/contract.json | register-contract |
| 2026-09-11 | Maps | Created secrets/invoices/audit private + ACLs to 987, seeded placeholders, entryGet verified present (value hidden) | n/a | Re-register makes old ACLs stale | `maps.create` then `maps.update{ writers/readers:{ only:[987] } }`; control-plane `entrySet` bypasses ACL | create-kv-maps / seed-api-key |
| 2026-09-11 | Delegate+Invoke | Self-grant written, `search-offers` reached Duffel → HTTP 401 (placeholder key) | n/a | NOT a bug — proves grant+egress+TEE exec work; fails closed on fake key | Replace `secrets/duffel_api_key` (or stripe key for invoice logic) with real test key before demo | member-delegation / invoke-contract |
| 2026-09-11 | Agent key | 2nd key saved to gitignored `.env.agent`; `whoami` (SDK+CLI) returns SAME DID as tenant, balance healthy | n/a | Same Google account → same DID, second credential (not separate agent). For distinct agent DID use +alias SSO | Proceed as self-agent (2nd credential) for submission; claim alias DID for full separation bonus | register-agent / member-delegation |
| 2026-09-11 | Agent card | `create-card` 735B + `host-card` OK, public curl serves card; `registry` shows `agent:(none)` | n/a | URI record vs body publish are separate steps / eventual consistency | Curl endpoint is submission proof; optionally `set-card --uri` later | register-agent |
| | | | | | | |

Rule: on bare HTTP 500 save request_id, retry once, re-check egress grant + map ACL before code changes. Report reproducibles to t.me/terminal3developer with request_id.
