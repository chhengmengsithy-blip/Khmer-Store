"use client";

import React from "react";
import { UserManagementTable } from "@/features/admin/components/user-management-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">User Management</h1>
        <p className="mt-1 text-muted-foreground">
          Manage platform users, roles, and permissions
        </p>
      </div>

      <UserManagementTable />
    </div>
  );
}
