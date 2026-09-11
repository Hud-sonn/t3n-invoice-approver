import {
  T3nClient,
  setEnvironment,
  loadWasmComponent,
  fetchTrustedManifest,
  eth_get_address,
  metamask_sign,
  createEthAuthInput,
} from "@terminal3/t3n-sdk";

setEnvironment("testnet");
const key = process.env.T3N_API_KEY;
if (!key) throw new Error("Missing T3N_API_KEY (use --env-file=.env.agent)");
const wasmComponent = await loadWasmComponent();
const address = eth_get_address(key);
const client = new T3nClient({
  trustAnchor: await fetchTrustedManifest("testnet"),
  wasmComponent,
  handlers: { EthSign: metamask_sign(address, undefined, key) },
});
await client.handshake();
const auth = await client.authenticate(createEthAuthInput(address));
console.log("AGENT_WHOAMI:", auth.value);
try {
  const bal: any = await (client as any).getUsage?.();
  console.log("AGENT_BALANCE:", JSON.stringify(bal?.balance ?? bal ?? "n/a").slice(0, 200));
} catch (e: any) {
  console.log("AGENT_BALANCE_CHECK:", String(e?.message ?? e).slice(0, 200));
}
