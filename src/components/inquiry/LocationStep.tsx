import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPinned } from "lucide-react";
import { InquiryData } from "@/pages/Inquiry";
import { toast } from "sonner";

interface LocationStepProps {
  data: InquiryData;
  updateData: (data: Partial<InquiryData>) => void;
  onNext: () => void;
}

const LocationStep = ({ data, updateData, onNext }: LocationStepProps) => {
  const [pincode, setPincode] = useState(data.pincode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }

    updateData({ pincode });
    toast.success("Location saved");
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
          <MapPinned className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Delivery Location</h2>
        <p className="text-muted-foreground">Enter your area PIN code</p>
      </div>

      <Card className="p-6 md:p-8 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input
              id="pincode"
              type="text"
              placeholder="Enter 6-digit PIN code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
            <p className="text-sm text-muted-foreground text-center">
              We'll find suppliers near you
            </p>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LocationStep;
