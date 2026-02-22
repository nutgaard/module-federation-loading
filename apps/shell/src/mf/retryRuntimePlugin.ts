import { RetryPlugin } from "@module-federation/retry-plugin";

export default function retryRuntimePlugin() {
  return RetryPlugin({
    retryTimes: 2,
    retryDelay: 600
  });
}

