# Screenshots (6 required — redact keys, DIDs ok truncated)

Submission = public Google Doc + public GitHub + screenshots + bugs. Hide full `T3N_API_KEY`/`AGENT_KEY` in every shot (show `export` with `***`, or `--env-file` command only). DID `did:t3n:3281…bdc` and contract_id 987 are safe to show.

1. `quickstart` → highlight `Connected as: did:t3n:...` + `TenantClient ready.`
2. Build → `cargo build` Finished + `ls -lh *.wasm` (199K) in one shot.
3. `register` → `Registered: z:3281…:invoice-contracts contract_id: 987` + `docs/contract.json` cat.
4. `setup-maps` → `maps.create ok` x3 + `ACLs -> 987` + `entryGet ... present (value hidden)`.
5. `delegate` → `Self-grant written.` + `HTTP 401` line (caption: proves egress, fails closed on placeholder).
6. Card → `host-card` URL line + browser/curl showing served `agent-card.json` (`Invoice Approver`).

Bonus: `git status` showing `.env` absent (ignored) + `agent registry` output. Never screenshot `.env` contents, full keys, or Stripe/Duffel real keys.
