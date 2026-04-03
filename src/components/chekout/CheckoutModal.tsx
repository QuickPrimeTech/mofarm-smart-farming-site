"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Review } from "./review";

type CheckoutSteps = "review" | "payment" | "done";

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const [step, setStep] = useState<CheckoutSteps>("review");

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "review" && "Checkout"}
            {step === "payment" && "Pay via M-Pesa"}
            {step === "done" && "Order Confirmed!"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] px-4">
          <div className="py-4">
            {step === "review" && <Review />}

            {step === "payment" && (
              <div className="space-y-6">
                <p>Payment step content here...</p>
                <Button onClick={() => setStep("done")} className="w-full">
                  Complete Payment
                </Button>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold">Order Received!</h3>
                <p className="text-slate-600">
                  Redirecting to WhatsApp to finalize your delivery...
                </p>
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
