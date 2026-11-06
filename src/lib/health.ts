import { useQuery } from "@tanstack/react-query";
import { atlasApi, isApiConfigured } from "@/api/client";
import type { IntegrationKey, IntegrationState } from "@/types/atlas";

export const healthQueryKey = ["atlas", "health"] as const;

/** Real health check against GET /v1/health. Disabled when no API URL is set. */
export function useHealth() {
  return useQuery({
    queryKey: healthQueryKey,
    queryFn: ({ signal }) => atlasApi.health(signal),
    enabled: isApiConfigured(),
    staleTime: 30_000,
    retry: false,
  });
}

export type BackendState = "not_configured" | "checking" | "connected" | "degraded" | "unavailable";

export function useBackendState(): { state: BackendState; checkedAt?: string; message?: string } {
  const q = useHealth();
  if (!isApiConfigured()) return { state: "not_configured" };
  if (q.isPending || q.isFetching) return { state: "checking" };
  const r = q.data;
  if (!r) return { state: "unavailable" };
  if (!r.ok) return { state: "unavailable", message: r.message };
  return { state: r.data.status === "ok" ? "connected" : "degraded", checkedAt: r.receivedAt };
}

/** Integration status is only ever taken from the backend health payload. */
export function useIntegrationState(key: IntegrationKey): { state: IntegrationState; detail?: string; network?: string } {
  const q = useHealth();
  if (!isApiConfigured()) return { state: "not_configured" };
  if (q.isPending || q.isFetching) return { state: "connecting" };
  const r = q.data;
  if (!r || !r.ok) return { state: "unavailable", detail: r && !r.ok ? r.message : undefined };
  const entry = r.data.integrations?.[key];
  if (!entry) return { state: "not_configured", detail: "The API did not report this integration." };
  return entry;
}
