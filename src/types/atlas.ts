// Frontend-facing contracts for the ATLAS REST API.
// Fields are optional where the backend may omit them; the UI only renders what is supplied.

export interface FunctionSignatureRecord {
  signature: string;
  selector: string;
  inputs?: string[];
  source?: string;
  sourceId?: string;
  sourceFamily?: string;
  standard?: string;
  provenance?: string;
  /** True when the registry source itself is verified. NOT the same as a verified deployed contract. */
  sourceVerified?: boolean;
  datasetVersion?: string;
  arkivEntityKey?: string;
  recordHash?: string;
  importedAt?: string;
  swarmReference?: string;
}

export interface FunctionLookupResponse {
  query: string;
  results: FunctionSignatureRecord[];
}

export interface DecodedArgument {
  name?: string;
  type: string;
  value: unknown;
  raw?: string;
}

export interface DecodeCandidate {
  signature: string;
  arguments: DecodedArgument[];
  source?: string;
}

export interface DecodeCalldataResponse {
  selector: string;
  candidates: DecodeCandidate[];
  warnings?: string[];
}

export type IntegrationKey = "arkiv" | "swarm" | "anonRpc" | "ens" | "zeroG";

export type IntegrationState =
  | "not_configured"
  | "connecting"
  | "connected"
  | "degraded"
  | "unavailable";

export interface HealthResponse {
  status: "ok" | "degraded" | "error" | string;
  version?: string;
  integrations?: Partial<Record<IntegrationKey, { status: IntegrationState; detail?: string; network?: string }>>;
}

export type ApiErrorKind =
  | "not_configured"
  | "network"
  | "timeout"
  | "http"
  | "malformed"
  | "aborted";

export type ApiResult<T> =
  | { ok: true; data: T; receivedAt: string }
  | { ok: false; kind: ApiErrorKind; message: string; status?: number };
