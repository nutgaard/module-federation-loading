import { RetryPlugin } from "@module-federation/retry-plugin";

export default function retryRuntimePlugin() {
  // UI should get feedback quickly; long-lived recovery is handled by the shell retry loop.
  const retryTimesRaw = Number(import.meta.env.VITE_MF_REQUEST_RETRY_TIMES ?? "0");
  const retryDelayRaw = Number(import.meta.env.VITE_MF_REQUEST_RETRY_DELAY_MS ?? "0");
  return RetryPlugin({
    retryTimes: Number.isFinite(retryTimesRaw) ? Math.max(0, retryTimesRaw) : 0,
    retryDelay: Number.isFinite(retryDelayRaw) ? Math.max(0, retryDelayRaw) : 0
  });
}
