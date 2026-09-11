import { readFileSync } from "node:fs";
import {
  T3nClient,
  TenantClient,
  setEnvironment,
  getNodeUrl,
  loadWasmComponent,
  fetchTrustedManifest,
  eth_get_address,
  metamask_sign,
  createEthAuthInput,
} from "@terminal3/t3n-sdk";

setEnvironment("testnet");
const T3N_API_KEY = process.env.T3N_API_KEY;
if (!T3N_API_KEY) throw new Error("Missing T3N_API_KEY");

const wasmComponent = await loadWasmComponent();
const address = eth_get_address(T3N_API_KEY);
const t3n = new T3nClient({
  trustAnchor: await fetchTrustedManifest("testnet"),
  wasmComponent,
  handlers: { EthSign: metamask_sign(address, undefined, T3N_API_KEY) },
});
await t3n.handshake();
const did = await t3n.authenticate(createEthAuthInput(address));
const tenantDid = did.value;
const tenant = new TenantClient({ t3n, baseUrl: getNodeUrl(), tenantDid });
await tenant.tenant.me();

const contractMeta = JSON.parse(
  readFileSync(new URL("../docs/contract.json", import.meta.url), "utf8")
);
const contractId: number = contractMeta.contract_id;
console.log("Using contract_id:", contractId);

for (const tail of ["secrets", "invoices", "audit"]) {
  try {
    await tenant.maps.create({
      tail,
      visibility: "private",
      writers: { only: [contractId] },
      readers: { only: [contractId] },
    });
    console.log(`maps.create ${tail}: ok`);
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    if (msg.includes("map already exists") || msg.includes("MapAlreadyExists") || msg.includes("already")) {
      console.log(`maps.create ${tail}: already exists, updating ACLs`);
    } else {
      console.log(`maps.create ${tail}: ${msg} — will try update`);
    }
  }
  // Re-grant to current contract_id (re-register makes old ACLs stale)
  await tenant.maps.update(tail, {
    writers: { only: [contractId] },
    readers: { only: [contractId] },
  });
  console.log(`maps.update ${tail}: ACLs -> contract ${contractId}`);
}

// Seed placeholders (replace with real test keys via dashboard before demo)
await tenant.maps.entrySet("secrets", "stripe_test_key", "sk_test_placeholder_replace_me");
console.log("seeded secrets/stripe_test_key (placeholder)");
await tenant.maps.entrySet("secrets", "duffel_api_key", "duffel_test_placeholder");
console.log("seeded secrets/duffel_api_key (placeholder for current wasm)");

try {
  const v = await tenant.maps.entryGet("secrets", "stripe_test_key");
  console.log("verify entryGet secrets/stripe_test_key:", v === null ? "null (absent)" : "present (value hidden)");
} catch (e: any) {
  console.log("entryGet check skipped:", String(e?.message ?? e).slice(0, 200));
}
console.log("Maps setup done.");
