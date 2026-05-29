export enum Role {
  GUEST = "guest",
  PENDING_USER = "pending_user",
  VERIFIED_BUYER = "buyer",
  VERIFIED_SELLER = "seller",
  MODERATOR = "moderator",
  SUPPORT_STAFF = "support_staff",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

/**
 * Role hierarchy - higher index means more privileges.
 * Used to determine if a user has sufficient permissions.
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.GUEST]: 0,
  [Role.PENDING_USER]: 1,
  [Role.VERIFIED_BUYER]: 2,
  [Role.VERIFIED_SELLER]: 3,
  [Role.MODERATOR]: 4,
  [Role.SUPPORT_STAFF]: 5,
  [Role.ADMIN]: 6,
  [Role.SUPER_ADMIN]: 7,
};

export type Permission =
  | "browse_products"
  | "purchase_products"
  | "create_listing"
  | "manage_own_listings"
  | "leave_review"
  | "send_messages"
  | "manage_own_profile"
  | "view_dashboard"
  | "moderate_content"
  | "manage_users"
  | "manage_sellers"
  | "view_analytics"
  | "manage_coupons"
  | "manage_categories"
  | "manage_fraud"
  | "ban_users"
  | "manage_system";

/**
 * Permission mappings per role. Each role gets the listed permissions
 * plus all permissions from lower roles in the hierarchy.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.GUEST]: ["browse_products"],
  [Role.PENDING_USER]: ["browse_products", "manage_own_profile"],
  [Role.VERIFIED_BUYER]: [
    "browse_products",
    "purchase_products",
    "leave_review",
    "send_messages",
    "manage_own_profile",
    "view_dashboard",
  ],
  [Role.VERIFIED_SELLER]: [
    "browse_products",
    "purchase_products",
    "create_listing",
    "manage_own_listings",
    "leave_review",
    "send_messages",
    "manage_own_profile",
    "view_dashboard",
  ],
  [Role.MODERATOR]: [
    "browse_products",
    "purchase_products",
    "leave_review",
    "send_messages",
    "manage_own_profile",
    "view_dashboard",
    "moderate_content",
    "manage_users",
    "manage_sellers",
  ],
  [Role.SUPPORT_STAFF]: [
    "browse_products",
    "send_messages",
    "manage_own_profile",
    "view_dashboard",
    "manage_users",
    "view_analytics",
  ],
  [Role.ADMIN]: [
    "browse_products",
    "purchase_products",
    "create_listing",
    "manage_own_listings",
    "leave_review",
    "send_messages",
    "manage_own_profile",
    "view_dashboard",
    "moderate_content",
    "manage_users",
    "manage_sellers",
    "view_analytics",
    "manage_coupons",
    "manage_categories",
    "manage_fraud",
    "ban_users",
  ],
  [Role.SUPER_ADMIN]: [
    "browse_products",
    "purchase_products",
    "create_listing",
    "manage_own_listings",
    "leave_review",
    "send_messages",
    "manage_own_profile",
    "view_dashboard",
    "moderate_content",
    "manage_users",
    "manage_sellers",
    "view_analytics",
    "manage_coupons",
    "manage_categories",
    "manage_fraud",
    "ban_users",
    "manage_system",
  ],
};
