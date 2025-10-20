import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Wrench, Store, Building, HardHat, Landmark } from "lucide-react";
import { InquiryData } from "@/pages/Inquiry";

interface UserTypeStepProps {
  data: InquiryData;
  updateData: (data: Partial<InquiryData>) => void;
  onNext: () => void;
}

const userTypes = [
  { value: "consumer", label: "Consumer", icon: User },
  { value: "electrician", label: "Electrician", icon: Wrench },
  { value: "shopkeeper", label: "Shopkeeper", icon: Store },
  { value: "builder", label: "Builder", icon: Building },
  { value: "contractor", label: "Contractor", icon: HardHat },
  { value: "govt", label: "Govt Project", icon: Landmark },
];

const UserTypeStep = ({ data, updateData, onNext }: UserTypeStepProps) => {
  const handleSelect = (type: string) => {
    updateData({ userType: type });
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your Category</h2>
        <p className="text-muted-foreground">Choose the option that best describes you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.userType === type.value;
          
          return (
            <Card
              key={type.value}
              className={`
                p-6 cursor-pointer transition-all duration-300 hover:shadow-lg
                ${
                  isSelected
                    ? "border-primary bg-accent shadow-md ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                }
              `}
              onClick={() => handleSelect(type.value)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${
                      isSelected
                        ? "bg-gradient-to-br from-primary to-secondary"
                        : "bg-muted"
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-8 w-8
                      ${isSelected ? "text-white" : "text-muted-foreground"}
                    `}
                  />
                </div>
                <h3
                  className={`
                    font-semibold text-lg
                    ${isSelected ? "text-primary" : "text-foreground"}
                  `}
                >
                  {type.label}
                </h3>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeStep;
