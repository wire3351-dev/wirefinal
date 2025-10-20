import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "@/components/inquiry/StepIndicator";
import UserTypeStep from "@/components/inquiry/UserTypeStep";
import VerificationStep from "@/components/inquiry/VerificationStep";
import ContactStep from "@/components/inquiry/ContactStep";
import LocationStep from "@/components/inquiry/LocationStep";
import ProductStep from "@/components/inquiry/ProductStep";
import ConfirmationStep from "@/components/inquiry/ConfirmationStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface InquiryData {
  userType: string;
  phone: string;
  verified: boolean;
  name: string;
  email: string;
  address: string;
  pincode: string;
  brand: string;
  color: string;
  quantity: string;
  unit: string;
}

const Inquiry = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InquiryData>({
    userType: "",
    phone: "",
    verified: false,
    name: "",
    email: "",
    address: "",
    pincode: "",
    brand: "",
    color: "",
    quantity: "",
    unit: "metres",
  });

  const totalSteps = 6;

  const updateFormData = (data: Partial<InquiryData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UserTypeStep data={formData} updateData={updateFormData} onNext={nextStep} />;
      case 2:
        return <VerificationStep data={formData} updateData={updateFormData} onNext={nextStep} />;
      case 3:
        return <ContactStep data={formData} updateData={updateFormData} onNext={nextStep} />;
      case 4:
        return <LocationStep data={formData} updateData={updateFormData} onNext={nextStep} />;
      case 5:
        return <ProductStep data={formData} updateData={updateFormData} onNext={nextStep} />;
      case 6:
        return <ConfirmationStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Get Your Best Rate
          </h1>
          <p className="text-center text-muted-foreground">
            Complete the form to receive competitive quotes
          </p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* Form Steps */}
        <div className="mt-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep > 1 && currentStep < totalSteps && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={prevStep}
              className="hover:bg-accent"
            >
              Previous Step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiry;
