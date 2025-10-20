export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  color: string;
  quantity: number;
  unitType: 'metres' | 'coils';
  unitPrice: number;
  imageUrl: string;
}

const CART_STORAGE_KEY = 'wire_cable_cart';

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
};

export const addToCart = (item: Omit<CartItem, 'id'>): void => {
  const items = getCartItems();
  const existingIndex = items.findIndex(
    i => i.productId === item.productId &&
         i.color === item.color &&
         i.unitType === item.unitType
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantity += item.quantity;
  } else {
    items.push({ ...item, id: `cart_${Date.now()}_${Math.random()}` });
  }

  saveCartItems(items);
};

export const updateCartItemQuantity = (id: string, quantity: number): void => {
  const items = getCartItems();
  const index = items.findIndex(i => i.id === id);

  if (index >= 0) {
    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = quantity;
    }
    saveCartItems(items);
  }
};

export const removeFromCart = (id: string): void => {
  const items = getCartItems().filter(i => i.id !== id);
  saveCartItems(items);
};

export const clearCart = (): void => {
  saveCartItems([]);
};

export const getCartTotal = (): number => {
  return getCartItems().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
};

export const getCartItemCount = (): number => {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
};
