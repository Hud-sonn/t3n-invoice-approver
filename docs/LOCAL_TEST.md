# Local test (safe order — do NOT re-run register blindly)

Re-running `app/register.ts` mints a NEW contract_id and stales map ACLs. Only re-register on version bump, then re-run setup-maps.

## 1. One-time (done)
- `npx tsx --env-file=.env app/quickstart.ts` → `Connected as: did:t3n:...` + `TenantClient ready.`
- `cargo build --target wasm32-wasip2 --release` → `z_tenant_flight.wasm` (~199K)
- `cargo test --lib --target x86_64-unknown-linux-gnu` → 7 pass
- `npx tsx --env-file=.env app/register.ts` → contract_id 987 (saved docs/contract.json)
- `npx tsx --env-file=.env app/setup-maps.ts` → secrets/invoices/audit + ACLs + placeholders

## 2. Repeatable checks (safe)
```bash
ls -lh z-tenant-invoice/target/wasm32-wasip2/release/*.wasm
cat docs/contract.json
npx tsx --env-file=.env app/quickstart.ts
npx tsx --env-file=.env.agent app/whoami-agent.ts
node --env-file=.env.agent node_modules/@terminal3/t3n-sdk/dist/cli/index.js whoami --env testnet
curl -s https://cn-api.sg.testnet.t3n.terminal3.io/api/agent-card/did:t3n:3281e12c1580a44fb0a5133e5522eb1a4e180bdc | head -c 300
git status --short; git check-ignore -v .env .env.agent
```
Idempotent (safe to re-run): `setup-maps.ts` (create→update ACLs), `delegate.ts` (merge self-grant + 401-proves-egress call).

## 3. What 401 means
`search-offers → HTTP 401` with placeholder key = PASS (grant + egress + TEE exec work, fails closed). Real demo needs real Duffel/Stripe test key in `secrets` map.
