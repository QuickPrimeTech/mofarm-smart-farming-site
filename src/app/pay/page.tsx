// @/app/pay/page.tsx
import { CartSync } from "@/components/cart-sync";
import { OrderSummary } from "@/components/chekout/order-summary";
import { PersonalDetails } from "@/components/chekout/personal-details";
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
        <div className="flex flex-col lg:flex-row-reverse gap-5">
          <div className="space-y-2 border rounded-md h-fit pt-4 flex-2">
            <h1 className="text-2xl font-bold font-heading text-center text-muted-foreground">
              Ordered Products
            </h1>
            <OrderSummary variant="fancy" />
          </div>
          <div className="border rounded-md pt-4 flex-3">
            <h1 className="text-2xl font-bold font-heading text-center">
              Order Information
            </h1>
            <PersonalDetails showOrderSummary={false} className="h-fit" />
          </div>
        </div>
      </div>
    </>
  );
}
