"use client"; // Required for Context and State hooks

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    totalPrice,
    updateQuantity,
    removeFromCart,
    setIsCheckoutOpen,
  } = useCart();

  // Prevents rendering anything if the cart isn't active
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2 text-slate-900">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-primary font-bold hover:underline transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  {item.product.image_url && (
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      KSh {item.product.price.toLocaleString()} /kg
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="rounded-md border bg-white p-1 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="rounded-md border bg-white p-1 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-extrabold text-primary">
                    KSh {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary Area */}
        {items.length > 0 && (
          <div className="border-t bg-slate-50 p-6 space-y-4">
            <div className="flex items-center justify-between font-heading font-bold text-xl">
              <span className="text-slate-600">Total</span>
              <span className="text-primary text-2xl">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full rounded-xl bg-primary py-4 font-heading font-bold text-white shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
              Secure Delivery to Nyeri & Surrounding Areas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
