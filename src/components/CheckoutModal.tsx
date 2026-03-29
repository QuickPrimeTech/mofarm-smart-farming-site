"use client";

import { useState } from "react";
import { X, Phone, CheckCircle, Copy, MessageSquare } from "lucide-react"; // Added MessageSquare icon
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const CheckoutModal = () => {
  const { items, totalPrice, isCheckoutOpen, setIsCheckoutOpen, clearCart } =
    useCart();
  const [step, setStep] = useState<"review" | "pay" | "done">("review");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const mpesaNumber = "0703946365"; // Standard format for copying
  const whatsappNumber = "254703946365"; // International format for WhatsApp API

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => setStep("review"), 300);
  };

  const handleProceedToPay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("pay");
  };

  const handleConfirm = () => {
    // 1. Construct the Order Summary for WhatsApp
    const orderList = items
      .map(
        (item) =>
          `• ${item.product.name} (x${item.quantity}) - KSh ${(item.product.price * item.quantity).toLocaleString()}`,
      )
      .join("\n");

    const message = encodeURIComponent(
      `*NEW ORDER - MOFARM SMART FARMING*\n\n` +
        `*Customer Details:*\n` +
        `👤 Name: ${customerName}\n` +
        `📞 Phone: ${customerPhone}\n` +
        `📍 Address: ${deliveryAddress}\n\n` +
        `*Order Summary:*\n` +
        `${orderList}\n\n` +
        `💰 *Total Amount: KSh ${totalPrice.toLocaleString()}*\n\n` +
        `✅ _I have sent the M-Pesa payment for this order._`,
    );

    // 2. WhatsApp Redirect Link
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // 3. UI Update and Redirect
    setStep("done");

    setTimeout(() => {
      window.open(whatsappUrl, "_blank"); // Opens WhatsApp in a new tab
      toast.success("Order details sent to WhatsApp!");
      clearCart();

      // Optional: Don't auto-close so they see the "Done" screen, or close after a longer delay
      setTimeout(() => {
        handleClose();
        setCustomerName("");
        setCustomerPhone("");
        setDeliveryAddress("");
      }, 3000);
    }, 1500);
  };

  const copyNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mpesaNumber);
      toast.success("M-Pesa number copied!");
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {step === "review" && "Checkout"}
            {step === "pay" && "Pay via M-Pesa"}
            {step === "done" && "Order Confirmed!"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {step === "review" && (
            <form onSubmit={handleProceedToPay} className="space-y-4">
              {/* ... (Your existing Review Items logic remains the same) */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm py-1 border-b"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      KSh{" "}
                      {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-between items-center border-t">
                <span className="font-bold text-lg">Total</span>
                <span className="text-primary font-bold text-xl">
                  KSh {totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Delivery Details
                </h3>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="M-Pesa Phone Number"
                  className="w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Address (e.g., Nyeri Town, Stage 4)"
                  className="w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
              >
                Proceed to Pay
              </button>
            </form>
          )}

          {step === "pay" && (
            <div className="space-y-6 text-center">
              <div className="rounded-xl bg-slate-50 p-6 border">
                <Phone className="h-10 w-10 text-primary mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Send KSh {totalPrice.toLocaleString()} to:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold">{mpesaNumber}</span>
                  <button
                    onClick={copyNumber}
                    className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200"
                  >
                    <Copy className="h-4 w-4 text-primary" />
                  </button>
                </div>
              </div>

              <div className="text-left space-y-2 p-4 border rounded-xl bg-slate-50/50 text-sm">
                <p className="font-bold">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>
                    Send Money to{" "}
                    <span className="font-bold">{mpesaNumber}</span>
                  </li>
                  <li>Wait for M-Pesa confirmation message</li>
                  <li>Click the button below to notify the supplier</li>
                </ol>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-4 font-bold text-white hover:bg-green-700 transition-all shadow-lg shadow-green-200"
              >
                <MessageSquare className="h-5 w-5" />
                I&apos;ve Sent Payment (Notify Supplier)
              </button>
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
      </div>
    </div>
  );
};

export default CheckoutModal;
