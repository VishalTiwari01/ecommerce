// contexts/CartContext.tsx
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

/**
 * CartItem: enhanced shape for images, sale price, variant and color hex
 */
export interface CartItem {
  id: string | number;
  name: string;
  price: number;              // original price
  salePrice?: number;         // optional sale price (if present and < price will be used)
  image?: string | null;      // product/variant image URL
  quantity: number;
  selectedColor?: string | null;      // color name (e.g. "Blue")
  selectedColorHex?: string | null;   // color hex from DB (e.g. "#3b82f6")
  variantId?: string | null;          // variant id if applicable
  sku?: string | null;
  category?: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
}

type RemovePayload =
  | string
  | number
  | { id: string | number; variantId?: string | null; selectedColor?: string | null };

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: RemovePayload }
  | { type: "UPDATE_QUANTITY"; payload: { id: string | number; variantId?: string | null; selectedColor?: string | null; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const LOCALSTORAGE_KEY = "my_app_cart_v1";

/** helper to stringify id for stable comparisons */
const normalizeId = (id: string | number | undefined | null) => (id == null ? "" : String(id));

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, it) => {
    const unit = typeof it.salePrice === "number" && it.salePrice < it.price ? it.salePrice : it.price;
    return sum + unit * it.quantity;
  }, 0);

const sameLineItem = (a: CartItem, b: Omit<CartItem, "quantity">) => {
  // Compare normalized ids to avoid number/string mismatch
  return (
    normalizeId(a.id) === normalizeId(b.id) &&
    (a.variantId ?? null) === (b.variantId ?? null) &&
    (a.selectedColor ?? null) === (b.selectedColor ?? null)
  );
};

/** Lazy initializer to load from localStorage if present */
const init = (): CartState => {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CartState;
      // validate minimal shape
      if (parsed && Array.isArray(parsed.items)) {
        return { ...parsed, total: calcTotal(parsed.items) };
      }
    }
  } catch (e) {
    // ignore parse errors
    console.warn("Failed to load cart from localStorage:", e);
  }
  return { items: [], isOpen: false, total: 0 };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const payload = action.payload;
      const existing = state.items.find((it) => sameLineItem(it, payload));

      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((it) =>
          sameLineItem(it, payload) ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        newItems = [...state.items, { ...payload, quantity: 1 }];
      }

      return { ...state, items: newItems, total: calcTotal(newItems) };
    }

    case "REMOVE_ITEM": {
      const p = action.payload;
      let newItems: CartItem[];

      if (typeof p === "number" || typeof p === "string") {
        // legacy: remove all items with that id (normalize)
        const nid = normalizeId(p);
        newItems = state.items.filter((it) => normalizeId(it.id) !== nid);
      } else {
        // object: remove matching line item(s)
        newItems = state.items.filter(
          (it) =>
            !(
              normalizeId(it.id) === normalizeId(p.id) &&
              (p.variantId == null || it.variantId === p.variantId) &&
              (p.selectedColor == null || it.selectedColor === p.selectedColor)
            )
        );
      }

      return { ...state, items: newItems, total: calcTotal(newItems) };
    }

    case "UPDATE_QUANTITY": {
      const { id, variantId = null, selectedColor = null, quantity } = action.payload;
      const q = Math.max(0, quantity);

      let newItems = state.items.map((it) =>
        normalizeId(it.id) === normalizeId(id) &&
        (variantId == null || it.variantId === variantId) &&
        (selectedColor == null || it.selectedColor === selectedColor)
          ? { ...it, quantity: q }
          : it
      );

      // remove zero-quantity lines
      newItems = newItems.filter((it) => it.quantity > 0);

      return { ...state, items: newItems, total: calcTotal(newItems) };
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0 };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  /**
   * removeItem supports:
   * - removeItem(id)  // remove all items with that product id (legacy)
   * - removeItem({ id, variantId?, selectedColor? }) // remove a specific line
   */
  removeItem: (payload: RemovePayload) => void;
  updateQuantity: (id: string | number, quantity: number, opts?: { variantId?: string | null; selectedColor?: string | null }) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined as unknown as CartState, init);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (payload: RemovePayload) => {
    dispatch({ type: "REMOVE_ITEM", payload });
  };

  const updateQuantity = (id: string | number, quantity: number, opts?: { variantId?: string | null; selectedColor?: string | null }) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, variantId: opts?.variantId ?? null, selectedColor: opts?.selectedColor ?? null, quantity },
    });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const getItemCount = () => state.items.reduce((count, it) => count + it.quantity, 0);

  // persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ items: state.items, isOpen: state.isOpen, total: state.total }));
    } catch (e) {
      console.warn("Failed to save cart to localStorage:", e);
    }
  }, [state.items, state.isOpen, state.total]);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
