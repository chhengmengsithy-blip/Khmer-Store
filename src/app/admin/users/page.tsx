"use client";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { UserActions } from "@/features/admin/components/user-actions";
import { getAllUsers } from "@/features/admin/actions/admin-actions";

interface UserItem {
  id: string;
  full_name: string | null;
  email?: string;
  role: string;
  location: string | null;
  created_at: string;
  avatar_url?: string | null;
}

const tabs = ["All", "Active", "Banned"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    let mounted = true;
    getAllUsers(1).then(({ data }) => {
      if (mounted) {
        setUsers(data as UserItem[]);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          (u.full_name && u.full_name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }
    if (activeTab === "Banned") {
      result = result.filter((u) => u.role === "banned");
    } else if (activeTab === "Active") {
      result = result.filter((u) => u.role !== "banned");
    }
    return result;
  }, [users, searchQuery, activeTab]);

  const columns: Column<UserItem>[] = [
    {
      key: "avatar",
      header: "",
      className: "w-10",
      render: (user) => (
        <div className="h-8 w-8 rounded-full bg-elevated flex items-center justify-center text-xs text-muted-foreground">
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
        </div>
      ),
    },
    {
      key: "full_name",
      header: "Name",
      sortable: true,
      render: (user) => (
        <span className="text-soft-white font-medium">
          {user.full_name || "Unnamed"}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <Badge
          className={
            user.role === "admin"
              ? "bg-accent-gold/10 text-accent-gold border-accent-gold/20"
              : user.role === "banned"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-muted text-muted-foreground"
          }
        >
          {user.role}
        </Badge>
      ),
    },
    {
      key: "location",
      header: "Location",
      className: "hidden md:table-cell",
      render: (user) => (
        <span className="text-muted-foreground">{user.location || "-"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      sortable: true,
      className: "hidden lg:table-cell",
      render: (user) => (
        <span className="text-muted-foreground text-xs">
          {new Date(user.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (user) => (
        <UserActions userId={user.id} currentRole={user.role} />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-playfair text-soft-white">Users</h1>
        <p className="text-muted-foreground text-sm">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-soft-white">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {users.length} total users
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === tab
                ? "bg-accent-gold/10 text-accent-gold"
                : "text-muted-foreground hover:text-soft-white hover:bg-elevated"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Search users by name..."
        onSearch={setSearchQuery}
        selectable
        keyExtractor={(user) => user.id}
      />
    </div>
  );
}
