import { SignInForm } from "@/features/auth/components/sign-in-form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <Card className="border-white/10 bg-[#181A20] shadow-2xl">
      <CardContent className="p-8">
        <SignInForm />
      </CardContent>
    </Card>
  );
}
