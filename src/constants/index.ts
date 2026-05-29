export const ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

export const VERIFICATION_STATUSES = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
} as const;

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_METHODS = {
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  CRYPTO: "crypto",
  COD: "cod",
} as const;

export const APP_NAME = "Khmer Store";
export const APP_DESCRIPTION =
  "A luxury marketplace platform showcasing premium Cambodian products and artisanal craftsmanship.";

export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_LOCALE = "en";

export const ITEMS_PER_PAGE = 12;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
