import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { productsData, brands, categories, type Product } from '@/lib/products-data';
import { saveProduct, getAllProducts, deleteProduct } from '@/lib/firebase-services';
import { toast } from 'sonner';
import { Package, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy as firestoreOrderBy } from 'firebase/firestore';

const PRODUCTS_STORAGE_KEY = 'wire_cable_products';

type ProductFormState = {
  name: string;
  brand: string;
  category: string;
  color: string;
  description: string;
  basePrice: string;
  unitType: 'metres' | 'coils';
  stockQuantity: string;
  imageUrl: string;
  specifications: string;
  isActive: boolean;
};

function ProductFormFields({ formData, onChange }: { formData: ProductFormState; onChange: (field: string, value: string | boolean) => void }) {
  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g., FR PVC Insulated Wire 1.5 sq mm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Select value={formData.brand} onValueChange={(value) => onChange('brand', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => onChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Available Colors (comma-separated)</Label>
        <Input
          id="color"
          value={formData.color}
          onChange={(e) => onChange('color', e.target.value)}
          placeholder="Red, Blue, Yellow, Green"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="basePrice">Price (₹) *</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => onChange('basePrice', e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type</Label>
          <Select value={formData.unitType} onValueChange={(value: 'metres' | 'coils') => onChange('unitType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metres">Metres</SelectItem>
              <SelectItem value="coils">Coils</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock Qty</Label>
          <Input
            id="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => onChange('stockQuantity', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => onChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specifications">Specifications (JSON format)</Label>
        <Textarea
          id="specifications"
          value={formData.specifications}
          onChange={(e) => onChange('specifications', e.target.value)}
          placeholder='{"voltage": "1100V", "conductor": "Copper"}'
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => onChange('isActive', checked)}
        />
        <Label htmlFor="isActive">Publish on website</Label>
      </div>
    </div>
  );
}

export const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    color: '',
    description: '',
    basePrice: '',
    unitType: 'metres' as 'metres' | 'coils',
    stockQuantity: '',
    imageUrl: '',
    specifications: '',
    isActive: true
  });

  useEffect(() => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, firestoreOrderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const live: Product[] = [] as any;
      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        live.push({ id: doc.id, ...data } as Product);
      });
      if (live.length > 0) {
        setProducts(live);
      } else {
        setProducts(productsData);
      }
    }, (error) => {
      // Ignore AbortError which can happen when unsubscribing during unmount or auth change
      if (error && (error.name === 'AbortError' || (error.code && (error.code === 'aborted' || error.code === 'cancelled')))) {
        console.debug('Products subscription aborted (expected):', error?.message || error);
        return;
      }
      console.error('Products subscription error:', error);
      // Fallback on error
      (async () => {
        try {
          const firebaseProducts = await getAllProducts();
          setProducts(firebaseProducts.length > 0 ? firebaseProducts : productsData);
        } catch {
          setProducts(productsData);
        }
      })();
    });

    return () => unsubscribe();
  }, []);

  const loadProducts = async () => {
    try {
      const firebaseProducts = await getAllProducts();
      if (firebaseProducts.length > 0) {
        setProducts(firebaseProducts);
      } else {
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(productsData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      color: '',
      description: '',
      basePrice: '',
      unitType: 'metres',
      stockQuantity: '',
      imageUrl: '',
      specifications: '',
      isActive: true
    });
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.brand || !formData.category || !formData.basePrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newProduct: Product = {
        id: `product_${Date.now()}`,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        color: formData.color.split(',').map(c => c.trim()).filter(Boolean),
        description: formData.description,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
        basePrice: parseFloat(formData.basePrice),
        unitType: formData.unitType,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
        isActive: formData.isActive
      };

      await saveProduct(newProduct);
      await loadProducts();
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    if (!formData.name || !formData.brand || !formData.category || !formData.basePrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      color: formData.color.split(',').map(c => c.trim()).filter(Boolean),
      description: formData.description,
      specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
      basePrice: parseFloat(formData.basePrice),
      unitType: formData.unitType,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg',
      isActive: formData.isActive
    };

    try {
      await saveProduct(updatedProduct);
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      color: product.color.join(', '),
      description: product.description,
      basePrice: product.basePrice.toString(),
      unitType: product.unitType,
      stockQuantity: product.stockQuantity.toString(),
      imageUrl: product.imageUrl,
      specifications: JSON.stringify(product.specifications, null, 2),
      isActive: product.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleToggleStatus = async (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    try {
      await saveProduct({ ...target, isActive: !target.isActive });
      toast.success('Product status updated');
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length
  };

  const handleFormChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.inactive}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Out of Stock</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.outOfStock}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Add and manage products for your store</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={resetForm}>
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the product details to add it to your catalog</DialogDescription>
                </DialogHeader>
                <ProductFormFields formData={formData} onChange={handleFormChange} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">No products yet</p>
              <p className="text-sm text-muted-foreground">Add your first product to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-accent/20">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.color.slice(0, 3).join(', ')}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell className="text-sm">{product.category}</TableCell>
                    <TableCell className="font-medium">₹{product.basePrice.toFixed(2)}/{product.unitType}</TableCell>
                    <TableCell>
                      <Badge variant={product.stockQuantity > 0 ? 'secondary' : 'destructive'}>
                        {product.stockQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(product.id)}
                        className="gap-2"
                      >
                        {product.isActive ? (
                          <>
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-600">Inactive</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <ProductFormFields formData={formData} onChange={handleFormChange} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
