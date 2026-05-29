"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Ban,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: "approved" | "pending" | "rejected" | "none";
  trustScore: number;
  avatar: string;
  joinedAt: string;
}

const mockUsers: UserRow[] = [
  {
    id: "1",
    name: "Sokha Chan",
    email: "sokha@example.com",
    role: "seller",
    verificationStatus: "approved",
    trustScore: 92,
    avatar: "SC",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Dara Pich",
    email: "dara.p@example.com",
    role: "buyer",
    verificationStatus: "approved",
    trustScore: 88,
    avatar: "DP",
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Chantha Vy",
    email: "chantha@example.com",
    role: "seller",
    verificationStatus: "pending",
    trustScore: 65,
    avatar: "CV",
    joinedAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Rotha Kim",
    email: "rotha.kim@example.com",
    role: "buyer",
    verificationStatus: "none",
    trustScore: 45,
    avatar: "RK",
    joinedAt: "2024-04-01",
  },
  {
    id: "5",
    name: "Maly Seng",
    email: "maly.s@example.com",
    role: "seller",
    verificationStatus: "rejected",
    trustScore: 30,
    avatar: "MS",
    joinedAt: "2024-04-12",
  },
];

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "admin":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "seller":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "buyer":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "moderator":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
}

function getVerificationBadge(status: UserRow["verificationStatus"]) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Verified</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>;
    default:
      return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">None</Badge>;
  }
}

function getTrustScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

export function UserManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-soft-white">User Management</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-white/10 bg-white/5"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">User</th>
                <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">Role</th>
                <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">Verification</th>
                <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">Trust Score</th>
                <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gold/10 text-xs font-medium text-accent-gold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-soft-white">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge className={getRoleBadgeClass(user.role)}>{user.role}</Badge>
                  </td>
                  <td className="py-3">{getVerificationBadge(user.verificationStatus)}</td>
                  <td className="py-3">
                    <span className={`text-sm font-medium ${getTrustScoreColor(user.trustScore)}`}>
                      {user.trustScore}/100
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-soft-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-purple-400">
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="border-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="border-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
