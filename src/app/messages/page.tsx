import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function MessagesPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-soft-white font-playfair mb-8">
          Messages
        </h1>
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Messages will appear here when buyers contact you about your listings."
        />
      </div>
    </div>
  );
}
