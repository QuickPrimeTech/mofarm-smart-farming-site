// @/schemas/checkout.ts

import * as z from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  email: z.string().email("Please enter a valid email"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
