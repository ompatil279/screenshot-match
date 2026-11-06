// Pure input-format helpers. These validate shape only; they do not decode ABI data.

export type QueryKind = "selector" | "signature" | "calldata" | "topic" | "txhash";

const HEX = /^0x[0-9a-fA-F]*$/;

export const normalizeHex = (v: string) => {
  const t = v.trim().replace(/\s+/g, "");
  return t.startsWith("0x") || t.startsWith("0X") ? "0x" + t.slice(2) : t ? "0x" + t : "";
};

export const isHex = (v: string) => HEX.test(v);
export const isSelector = (v: string) => /^0x[0-9a-fA-F]{8}$/.test(v);
export const isBytes32 = (v: string) => /^0x[0-9a-fA-F]{64}$/.test(v);
export const isAddress = (v: string) => /^0x[0-9a-fA-F]{40}$/.test(v);
export const isSignatureText = (v: string) => /^[A-Za-z_$][A-Za-z0-9_$]*\(.*\)$/.test(v.trim());

export function byteLength(hex: string): number {
  if (!isHex(hex)) return 0;
  return Math.floor((hex.length - 2) / 2);
}

export interface CalldataCheck {
  valid: boolean;
  error?: string;
  selector?: string;
  bytes: number;
  argWords: number;
}

export function checkCalldata(input: string): CalldataCheck {
  const v = normalizeHex(input);
  if (!v) return { valid: false, bytes: 0, argWords: 0 };
  if (!isHex(v)) return { valid: false, error: "Calldata must contain only hexadecimal characters.", bytes: 0, argWords: 0 };
  if ((v.length - 2) % 2 !== 0) return { valid: false, error: "Calldata has an odd number of hex characters.", bytes: byteLength(v), argWords: 0 };
  const bytes = byteLength(v);
  if (bytes < 4) return { valid: false, error: "Calldata needs at least 4 bytes for a function selector.", bytes, argWords: 0 };
  const argBytes = bytes - 4;
  return {
    valid: true,
    selector: v.slice(0, 10).toLowerCase(),
    bytes,
    argWords: Math.floor(argBytes / 32),
  };
}

/** Best-effort guess of what a pasted value is. Used only to route input to a tool. */
export function detectKind(input: string): QueryKind | null {
  const t = input.trim();
  if (!t) return null;
  if (isSignatureText(t)) return "signature";
  const h = normalizeHex(t);
  if (!isHex(h)) return null;
  if (isSelector(h)) return "selector";
  if (isBytes32(h)) return "txhash";
  if (byteLength(h) > 4) return "calldata";
  return null;
}

export function validateQuery(kind: QueryKind, input: string): string | null {
  const t = input.trim();
  if (!t) return "Enter a value to investigate.";
  const h = normalizeHex(t);
  switch (kind) {
    case "selector":
      return isSelector(h) ? null : "A selector is 4 bytes: 0x followed by 8 hex characters.";
    case "signature":
      return isSignatureText(t) ? null : "Use a canonical signature such as transfer(address,uint256).";
    case "calldata":
      return checkCalldata(t).error ?? (checkCalldata(t).valid ? null : "Enter hex calldata.");
    case "topic":
    case "txhash":
      return isBytes32(h) ? null : "Expected 32 bytes: 0x followed by 64 hex characters.";
  }
}

export const chunkWords = (hex: string) => {
  const body = hex.slice(10);
  const out: string[] = [];
  for (let i = 0; i < body.length; i += 64) out.push(body.slice(i, i + 64));
  return out;
};
