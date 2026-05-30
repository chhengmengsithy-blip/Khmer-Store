import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  return (
    <Card className="border-white/10 bg-elevated">
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
          <Mail className="h-8 w-8 text-accent-gold" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-soft-white font-playfair">
            Check Your Email
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            We sent you a verification link. Please check your email and click
            the link to verify your account.
          </p>
        </div>

        <Button
          variant="ghost"
          asChild
          className="text-accent-gold hover:text-accent-gold/80"
        >
          <Link href="/sign-in">Back to Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
