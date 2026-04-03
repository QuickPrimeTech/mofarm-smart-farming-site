// @/components/chekout/review.tsx
"use client";
import { useCart } from "@/context/CartContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CheckoutFormData, checkoutSchema } from "@/schemas/checkout";

export const Review = () => {
  const { items, totalPrice, isCheckoutOpen, setIsCheckoutOpen, clearCart } =
    useCart();
    
      const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
    },
  });
      const handleClose = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => {
      setStep("review");
      form.reset();
    }, 300);
  };

  const handleProceedToPay = () => {
    setStep("payment");
  };

    return (
         <form
                onSubmit={form.handleSubmit(handleProceedToPay)}
                className="space-y-4"
              >
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

                <div className="pt-4 border-t">
                  <FieldGroup>
                    <Controller
                      name="customerName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-name">
                            Full Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="checkout-name"
                            placeholder="Full Name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="customerPhone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-phone">
                            M-Pesa Phone Number
                          </FieldLabel>
                          <Input
                            {...field}
                            id="checkout-phone"
                            type="tel"
                            placeholder="M-Pesa Phone Number"
                            aria-invalid={fieldState.invalid}
                            autoComplete="tel"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="deliveryAddress"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="checkout-address">
                            Delivery Address
                          </FieldLabel>
                          <Input
                            {...field}
                            id="checkout-address"
                            placeholder="Address (e.g., Nyeri Town, Stage 4)"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Proceed to Pay
                </Button>
              </form>
    )
}