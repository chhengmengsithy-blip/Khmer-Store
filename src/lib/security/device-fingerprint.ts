/**
 * Device Fingerprinting Utility
 *
 * Generates and compares device fingerprints for fraud detection.
 * Fingerprints are derived from user agent, screen properties,
 * timezone, and language settings.
 */

export interface DeviceInfo {
  userAgent: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  colorDepth?: number;
  touchSupport?: boolean;
  plugins?: string[];
}

export interface DeviceFingerprint {
  id: string;
  hash: string;
  components: DeviceInfo;
  createdAt: string;
}

export interface FingerprintComparison {
  similarity: number; // 0-1
  matchedComponents: string[];
  mismatchedComponents: string[];
  isLikelyMatch: boolean;
}

/**
 * Generate a fingerprint hash from device information.
 * Uses a simple hashing approach for the stub implementation.
 */
export function generateFingerprint(info: DeviceInfo): DeviceFingerprint {
  const components = [
    info.userAgent,
    info.screenResolution || "unknown",
    info.timezone || "unknown",
    info.language || "unknown",
    info.platform || "unknown",
    info.colorDepth?.toString() || "unknown",
    info.touchSupport?.toString() || "unknown",
    (info.plugins || []).sort().join(","),
  ];

  // Simple hash generation (in production, use crypto.subtle or a proper hash)
  const raw = components.join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const hashStr = Math.abs(hash).toString(36).padStart(12, "0");

  return {
    id: `dfp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    hash: hashStr,
    components: info,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Compare two device fingerprints and return a similarity score.
 */
export function compareFingerprints(
  fp1: DeviceFingerprint,
  fp2: DeviceFingerprint
): FingerprintComparison {
  const matched: string[] = [];
  const mismatched: string[] = [];

  const comparisons: [string, unknown, unknown][] = [
    ["userAgent", fp1.components.userAgent, fp2.components.userAgent],
    ["screenResolution", fp1.components.screenResolution, fp2.components.screenResolution],
    ["timezone", fp1.components.timezone, fp2.components.timezone],
    ["language", fp1.components.language, fp2.components.language],
    ["platform", fp1.components.platform, fp2.components.platform],
    ["colorDepth", fp1.components.colorDepth, fp2.components.colorDepth],
    ["touchSupport", fp1.components.touchSupport, fp2.components.touchSupport],
  ];

  for (const [name, val1, val2] of comparisons) {
    if (val1 === val2) {
      matched.push(name);
    } else {
      mismatched.push(name);
    }
  }

  // User agent similarity (partial match for browser version changes)
  const uaSimilarity = calculateStringSimilarity(
    fp1.components.userAgent,
    fp2.components.userAgent
  );

  const componentSimilarity = matched.length / (matched.length + mismatched.length);
  // Weight user agent similarity higher as it's the most distinctive component
  const similarity = componentSimilarity * 0.6 + uaSimilarity * 0.4;

  return {
    similarity,
    matchedComponents: matched,
    mismatchedComponents: mismatched,
    isLikelyMatch: similarity >= 0.7,
  };
}

/**
 * Calculate simple string similarity (Jaccard-like for tokens).
 */
function calculateStringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  const tokensA = new Set(a.toLowerCase().split(/[\s/;()]+/));
  const tokensB = new Set(b.toLowerCase().split(/[\s/;()]+/));

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++;
  }

  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
