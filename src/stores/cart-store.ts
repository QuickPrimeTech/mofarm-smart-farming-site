import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Product } from "@/types/product";
import { ProductOffer } from "@/types/offer";
import { useCheckoutStore } from "./checkout-store";

export type CartItem = {
  productId: string;
  quantity: number;
};

// Enriched cart item with full product data
export type EnrichedCartItem = CartItem & { product: Product };

type CartState = {
  // Cart items (minimal storage)
  items: CartItem[];
  discounted_products: ProductOffer[];

  // Products cache (fetched from API)
  products: Product[];

  // UI State
  isCartOpen: boolean;

  // Computed state (derived from items + products)
  cartItems: EnrichedCartItem[];
  totalPrice: number;
  totalItems: number;

  // Actions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
  setDiscountedProducts: (products: ProductOffer[]) => void;
  setIsCartOpen: (open: boolean) => void;
  // Individual getters
  getProduct: (productId: string) => Product | undefined;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  syncDerivedState: () => void;
};

// Helper to compute derived state
const computeDerivedState = (
  items: CartItem[],
  products: Product[],
  discountedProducts: ProductOffer[],
) => {
  const cartItems = items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item): item is EnrichedCartItem => item.product !== undefined);

  const totalPrice = cartItems.reduce((sum, item) => {
    const offer = discountedProducts.find(
      // 👈 check for discount
      (d) => d.product_id === item.productId,
    );
    const unitPrice = offer ? offer.discounted_price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { cartItems, totalPrice, totalItems };
};

export const useCartStore = create<CartState>()(
  immer(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        discounted_products: [],
        products: [],
        isCartOpen: false,
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,

        // Actions (all update derived state after mutation)
        addToCart: (productId, quantity = 1) => {
          const productExists = get().products.some((p) => p.id === productId);

          if (!productExists) {
            console.warn("Invalid productId:", productId);
            return; // stop here if invalid
          }

          set((state) => {
            const existingItem = state.items.find(
              (item) => item.productId === productId,
            );
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              state.items.push({ productId, quantity });
            }
          });
          useCheckoutStore.getState().setStep("cart");
          // Recompute derived state
          get().syncDerivedState();
        },

        removeFromCart: (productId) => {
          set((state) => {
            const index = state.items.findIndex(
              (item) => item.productId === productId,
            );
            if (index !== -1) state.items.splice(index, 1);
          });
          get().syncDerivedState();
        },

        updateQuantity: (productId, quantity) => {
          const productExists = get().products.some((p) => p.id === productId);

          if (!productExists) {
            console.warn("Invalid productId:", productId);
            return; // stop here if invalid
          }

          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }
          set((state) => {
            const item = state.items.find(
              (item) => item.productId === productId,
            );
            if (item) item.quantity = quantity;
          });
          get().syncDerivedState();
        },

        clearCart: () => {
          set({ items: [], cartItems: [], totalPrice: 0, totalItems: 0 });
        },

        setProducts: (products) => {
          set({ products });
          get().syncDerivedState();
        },

        setDiscountedProducts: (products) => {
          const now = new Date();

          const validProducts = products.filter((offer) => {
            const validFrom = new Date(offer.valid_from);
            const validTo = new Date(offer.valid_to);

            return validFrom <= now && validTo >= now;
          });

          set({ discounted_products: validProducts });

          // 🔥 recompute totals because discounts changed
          get().syncDerivedState();
        },

        setIsCartOpen: (open) => set({ isCartOpen: open }),

        // Individual getters (for single-item lookups)
        getProduct: (productId) =>
          get().products.find((p) => p.id === productId),

        isInCart: (productId) =>
          get().items.some((item) => item.productId === productId),

        syncDerivedState: () => {
          const { items, products, discounted_products } = get();
          // Because you are using immer, passing an object to set() will merge it
          set(computeDerivedState(items, products, discounted_products));
        },

        getItemQuantity: (productId) =>
          get().items.find((item) => item.productId === productId)?.quantity ||
          0,
      }),

      {
        name: "mofarm_cart",
        partialize: (state) => ({
          items: state.items,
          products: state.products,
          // Don't persist derived state - it will be recomputed on load
        }),
        onRehydrateStorage: () => (state) => {
          // Recompute derived state after persistence rehydrates
          if (state) {
            state.syncDerivedState();
          }
        },
      },
    ),
  ),
);
