import { PRODUCTS } from "@/assets/products";
import { create } from "zustand";

export type cartItemType = {
  id: number;
  title: string;
  image: string[];
  price: number;
  quantity: number;
};

type CartState = {
  items: cartItemType[];
  addItem: (item: cartItemType) => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  getTotalPrice: () => string;
  getItemCount: () => number;
};

const initialCartItems: cartItemType[] = [];

export const useCartStore = create<CartState>((set, get) => ({
  items: initialCartItems,
  addItem: (item: cartItemType) => {
    const existingItem = get().items.find((i) => i.id === item.id);
    if (existingItem) {
      set((prev) => ({
        items: prev.items.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: Math.min(
                  i.quantity + item.quantity,
                  PRODUCTS.find((p) => p.id === item.id)?.maxQuantity ||
                    i.quantity
                ),
              }
            : i
        ),
      }));
    } else {
      set((prev) => ({
        items: [...prev.items, item],
      }));
    }
  },

  removeItem: (id: number) => {
    set((prev) => ({
      items: prev.items.filter((i) => i.id !== id),
    }));
  },
  incrementItem: (id: number) => {
    set((prev) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) {
        return prev;
      }

      return {
        items: prev.items.map((i) =>
          i.id === id && i.quantity < product.maxQuantity
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        ),
      };
    });
  },

  decrementItem: (id: number) => {
    set((prev) => ({
      items: prev.items.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      ),
    }));
  },
  getTotalPrice: () => {
   const {items} = get();

   return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  },
  
  getItemCount: () => {
    return get().items.reduce((total, item) => total +item.quantity, 0);
  },
}));
