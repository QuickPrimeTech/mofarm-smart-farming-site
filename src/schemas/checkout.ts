import * as z from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  deliveryAddress: z.string().min(5, "Please enter a valid address"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
