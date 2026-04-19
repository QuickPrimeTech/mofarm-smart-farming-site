// @/components/checkout/order-details
"use client";

import { useCheckoutStore } from "@/stores/checkout-store";
import { useShallow } from "zustand/shallow";

export function OrderDetails() {
  const { name, phone, email, address, payment_phone } = useCheckoutStore(
    useShallow((state) => ({
      name: state.name,
      phone: state.phone,
      email: state.email,
      address: state.address,
      payment_phone: state.payment_phone,
    })),
  );

  const orderDetails = [
    { label: "Customer", value: name },
    { label: "Contact Phone", value: phone },
    { label: "Payment Phone", value: payment_phone },
    { label: "Email", value: email },
    { label: "Delivery", value: address },
  ];

  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm border">
      <h4 className="font-semibold text-foreground">Order Details</h4>
      <div className="space-y-2">
        {orderDetails.map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-medium text-foreground">
              {value || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
