/**
 * Escrow Service
 *
 * Manages the full lifecycle of escrow transactions on the platform.
 * Funds are held in escrow until buyer confirms receipt or dispute resolution.
 */

export type EscrowStatus =
  | "created"
  | "funded"
  | "held"
  | "released"
  | "disputed"
  | "refunded"
  | "cancelled";

export interface EscrowTransaction {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  commissionRate: number;
  commissionAmount: number;
  sellerPayout: number;
  status: EscrowStatus;
  createdAt: string;
  updatedAt: string;
  releasedAt: string | null;
  disputeId: string | null;
}

export interface CreateEscrowParams {
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency?: string;
}

export interface DisputeParams {
  escrowId: string;
  initiatedBy: string;
  reason: string;
  evidence?: string[];
}

export interface RefundParams {
  escrowId: string;
  amount?: number; // Partial refund amount; full if not specified
  reason: string;
}

export interface CommissionResult {
  commissionRate: number;
  commissionAmount: number;
  sellerPayout: number;
}

const DEFAULT_COMMISSION_RATE = 0.05; // 5%
const DEFAULT_CURRENCY = "USD";

/**
 * Calculate commission for a given order amount.
 */
export function calculateCommission(
  amount: number,
  rate: number = DEFAULT_COMMISSION_RATE
): CommissionResult {
  const commissionAmount = Math.round(amount * rate * 100) / 100;
  const sellerPayout = Math.round((amount - commissionAmount) * 100) / 100;

  return {
    commissionRate: rate,
    commissionAmount,
    sellerPayout,
  };
}

/**
 * Create a new escrow transaction for an order.
 */
export async function createEscrow(
  params: CreateEscrowParams
): Promise<EscrowTransaction> {
  const { orderId, buyerId, sellerId, amount, currency = DEFAULT_CURRENCY } = params;
  const commission = calculateCommission(amount);

  const escrow: EscrowTransaction = {
    id: `esc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    orderId,
    buyerId,
    sellerId,
    amount,
    currency,
    commissionRate: commission.commissionRate,
    commissionAmount: commission.commissionAmount,
    sellerPayout: commission.sellerPayout,
    status: "created",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releasedAt: null,
    disputeId: null,
  };

  // In production, this would persist to the database
  return escrow;
}

/**
 * Hold funds in escrow after payment is confirmed.
 */
export async function holdFunds(escrowId: string): Promise<EscrowTransaction> {
  // In production, this would update the escrow status in the database
  // and confirm the payment capture with the payment provider
  const updated: EscrowTransaction = {
    id: escrowId,
    orderId: "",
    buyerId: "",
    sellerId: "",
    amount: 0,
    currency: DEFAULT_CURRENCY,
    commissionRate: DEFAULT_COMMISSION_RATE,
    commissionAmount: 0,
    sellerPayout: 0,
    status: "held",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releasedAt: null,
    disputeId: null,
  };

  return updated;
}

/**
 * Release funds to the seller after buyer confirmation or auto-release period.
 */
export async function releaseFunds(escrowId: string): Promise<EscrowTransaction> {
  // In production, this would:
  // 1. Verify escrow is in 'held' status
  // 2. Transfer sellerPayout to seller's account
  // 3. Record commission
  // 4. Update escrow status to 'released'
  const updated: EscrowTransaction = {
    id: escrowId,
    orderId: "",
    buyerId: "",
    sellerId: "",
    amount: 0,
    currency: DEFAULT_CURRENCY,
    commissionRate: DEFAULT_COMMISSION_RATE,
    commissionAmount: 0,
    sellerPayout: 0,
    status: "released",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releasedAt: new Date().toISOString(),
    disputeId: null,
  };

  return updated;
}

/**
 * Initiate a dispute on an escrow transaction.
 */
export async function initiateDispute(
  params: DisputeParams
): Promise<EscrowTransaction> {
  const { escrowId } = params;

  // In production, this would:
  // 1. Verify escrow is in 'held' status
  // 2. Create a dispute record
  // 3. Notify both parties
  // 4. Update escrow status to 'disputed'
  const updated: EscrowTransaction = {
    id: escrowId,
    orderId: "",
    buyerId: "",
    sellerId: "",
    amount: 0,
    currency: DEFAULT_CURRENCY,
    commissionRate: DEFAULT_COMMISSION_RATE,
    commissionAmount: 0,
    sellerPayout: 0,
    status: "disputed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releasedAt: null,
    disputeId: `dsp_${Date.now()}`,
  };

  return updated;
}

/**
 * Process a refund (full or partial) on an escrow transaction.
 */
export async function processRefund(
  params: RefundParams
): Promise<EscrowTransaction> {
  const { escrowId } = params;

  // In production, this would:
  // 1. Verify escrow is in 'held' or 'disputed' status
  // 2. Process refund through payment provider
  // 3. Update escrow status to 'refunded'
  const updated: EscrowTransaction = {
    id: escrowId,
    orderId: "",
    buyerId: "",
    sellerId: "",
    amount: 0,
    currency: DEFAULT_CURRENCY,
    commissionRate: DEFAULT_COMMISSION_RATE,
    commissionAmount: 0,
    sellerPayout: 0,
    status: "refunded",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releasedAt: null,
    disputeId: null,
  };

  return updated;
}
