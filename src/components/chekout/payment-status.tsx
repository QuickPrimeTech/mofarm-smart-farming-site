"use client";

import { useEffect, useState } from "react";
import {
  useCheckoutStore,
  PaymentStatus as PaymentStatusType,
} from "@/stores/checkout-store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { ScrollArea, ScrollBar } from "@ui/scroll-area";
import { usePaymentHandler } from "@/hooks/use-payment";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { OrderDetails } from "./order-details";

const statusConfig: Record<
  PaymentStatusType,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    iconColor: string;
    textColor: string;
    bgColor: string;
  }
> = {
  pending: {
    icon: <Loader className="size-12 animate-spin mx-auto" />,
    title: "Processing M-Pesa payment...",
    description: "Check your phone for STK push",
    iconColor: "text-primary",
    textColor: "text-muted-foreground",
    bgColor: "bg-blue-50/50",
  },
  completed: {
    icon: <CheckCircle2 className="size-12 mx-auto" />,
    title: "Payment successful!",
    description: "Your order has been confirmed",
    iconColor: "text-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50/50",
  },
  failed: {
    icon: <XCircle className="size-12 mx-auto" />,
    title: "Payment failed",
    description: "Please try again or use a different number",
    iconColor: "text-destructive",
    textColor: "text-destructive",
    bgColor: "bg-red-50/50",
  },
  cancelled: {
    icon: <XCircle className="size-12 mx-auto" />,
    title: "Payment Cancelled",
    description: "Please try again or use a different number",
    iconColor: "text-destructive",
    textColor: "text-destructive",
    bgColor: "bg-red-50/50",
  },
};

export function PaymentStatus({
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) {
  const { handlePayment, isProcessing } = usePaymentHandler();
  const [isListening, setIsListening] = useState(false);

  const {
    paymentStatus,
    setPaymentStatus,
    setStep,
    transactionId,
    payment_phone,
  } = useCheckoutStore(
    useShallow((state) => ({
      paymentStatus: state.paymentStatus,
      setPaymentStatus: state.setPaymentStatus,
      setStep: state.setStep,
      transactionId: state.transactionId,
      payment_phone: state.payment_phone,
    })),
  );

  // Real-time subscription effect (keep your existing useEffect)
  useEffect(() => {
    if (!transactionId) return;

    const supabase = createClient();

    const fetchInitialStatus = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("status")
        .eq("id", transactionId)
        .single();

      if (error) {
        console.error("Error fetching initial status:", error);
        return;
      }

      if (data && data.status !== "pending") {
        setPaymentStatus(data.status as PaymentStatusType);
        if (data.status === "completed") {
          setTimeout(() => setStep("success"), 800);
        }
      }
    };

    fetchInitialStatus();

    const channel = supabase
      .channel(`transaction_${transactionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `id=eq.${transactionId}`,
        },
        (payload) => {
          const newStatus = payload.new.status as PaymentStatusType;
          setPaymentStatus(newStatus);

          if (newStatus === "completed") {
            toast.success("Payment completed successfully!");
            setTimeout(() => setStep("success"), 800);
          } else if (newStatus === "failed") {
            toast.error("Payment failed. You can retry below.");
          }
        },
      )
      .subscribe((status) => {
        setIsListening(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transactionId, setPaymentStatus, setStep]);

  const currentStatus = statusConfig[paymentStatus];

  // Retry handler - uses stored payment_phone
  const handleRetry = async () => {
    if (!payment_phone) {
      // If no payment phone stored, go back to payment step
      setStep("payment");
      return;
    }

    // Retry payment with stored phone number
    await handlePayment();
  };

  // Go back to change payment details
  const handleEditPayment = () => {
    setStep("payment");
  };

  const cancelPayment = () => {
    setPaymentStatus("cancelled");
  };

  return (
    <ScrollArea className={cn("h-0 flex-1", className)} {...props}>
      <div className="space-y-6 py-6 px-4">
        {/* Connection Status */}
        {isListening && paymentStatus === "pending" && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Waiting for payment confirmation...
          </div>
        )}

        {/* Status Display */}
        <div
          className={`${currentStatus.bgColor} rounded-xl border p-6 text-center space-y-4`}
        >
          <div className={currentStatus.iconColor}>{currentStatus.icon}</div>
          <div className="space-y-1">
            <h3 className={`font-semibold text-lg ${currentStatus.textColor}`}>
              {currentStatus.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {paymentStatus === "pending"
                ? `Check your phone ${payment_phone} for STK push`
                : currentStatus.description}
            </p>
            {paymentStatus === "pending" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"destructive"}
                    size={"xl"}
                    className="w-full mt-6"
                  >
                    Cancel Payment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row">
                    <AlertDialogCancel className="flex-1">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="flex-2"
                      variant={"destructive"}
                      onClick={cancelPayment}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Retry Button - Only show on failed */}
          {(paymentStatus === "failed" || paymentStatus === "cancelled") && (
            <div className="flex flex-col-reverse sm:flex-row pt-4 gap-2">
              <Button
                variant="outline"
                onClick={handleEditPayment}
                className="w-full sm:flex-1"
                size="xl"
              >
                Change Payment Number
              </Button>
              <Button
                onClick={handleRetry}
                disabled={isProcessing}
                className="w-full sm:flex-2"
                size="xl"
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Payment
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <OrderDetails />

        {/* Help Text */}
        {paymentStatus === "pending" && (
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Didn't receive the STK push?</p>
            <button
              onClick={handleRetry}
              disabled={isProcessing}
              className="text-primary hover:underline disabled:opacity-50"
            >
              Click here to resend
            </button>
          </div>
        )}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}
