"use client";

import { CartSuccess } from "@/components/chekout/cart-success";
import { OrderSummary } from "@/components/chekout/order-summary";
import { Payment } from "@/components/chekout/payment";
import { PaymentStatus } from "@/components/chekout/payment-status";
import { PersonalDetails } from "@/components/chekout/personal-details";
import { cn } from "@/lib/utils";
import { useCheckoutStore } from "@/stores/checkout-store";

export const PaymentContent = () => {
  const step = useCheckoutStore((state) => state.step);

  return (
    <div className="mt-16 py-10 min-h-screen px-4">
      <div className="flex flex-col lg:flex-row-reverse gap-5">
        <div className="space-y-2 border rounded-md h-fit pt-4 flex-2">
          <h1 className="text-2xl font-bold font-heading text-center text-muted-foreground">
            Ordered Products
          </h1>
          <OrderSummary variant="fancy" />
        </div>
        <div
          className={cn(
            "border rounded-md flex-3",
            step === "review" && "pt-4",
          )}
        >
          {(step === "review" || step === "cart") && (
            <>
              <h1 className="text-2xl font-bold font-heading text-center">
                Order Information
              </h1>
              <PersonalDetails
                showOrderSummary={false}
                className="h-fit"
                variant="page"
              />
            </>
          )}
          {step === "payment" && (
            <>
              <Payment className="h-full" showOrderSummary={false} />
            </>
          )}
          {step === "processing" && <PaymentStatus className="h-fit" />}
          {step === "success" && (
            <CartSuccess className="h-fit" showOrderSummary={false} />
          )}
        </div>
      </div>
    </div>
  );
};
