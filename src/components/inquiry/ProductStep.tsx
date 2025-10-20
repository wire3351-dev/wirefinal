import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Cable } from "lucide-react";
import { InquiryData } from "@/pages/Inquiry";
import { toast } from "sonner";

interface ProductStepProps {
  data: InquiryData;
  updateData: (data: Partial<InquiryData>) => void;
  onNext: () => void;
}

const brands = [
  "Polycab",
  "Havells",
  "KEI",
  "Finolex",
  "V-Guard",
  "RR Kabel",
  "Anchor",
  "L&T",
  "Other",
];

const colors = [
  "Red",
  "Blue",
  "Yellow",
  "Green",
  "Black",
  "White",
  "Multicolour",
];

const ProductStep = ({ data, updateData, onNext }: ProductStepProps) => {
  const [brand, setBrand] = useState(data.brand);
  const [color, setColor] = useState(data.color);
  const [quantity, setQuantity] = useState(data.quantity);
  const [unit, setUnit] = useState(data.unit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!brand || !color || !quantity || !unit) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseInt(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    updateData({ brand, color, quantity, unit });
    toast.success("Product details saved");
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
          <Cable className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Product Preferences</h2>
        <p className="text-muted-foreground">Tell us what you need</p>
      </div>

      <Card className="p-6 md:p-8 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select value={brand} onValueChange={setBrand} required>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b} value={b.toLowerCase()}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Colour</Label>
            <Select value={color} onValueChange={setColor} required>
              <SelectTrigger>
                <SelectValue placeholder="Select colour" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c} value={c.toLowerCase()}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit Type</Label>
              <Select value={unit} onValueChange={setUnit} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metres">Metres</SelectItem>
                  <SelectItem value="coils">Coils</SelectItem>
                </SelectContent>
              </Select>
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

export default ProductStep;
