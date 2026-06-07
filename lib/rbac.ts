export type UserRole = "superadmin" | "manager" | "viewer"

export type PermissionKey =
  | "products:view"
  | "products:create"
  | "products:edit"
  | "products:delete"
  | "products:upload_images"
  | "orders:view"
  | "orders:update_status"
  | "orders:refund"
  | "orders:export"
  | "staff:view"
  | "staff:create"
  | "staff:edit"
  | "staff:delete"
  | "analytics:view"
  | "analytics:export"
  | "settings:view"
  | "settings:edit"
  | "custom_orders:view"
  | "custom_orders:update"
  | "audit_log:view"

export const PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  superadmin: [
    "products:view",
    "products:create",
    "products:edit",
    "products:delete",
    "products:upload_images",
    "orders:view",
    "orders:update_status",
    "orders:refund",
    "orders:export",
    "staff:view",
    "staff:create",
    "staff:edit",
    "staff:delete",
    "analytics:view",
    "analytics:export",
    "settings:view",
    "settings:edit",
    "custom_orders:view",
    "custom_orders:update",
    "audit_log:view",
  ],
  manager: [
    "products:view",
    "products:create",
    "products:edit",
    "products:delete",
    "products:upload_images",
    "orders:view",
    "orders:update_status",
    "orders:export",
    "staff:view",
    "analytics:view",
    "custom_orders:view",
    "custom_orders:update",
  ],
  viewer: [
    "products:view",
    "orders:view",
    "custom_orders:view",
    "analytics:view",
  ],
}

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  manager: "Manager",
  viewer: "Viewer",
}

export interface AdminUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: UserRole
  is_active: boolean
  last_login_at: string | null
}

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false
}

export function userHasPermission(user: AdminUser, permission: PermissionKey): boolean {
  if (!user.is_active) return false
  return hasPermission(user.role, permission)
}

export function getRolePermissions(role: UserRole): PermissionKey[] {
  return PERMISSIONS[role] ?? []
}

export function isValidRole(role: string): role is UserRole {
  return ["superadmin", "manager", "viewer"].includes(role)
}
