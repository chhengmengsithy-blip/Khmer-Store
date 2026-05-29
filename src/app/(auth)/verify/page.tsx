import { VerificationFlow } from "@/features/auth/components/verification-flow";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <Card className="border-white/10 bg-[#181A20] shadow-2xl">
      <CardContent className="p-8">
        <VerificationFlow />
      </CardContent>
    </Card>
  );
}
