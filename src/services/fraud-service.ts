/**
 * Fraud Detection Service
 *
 * Provides risk scoring, device fingerprint analysis, multi-account detection,
 * and suspicious activity flagging for platform security.
 */

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskScore {
  score: number; // 0-100
  level: RiskLevel;
  factors: RiskFactor[];
  recommendation: "allow" | "review" | "block";
}

export interface RiskFactor {
  type: string;
  description: string;
  weight: number;
  value: string | number | boolean;
}

export interface DeviceFingerprintMatch {
  fingerprintId: string;
  userId: string;
  similarity: number; // 0-1
  matchedAt: string;
}

export interface MultiAccountAlert {
  id: string;
  primaryUserId: string;
  linkedUserIds: string[];
  confidence: number;
  indicators: string[];
  detectedAt: string;
}

export interface FraudAlert {
  id: string;
  type: "suspicious_activity" | "device_conflict" | "multi_account" | "velocity" | "chargeback";
  severity: RiskLevel;
  userId: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ActivityData {
  userId: string;
  action: string;
  ipAddress: string;
  deviceFingerprint: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Calculate a risk score for a given user action.
 */
export function calculateRiskScore(data: ActivityData): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;

  // Factor: New account activity
  if (data.metadata?.accountAge && (data.metadata.accountAge as number) < 24) {
    factors.push({
      type: "new_account",
      description: "Account less than 24 hours old",
      weight: 15,
      value: data.metadata.accountAge as number,
    });
    totalScore += 15;
  }

  // Factor: High value transaction from new account
  if (data.metadata?.transactionAmount && (data.metadata.transactionAmount as number) > 500) {
    factors.push({
      type: "high_value",
      description: "High value transaction",
      weight: 20,
      value: data.metadata.transactionAmount as number,
    });
    totalScore += 20;
  }

  // Factor: Multiple rapid transactions
  if (data.metadata?.recentTransactionCount && (data.metadata.recentTransactionCount as number) > 5) {
    factors.push({
      type: "velocity",
      description: "Multiple transactions in short period",
      weight: 25,
      value: data.metadata.recentTransactionCount as number,
    });
    totalScore += 25;
  }

  // Factor: Device mismatch
  if (data.metadata?.deviceMismatch) {
    factors.push({
      type: "device_mismatch",
      description: "Transaction from unrecognized device",
      weight: 20,
      value: true,
    });
    totalScore += 20;
  }

  // Factor: Location anomaly
  if (data.metadata?.locationAnomaly) {
    factors.push({
      type: "location_anomaly",
      description: "Access from unusual location",
      weight: 15,
      value: true,
    });
    totalScore += 15;
  }

  const score = Math.min(100, totalScore);
  const level = getRiskLevel(score);
  const recommendation = getRecommendation(score);

  return { score, level, factors, recommendation };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function getRecommendation(score: number): "allow" | "review" | "block" {
  if (score >= 80) return "block";
  if (score >= 50) return "review";
  return "allow";
}

/**
 * Check if a device fingerprint matches any other known user.
 */
export async function checkDeviceFingerprint(
  fingerprint: string,
  currentUserId: string
): Promise<DeviceFingerprintMatch[]> {
  // In production, this would query the database for matching fingerprints
  // excluding the current user
  void fingerprint;
  void currentUserId;

  return [];
}

/**
 * Detect potential multi-account abuse.
 */
export async function detectMultiAccount(
  userId: string
): Promise<MultiAccountAlert | null> {
  // In production, this would analyze:
  // - Shared device fingerprints
  // - Same IP address patterns
  // - Similar registration data
  // - Linked payment methods
  void userId;

  return null;
}

/**
 * Flag a suspicious activity for admin review.
 */
export async function flagSuspiciousActivity(
  data: ActivityData,
  reason: string
): Promise<FraudAlert> {
  const riskScore = calculateRiskScore(data);

  const alert: FraudAlert = {
    id: `fra_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: "suspicious_activity",
    severity: riskScore.level,
    userId: data.userId,
    description: reason,
    metadata: {
      ipAddress: data.ipAddress,
      deviceFingerprint: data.deviceFingerprint,
      action: data.action,
      riskScore: riskScore.score,
    },
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };

  // In production, this would persist the alert and notify admins
  return alert;
}

/**
 * Get active fraud alerts for the admin dashboard.
 */
export async function getFraudAlerts(
  options: { severity?: RiskLevel; limit?: number } = {}
): Promise<FraudAlert[]> {
  const { limit = 50 } = options;
  void limit;

  // In production, this would query the database
  return [];
}
