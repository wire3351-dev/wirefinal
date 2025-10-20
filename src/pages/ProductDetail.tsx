import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, ShoppingCart, Package } from 'lucide-react';
import { getProductByIdAsync, getProductById, type Product } from '@/lib/products-data';
import { addToCart } from '@/lib/cart-storage';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const foundProduct = await getProductByIdAsync(id);
          setProduct(foundProduct);
        } catch (error) {
          console.error('Error loading product:', error);
          const fallbackProduct = getProductById(id);
          setProduct(fallbackProduct);
        }
      }
    };
    loadProduct();
  }, [id]);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unitType, setUnitType] = useState<'metres' | 'coils'>(product?.unitType || 'metres');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (quantityNum > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} units available`);
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      color: selectedColor,
      quantity: quantityNum,
      unitType,
      unitPrice: product.basePrice,
      imageUrl: product.imageUrl
    });

    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/products')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-accent/20">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.stockQuantity > 0 ? (
                  <Badge variant="secondary" className="text-sm">In Stock</Badge>
                ) : (
                  <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <span className="font-medium text-foreground">{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>
              <p className="text-muted-foreground mb-4">{product.description}</p>

              <div className="text-3xl font-bold text-primary mb-6">
                ₹{product.basePrice.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground">/{product.unitType}</span>
              </div>
            </div>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Configure your product requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Select Color *</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.color.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit Type</Label>
                    <Select value={unitType} onValueChange={(v) => setUnitType(v as 'metres' | 'coils')}>
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{product.stockQuantity} units available</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={product.stockQuantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={product.stockQuantity === 0}
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {product.brochureUrl && (
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Brochure
              </Button>
            )}
          </div>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
