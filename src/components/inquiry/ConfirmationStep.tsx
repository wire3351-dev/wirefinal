import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, User, Phone, Mail, MapPin, Package } from "lucide-react";
import { InquiryData } from "@/pages/Inquiry";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { addInquiryToStorage } from "@/lib/inquiry-storage";
import { useUserAuth } from "@/context/UserAuthContext";

interface ConfirmationStepProps {
  data: InquiryData;
}

const ConfirmationStep = ({ data }: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await addInquiryToStorage(data);
      console.log("Submitting inquiry:", data);

      toast.success("Inquiry submitted successfully! We'll contact you soon.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
      setIsSubmitting(false);
    }
  };

  const userTypeLabels: Record<string, string> = {
    consumer: "Consumer",
    electrician: "Electrician",
    shopkeeper: "Shopkeeper",
    builder: "Builder",
    contractor: "Contractor",
    govt: "Government Project",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Review Your Inquiry</h2>
        <p className="text-muted-foreground">Please verify all details before submitting</p>
      </div>

      <Card className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* User Type */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">User Type</h3>
              <p className="text-muted-foreground">{userTypeLabels[data.userType]}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Phone Number</h3>
                <p className="text-muted-foreground">{data.phone}</p>
              </div>
            </div>

            {data.name && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Name</h3>
                  <p className="text-muted-foreground">{data.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground">{data.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-muted-foreground">{data.address}</p>
                <p className="text-sm text-muted-foreground mt-1">PIN: {data.pincode}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
            <Package className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Product Requirements</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="ml-2 font-medium capitalize">{data.brand}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Colour:</span>
                  <span className="ml-2 font-medium capitalize">{data.color}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="ml-2 font-medium">
                    {data.quantity} {data.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Inquiry & Get Best Rates"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            By submitting, you agree to receive quotes from verified suppliers
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
