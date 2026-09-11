import { readFileSync } from "node:fs";
import {
  T3nClient,
  setEnvironment,
  getNodeUrl,
  loadWasmComponent,
  fetchTrustedManifest,
  eth_get_address,
  metamask_sign,
  createEthAuthInput,
  getContractVersion,
} from "@terminal3/t3n-sdk";

setEnvironment("testnet");
const T3N_API_KEY = process.env.T3N_API_KEY;
if (!T3N_API_KEY) throw new Error("Missing T3N_API_KEY");

const wasmComponent = await loadWasmComponent();
const address = eth_get_address(T3N_API_KEY);
const userClient = new T3nClient({
  trustAnchor: await fetchTrustedManifest("testnet"),
  wasmComponent,
  handlers: { EthSign: metamask_sign(address, undefined, T3N_API_KEY) },
});
await userClient.handshake();
const auth = await userClient.authenticate(createEthAuthInput(address));
const userDid = auth.value;
console.log("User DID:", userDid);

const meta = JSON.parse(readFileSync(new URL("../docs/contract.json", import.meta.url), "utf8"));
const TENANT_CONTRACT: string = meta.name;
console.log("Contract:", TENANT_CONTRACT);

try {
  const cur = await userClient.getMemberDelegation();
  console.log("Current delegation rows:", JSON.stringify(cur).slice(0, 500));
} catch (e: any) {
  console.log("getMemberDelegation:", String(e?.message ?? e).slice(0, 300));
}

const version = await getContractVersion(getNodeUrl(), TENANT_CONTRACT);
console.log("Contract version:", version);

// Self-grant so direct calls work without a separate agent yet.
// Scopes: tenant contract uses no org-data scopes -> [].
await userClient.updateMemberDelegation({
  grantee: userDid,
  contract_id: TENANT_CONTRACT,
  functions: ["search-offers", "book-offer"],
  scopes: [],
  allowed_hosts: ["api.duffel.com", "api.stripe.com"],
});
console.log("Self-grant written.");

// Prove invoke path with a no-PII call shape (will fail closed on placeholder
// keys, but egress_denied vs API-key error tells us grant works).
try {
  const out: any = await userClient.executeAndDecode({
    contract_id: TENANT_CONTRACT,
    contract_version: version,
    function_name: "search-offers",
    input: { origin: "LHR", destination: "JFK", departure_date: "2026-07-15", cabin_class: "economy", adult_count: 1 },
  });
  console.log("search-offers OK:", JSON.stringify(out).slice(0, 400));
} catch (e: any) {
  console.log("search-offers result:", String(e?.message ?? e).slice(0, 500));
}
