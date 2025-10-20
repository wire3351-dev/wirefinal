import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Phone } from "lucide-react";
import { InquiryData } from "@/pages/Inquiry";
import { toast } from "sonner";

interface VerificationStepProps {
  data: InquiryData;
  updateData: (data: Partial<InquiryData>) => void;
  onNext: () => void;
}

const VerificationStep = ({ data, updateData, onNext }: VerificationStepProps) => {
  const [phone, setPhone] = useState(data.phone);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your phone number");
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    updateData({ phone, verified: true });
    toast.success("Phone number verified successfully!");
    setTimeout(onNext, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Verify Your Phone Number</h2>
        <p className="text-muted-foreground">We'll send you a verification code</p>
      </div>

      <Card className="p-6 md:p-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  disabled={otpSent}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
              {!otpSent && (
                <Button onClick={handleSendOTP} className="whitespace-nowrap">
                  Send OTP
                </Button>
              )}
            </div>
          </div>

          {otpSent && (
            <div className="space-y-4 animate-in slide-in-from-top duration-300">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="flex-1"
                >
                  Change Number
                </Button>
                <Button onClick={handleVerify} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                  Verify
                </Button>
              </div>

              <button
                onClick={handleSendOTP}
                className="w-full text-sm text-primary hover:underline"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerificationStep;
