// @/app/pay/page.tsx

import { CartSync } from "@/components/cart-sync";
import { PaymentContent } from "@/sections/pay/content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description:
    "Pay for your food and grains and have it delivered right where you are",
};

type SearchParams = {
  phone?: string;
  items?: string; // JSON string of [{id, qty}]
};

type PaymentPageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;

  return (
    <>
      <CartSync searchItems={params.items} phone={params.phone} />
      <PaymentContent />
    </>
  );
}
