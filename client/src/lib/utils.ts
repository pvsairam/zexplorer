import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHash(hash: string, start: number = 6, end: number = 4): string {
  if (!hash) return "";
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function formatAbsoluteTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatGas(gas: number | string): string {
  const num = typeof gas === "string" ? parseInt(gas) : gas;
  return num.toLocaleString();
}

export function formatValue(value: string): string {
  // Convert wei to ether with proper formatting
  const ethValue = Number(BigInt(value) / BigInt(1e14)) / 10000; // Preserve 4 decimals
  return `${ethValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })} ZAMA`;
}

export function detectSearchType(query: string): "block" | "transaction" | "address" | null {
  const trimmed = query.trim();
  
  // Block number (numeric)
  if (/^\d+$/.test(trimmed)) {
    return "block";
  }
  
  // Transaction hash (0x followed by 64 hex chars)
  if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
    return "transaction";
  }
  
  // Address (0x followed by 40 hex chars)
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return "address";
  }
  
  return null;
}

export function getEncryptedTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    euint8: "Encrypted Unsigned Integer (8-bit)",
    euint16: "Encrypted Unsigned Integer (16-bit)",
    euint32: "Encrypted Unsigned Integer (32-bit)",
    euint64: "Encrypted Unsigned Integer (64-bit)",
    euint128: "Encrypted Unsigned Integer (128-bit)",
    euint256: "Encrypted Unsigned Integer (256-bit)",
    ebool: "Encrypted Boolean",
    eaddress: "Encrypted Address",
  };
  return labels[type] || type;
}
