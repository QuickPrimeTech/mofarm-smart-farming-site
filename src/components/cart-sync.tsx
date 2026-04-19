"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { Product } from "@/types/product";
import { ProductOffer } from "@/types/offer";
import { useCheckoutStore } from "@/stores/checkout-store";

type CartSyncProps = {
  products?: Product[];
  specialOffers?: ProductOffer[];
  phone?: string;
  searchItems?: string;
};

const parseJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export function CartSync({
  products,
  specialOffers,
  phone,
  searchItems,
}: CartSyncProps) {
  const setProducts = useCartStore((state) => state.setProducts);
  const setDiscountedProducts = useCartStore(
    (state) => state.setDiscountedProducts,
  );
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  console.log(useCartStore((state) => state.products));

  const setPhone = useCheckoutStore((state) => state.setPhone);
  const setPaymentPhone = useCheckoutStore((state) => state.setPaymentPhone);

  useEffect(() => {
    // Only update if store is empty (fresh visit) or if data differs
    const currentProducts = useCartStore.getState().products;

    if (currentProducts.length === 0 && products && specialOffers) {
      setProducts(products);
      setDiscountedProducts(specialOffers);
    }
    // Optional: always sync to keep prices fresh
    // else { setProducts(products); setDiscountedProducts(specialOffers); }
  }, [products, specialOffers, setProducts, setDiscountedProducts]);

  useEffect(() => {
    if (!searchItems) {
      return;
    }
    if (phone) {
      setPhone(phone);
      setPaymentPhone(phone);
    }
    const items = parseJSON(searchItems) as { id: string; quantity: number }[];

    if (items) {
      items.map((item) => {
        if (items.some((product) => product.id === item.id)) {
          updateQuantity(item.id, item.quantity);
          return;
        }
        addToCart(item.id, item.quantity);
      });
    }
  }, [phone, searchItems]);

  return null;
}
