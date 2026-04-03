import ProductCard from "./ProductCard";
import { Star } from "lucide-react";
import { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/server";

const SpecialOffers = async () => {
  const supabase = await createClient();

  const { data: specialOffers, error } = await supabase
    .from("special_offers")
    .select(`discount_percentage, products (*)`);

  if (error || !specialOffers) return null;

  const discountedProducts: Product[] = specialOffers
    .filter((offer) => offer.products !== null)
    .map((offer) => {
      const product = (Array.isArray(offer.products) ? offer.products[0] : offer.products) as Product;
      const discount = offer.discount_percentage ?? 0;
      return {
        ...product,
        price: parseFloat((product.price * (1 - discount / 100)).toFixed(2)),
      };
    });

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1 text-secondary font-semibold text-sm mb-2">
            <Star className="h-4 w-4 fill-secondary" /> Great Discounts
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Special Products
          </h2>
          <p className="text-muted-foreground mt-2">
            Loved by restaurants, schools & bulk buyers in Nyeri
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
