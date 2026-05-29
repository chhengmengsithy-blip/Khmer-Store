import { SignUpForm } from "@/features/auth/components/sign-up-form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <Card className="border-white/10 bg-[#181A20] shadow-2xl">
      <CardContent className="p-8">
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
