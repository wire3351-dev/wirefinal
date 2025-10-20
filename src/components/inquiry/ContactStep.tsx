import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { User, Mail, MapPin } from "lucide-react";
import { InquiryData } from "@/pages/Inquiry";
import { toast } from "sonner";

interface ContactStepProps {
  data: InquiryData;
  updateData: (data: Partial<InquiryData>) => void;
  onNext: () => void;
}

const ContactStep = ({ data, updateData, onNext }: ContactStepProps) => {
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [address, setAddress] = useState(data.address);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    updateData({ name, email, address });
    toast.success("Contact details saved");
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground">How should we reach you?</p>
      </div>

      <Card className="p-6 md:p-8 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="address"
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="pl-10 min-h-24"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ContactStep;
