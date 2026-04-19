// @/components/checkout/order-summary.tsx

"use client";

import { useCartStore } from "@/stores/cart-store";
import { ScrollArea, ScrollBar } from "@ui/scroll-area";
import { CartItem } from "./cart-item";
import { cn } from "@/lib/utils";

type OrderSummaryProps = {
  variant?: "default" | "fancy";
};
export const OrderSummary = ({ variant = "default" }: OrderSummaryProps) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  return (
    <div className="grid grid-rows-[minmax(0,1fr)_auto] max-h-60 border rounded-lg overflow-hidden">
      <ScrollArea className="h-full rounded-lg border-b-2 border-dashed">
        <div className="space-y-2 bg-muted/50 p-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className={cn(
                "flex justify-between text-sm py-1",
                variant === "default" && "border-b",
              )}
            >
              {variant === "default" ? (
                <>
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    KSh {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <CartItem item={item} />
                </>
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="p-3 flex justify-between px-3 items-center shrink-0 bg-background">
        <span className="font-bold text-lg">Total</span>
        <span className="text-primary font-bold text-xl">
          KSh {totalPrice.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
