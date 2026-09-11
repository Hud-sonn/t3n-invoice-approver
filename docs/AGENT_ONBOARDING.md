# Agent onboarding (needs 1 browser SSO — I can't do this for you)

You already have tenant key. Agent needs OWN key + credits (else InsufficientCreditError).

1. In browser, open https://go.terminal3.io/adk-community -> Sign in with Google (use +alias e.g. you+agent1@gmail.com for 2nd identity) -> copy the NEW agent API key (shown once).
2. Save it locally ONLY (never paste in chat / screenshots / repo):
```bash
printf 'T3N_API_KEY=<paste-agent-key>\n' > .env.agent
chmod 600 .env.agent
```
`.env.agent` is gitignored. Verify with `git check-ignore -v .env.agent`.
3. Tell me "agent key saved" (no value). I will run:
```bash
npx -y @terminal3/t3n-sdk whoami --env testnet  # via agent env
npx -y @terminal3/t3n-sdk agent create-card --did <AGENT_DID>
# edit agent-card.json (name: Invoice Approver, description, <16 KiB)
npx -y @terminal3/t3n-sdk agent host-card --file agent-card.json --env testnet
curl https://<node>/api/agent-card/<AGENT_DID>
```
4. Then I grant it: `updateMemberDelegation{ grantee: AGENT_DID, contract_id: z:...:invoice-contracts, functions: ["search-offers","book-offer"], scopes: [], allowed_hosts: ["api.duffel.com","api.stripe.com"] }` and invoke as agent.
