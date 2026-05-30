import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopBar } from "@/features/admin/components/admin-top-bar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-playfair text-soft-white">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Supabase is not configured. Please set up environment variables.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const adminName = profile.full_name || user.email || "Admin";

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-screen lg:pl-60 transition-all duration-300">
          <AdminTopBar adminName={adminName} />
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
