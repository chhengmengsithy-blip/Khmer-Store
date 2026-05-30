import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from "@/features/admin/actions/admin-actions";
import { UserActions } from "@/features/admin/components/user-actions";

export default async function AdminUsersPage() {
  const { data: users, count } = await getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-soft-white">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {count} total users
          </p>
        </div>
      </div>

      <Card className="border-white/[0.08] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base">
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Name
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                      Role
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                      Location
                    </th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/[0.05] last:border-0"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-elevated flex items-center justify-center text-xs text-muted-foreground">
                            {user.full_name
                              ? user.full_name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <span className="text-soft-white">
                            {user.full_name || "Unnamed"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-accent-gold/10 text-accent-gold border-accent-gold/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">
                        {user.location || "-"}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <UserActions
                          userId={user.id}
                          currentRole={user.role}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
