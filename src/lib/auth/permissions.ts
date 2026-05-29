import {
  Role,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  type Permission,
} from "@/constants/roles";

/**
 * Check if a user has a specific role or higher in the hierarchy.
 */
export function hasRole(userRole: string | undefined | null, requiredRole: Role): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as Role];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  if (userLevel === undefined || requiredLevel === undefined) return false;
  return userLevel >= requiredLevel;
}

/**
 * Check if a user has a specific permission based on their role.
 */
export function canAccess(userRole: string | undefined | null, permission: Permission): boolean {
  if (!userRole) return false;
  const role = userRole as Role;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Check if a user has completed verification.
 */
export function isVerified(verificationStatus: string | undefined | null): boolean {
  return verificationStatus === "approved";
}

/**
 * Check if a user is a seller.
 */
export function isSeller(userRole: string | undefined | null): boolean {
  return userRole === Role.VERIFIED_SELLER;
}

/**
 * Check if a user is an admin (admin or super_admin).
 */
export function isAdmin(userRole: string | undefined | null): boolean {
  return hasRole(userRole, Role.ADMIN);
}

/**
 * Check if a user is a moderator or higher.
 */
export function isModerator(userRole: string | undefined | null): boolean {
  return hasRole(userRole, Role.MODERATOR);
}

/**
 * Get all permissions for a role.
 */
export function getPermissions(userRole: string | undefined | null): Permission[] {
  if (!userRole) return [];
  const role = userRole as Role;
  return ROLE_PERMISSIONS[role] || [];
}
