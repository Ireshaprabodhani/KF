'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import type { CartItem, Product, ProductColor } from '@/types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; selectedColor: ProductColor | null; notes: string; quantity: number }
  | { type: 'REMOVE_ITEM'; cartItemId: string }
  | { type: 'INCREMENT'; cartItemId: string }
  | { type: 'DECREMENT'; cartItemId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      // Normalize legacy cart items (pre-color-variant) that may lack new fields
      const normalized = action.items.map((i) => ({
        cartItemId: (i as CartItem & { cartItemId?: string }).cartItemId ?? crypto.randomUUID(),
        product: i.product,
        quantity: i.quantity,
        selectedColor: i.selectedColor ?? null,
        notes: i.notes ?? '',
      }));
      return { items: normalized };
    }

    case 'ADD_ITEM': {
      const colorKey = action.selectedColor?.id ?? '__no_color__';
      const existing = state.items.find(
        (i) =>
          i.product.id === action.product.id &&
          (i.selectedColor?.id ?? '__no_color__') === colorKey
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartItemId === existing.cartItemId
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            cartItemId: crypto.randomUUID(),
            product: action.product,
            quantity: action.quantity,
            selectedColor: action.selectedColor,
            notes: action.notes,
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.cartItemId !== action.cartItemId) };

    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.cartItemId === action.cartItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case 'DECREMENT':
      return {
        items: state.items
          .map((i) =>
            i.cartItemId === action.cartItemId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, selectedColor: ProductColor | null, notes: string, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  increment: (cartItemId: string) => void;
  decrement: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'kf_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        dispatch({ type: 'HYDRATE', items });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const effectivePrice = i.product.price * (1 - i.product.discount / 100);
    return sum + effectivePrice * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addItem: (product, selectedColor, notes, quantity = 1) =>
          dispatch({ type: 'ADD_ITEM', product, selectedColor, notes, quantity }),
        removeItem: (cartItemId) => dispatch({ type: 'REMOVE_ITEM', cartItemId }),
        increment: (cartItemId) => dispatch({ type: 'INCREMENT', cartItemId }),
        decrement: (cartItemId) => dispatch({ type: 'DECREMENT', cartItemId }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
