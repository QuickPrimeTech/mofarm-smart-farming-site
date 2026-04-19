// @/app/pay/page.tsx

import { CartSync } from "@/components/cart-sync";
import { OrderSummary } from "@/components/chekout/order-summary";
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

  console.log("Params --------->", params);

  return (
    <>
      <CartSync searchItems={params.items} phone={params.phone} />
      <div className="mt-16 py-10 min-h-screen px-4">
        <div className="max-w-3xl mx-auto">
          <OrderSummary variant="fancy" />
        </div>
      </div>
    </>
  );
}
