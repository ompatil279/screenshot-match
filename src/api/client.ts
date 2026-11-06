import type {
  ApiResult,
  DecodeCalldataResponse,
  FunctionLookupResponse,
  HealthResponse,
} from "@/types/atlas";

/** Base URL comes only from build-time env. Never hardcode a fallback backend. */
export function getApiBaseUrl(): string | null {
  const raw = (import.meta.env["VITE_ATLAS_API_URL"] as string | undefined)?.trim();
  return raw ? raw.replace(/\/+$/, "") : null;
}

export const isApiConfigured = () => getApiBaseUrl() !== null;

const DEFAULT_TIMEOUT_MS = 12_000;

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal | undefined;
  timeoutMs?: number;
  validate: (json: unknown) => boolean;
}

async function request<T>(path: string, opts: RequestOptions): Promise<ApiResult<T>> {
  const base = getApiBaseUrl();
  if (!base) {
    return {
      ok: false,
      kind: "not_configured",
      message: "Backend not configured. Set VITE_ATLAS_API_URL to connect ATLAS Studio to the API.",
    };
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  opts.signal?.addEventListener("abort", onExternalAbort);

  try {
    const res = await fetch(`${base}${path}`, {
      method: opts.method ?? "GET",
      headers: opts.body ? { "content-type": "application/json", accept: "application/json" } : { accept: "application/json" },
      ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { ok: false, kind: "http", status: res.status, message: `The API responded with ${res.status} ${res.statusText}`.trim() };
    }
    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return { ok: false, kind: "malformed", message: "The API returned a response that is not valid JSON." };
    }
    if (!opts.validate(json)) {
      return { ok: false, kind: "malformed", message: "The API response did not match the expected shape." };
    }
    return { ok: true, data: json as T, receivedAt: new Date().toISOString() };
  } catch {
    if (timedOut) return { ok: false, kind: "timeout", message: "The request timed out." };
    if (opts.signal?.aborted) return { ok: false, kind: "aborted", message: "Request cancelled." };
    return { ok: false, kind: "network", message: "Could not reach the ATLAS API." };
  } finally {
    clearTimeout(timer);
    opts.signal?.removeEventListener("abort", onExternalAbort);
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export const atlasApi = {
  lookupSelector(selector: string, signal?: AbortSignal) {
    return request<FunctionLookupResponse>(`/v1/functions/${encodeURIComponent(selector)}`, {
      signal,
      validate: (j) => isObj(j) && Array.isArray(j["results"]),
    });
  },
  searchSignatures(q: string, signal?: AbortSignal) {
    return request<FunctionLookupResponse>(`/v1/functions?q=${encodeURIComponent(q)}`, {
      signal,
      validate: (j) => isObj(j) && Array.isArray(j["results"]),
    });
  },
  decodeCalldata(calldata: string, signal?: AbortSignal) {
    return request<DecodeCalldataResponse>(`/v1/decode/calldata`, {
      method: "POST",
      body: { calldata },
      signal,
      validate: (j) => isObj(j) && typeof j["selector"] === "string" && Array.isArray(j["candidates"]),
    });
  },
  health(signal?: AbortSignal) {
    return request<HealthResponse>(`/v1/health`, {
      signal,
      timeoutMs: 6_000,
      validate: (j) => isObj(j) && typeof j["status"] === "string",
    });
  },
};
