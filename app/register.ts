import { readFileSync, writeFileSync } from "node:fs";
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
console.log("Connected as:", tenantDid);

const tenant = new TenantClient({ t3n, baseUrl: getNodeUrl(), tenantDid });
await tenant.tenant.me();

const WASM_PATH = new URL(
  "../z-tenant-invoice/target/wasm32-wasip2/release/z_tenant_flight.wasm",
  import.meta.url
);
const wasm = new Uint8Array(readFileSync(WASM_PATH));
console.log("WASM bytes:", wasm.length);

const CONTRACT_TAIL = "invoice-contracts";
const VERSION = "0.4.1";

const result = await tenant.contracts.register({
  tail: CONTRACT_TAIL,
  version: VERSION,
  wasm,
});
console.log("Registered:", result.name, "contract_id:", result.contract_id);

writeFileSync(
  new URL("../docs/contract.json", import.meta.url),
  JSON.stringify(
    { name: result.name, contract_id: result.contract_id, tail: CONTRACT_TAIL, version: VERSION, tenantDid },
    null,
    2
  )
);
console.log("Saved docs/contract.json");
