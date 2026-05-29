/**
 * IP Monitoring Utility
 *
 * Tracks login patterns, detects suspicious IP behavior,
 * and flags new/unknown devices.
 */

export interface LoginRecord {
  userId: string;
  ipAddress: string;
  deviceFingerprint: string;
  userAgent: string;
  location?: {
    country: string;
    city?: string;
  };
  timestamp: string;
  successful: boolean;
}

export interface LoginHistory {
  userId: string;
  records: LoginRecord[];
  knownIps: string[];
  knownDevices: string[];
  lastLogin: string | null;
}

export interface SuspiciousPattern {
  detected: boolean;
  type: SuspiciousPatternType | null;
  severity: "low" | "medium" | "high";
  description: string;
  metadata?: Record<string, unknown>;
}

export type SuspiciousPatternType =
  | "impossible_travel"
  | "brute_force"
  | "new_country"
  | "rapid_ip_change"
  | "tor_exit_node";

export interface NewDeviceAlert {
  userId: string;
  ipAddress: string;
  deviceFingerprint: string;
  isNewIp: boolean;
  isNewDevice: boolean;
  requiresVerification: boolean;
}

// In-memory store (use Redis/DB in production)
const loginStore = new Map<string, LoginRecord[]>();

/**
 * Track a login attempt.
 */
export function trackLogin(record: LoginRecord): void {
  const existing = loginStore.get(record.userId) || [];
  existing.push(record);

  // Keep only last 100 records per user
  if (existing.length > 100) {
    existing.splice(0, existing.length - 100);
  }

  loginStore.set(record.userId, existing);
}

/**
 * Detect suspicious patterns in login history.
 */
export function detectSuspiciousPattern(
  userId: string,
  currentLogin: LoginRecord
): SuspiciousPattern {
  const history = loginStore.get(userId) || [];

  // Check for brute force (multiple failed attempts)
  const recentFailed = history.filter(
    (r) =>
      !r.successful &&
      Date.now() - new Date(r.timestamp).getTime() < 900_000 // 15 minutes
  );

  if (recentFailed.length >= 5) {
    return {
      detected: true,
      type: "brute_force",
      severity: "high",
      description: `${recentFailed.length} failed login attempts in 15 minutes`,
      metadata: { failedAttempts: recentFailed.length },
    };
  }

  // Check for new country
  const knownCountries = new Set(
    history
      .filter((r) => r.successful && r.location?.country)
      .map((r) => r.location!.country)
  );

  if (
    currentLogin.location?.country &&
    knownCountries.size > 0 &&
    !knownCountries.has(currentLogin.location.country)
  ) {
    return {
      detected: true,
      type: "new_country",
      severity: "medium",
      description: `Login from new country: ${currentLogin.location.country}`,
      metadata: {
        newCountry: currentLogin.location.country,
        knownCountries: Array.from(knownCountries),
      },
    };
  }

  // Check for rapid IP changes
  const recentLogins = history.filter(
    (r) =>
      r.successful &&
      Date.now() - new Date(r.timestamp).getTime() < 3600_000 // 1 hour
  );
  const uniqueIps = new Set(recentLogins.map((r) => r.ipAddress));

  if (uniqueIps.size >= 5) {
    return {
      detected: true,
      type: "rapid_ip_change",
      severity: "medium",
      description: `${uniqueIps.size} different IPs in the last hour`,
      metadata: { uniqueIpCount: uniqueIps.size },
    };
  }

  return {
    detected: false,
    type: null,
    severity: "low",
    description: "No suspicious patterns detected",
  };
}

/**
 * Get login history for a user.
 */
export function getLoginHistory(userId: string): LoginHistory {
  const records = loginStore.get(userId) || [];
  const knownIps = [...new Set(records.filter((r) => r.successful).map((r) => r.ipAddress))];
  const knownDevices = [...new Set(records.filter((r) => r.successful).map((r) => r.deviceFingerprint))];
  const lastSuccessful = records
    .filter((r) => r.successful)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return {
    userId,
    records,
    knownIps,
    knownDevices,
    lastLogin: lastSuccessful?.timestamp || null,
  };
}

/**
 * Flag a new device login for additional verification.
 */
export function flagNewDevice(
  userId: string,
  ipAddress: string,
  deviceFingerprint: string
): NewDeviceAlert {
  const history = getLoginHistory(userId);
  const isNewIp = !history.knownIps.includes(ipAddress);
  const isNewDevice = !history.knownDevices.includes(deviceFingerprint);

  return {
    userId,
    ipAddress,
    deviceFingerprint,
    isNewIp,
    isNewDevice,
    requiresVerification: isNewIp && isNewDevice,
  };
}
