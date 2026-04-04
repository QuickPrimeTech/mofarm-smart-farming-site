// @/src/components/chekout/payment.tsx
"use client";
import { useCheckoutStore, PaymentStatus } from "@/stores/checkout-store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader } from "lucide-react";

const statusConfig: Record<
  PaymentStatus,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    iconColor: string;
    textColor: string;
  }
> = {
  pending: {
    icon: <Loader className="size-12 animate-spin mx-auto" />,
    title: "Processing M-Pesa payment...",
    description: "Check your phone for STK push",
    iconColor: "text-primary",
    textColor: "text-muted-foreground",
  },
  completed: {
    icon: <CheckCircle2 className="size-12 mx-auto" />,
    title: "Payment successful!",
    description: "Your order has been confirmed",
    iconColor: "text-green-500",
    textColor: "text-green-600",
  },
  failed: {
    icon: <XCircle className="size-12 mx-auto" />,
    title: "Payment failed",
    description: "Please try again or use a different method",
    iconColor: "text-destructive",
    textColor: "text-destructive",
  },
};

export function Payment() {
  const {
    paymentStatus,
    setPaymentStatus,
    setStep,
    name,
    phone,
    email,
    address,
  } = useCheckoutStore();

  const orderDetails = [
    { label: "Customer", value: name },
    { label: "Phone", value: phone },
    { label: "Email", value: email },
    { label: "Delivery", value: address },
  ];

  const handleSimulate = (status: PaymentStatus) => {
    if (status === "pending") {
      setPaymentStatus("pending");
      // Auto-complete after 2 seconds for demo
      setTimeout(() => {
        setPaymentStatus("completed");
        setTimeout(() => setStep("done"), 800);
      }, 2000);
    } else {
      setPaymentStatus(status);
    }
  };

  const currentStatus = statusConfig[paymentStatus];

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm border">
        <h4 className="font-semibold text-foreground">Order Details</h4>
        {orderDetails.map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-medium text-foreground">
              {value || "N/A"}
            </span>
          </div>
        ))}
      </div>

      <div className={`space-y-4 p-2 rounded-lg border bg-muted/50`}>
        {/* Status Display */}
        <div className="text-center py-8 space-y-3">
          <div className={currentStatus.iconColor}>{currentStatus.icon}</div>
          <div className="space-y-1">
            <p className={`font-medium ${currentStatus.textColor}`}>
              {currentStatus.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {paymentStatus === "pending"
                ? `Check your phone ${phone} for STK push`
                : currentStatus.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {paymentStatus === "failed" && (
            <Button
              onClick={() => handleSimulate("pending")}
              className="flex-1"
            >
              Retry Payment
            </Button>
          )}

          {(paymentStatus === "completed" || paymentStatus === "failed") && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep("review")}
            >
              Back to Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
