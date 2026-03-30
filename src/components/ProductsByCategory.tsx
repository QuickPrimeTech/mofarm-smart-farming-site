"use client";

import { useState, useMemo } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

const INITIAL_COUNT = 4;

const ProductsByCategory = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120, // Adjusted offset for search bar height
        behavior: "smooth",
      });
    }
  };

  // Filter logic: Only show categories that contain the search term
  // OR categories where the name itself matches.
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return { categories, products };

    const filteredCats = categories.filter(
      (cat) =>
        cat.toLowerCase().includes(query) ||
        products.some(
          (p) => p.category === cat && p.name.toLowerCase().includes(query),
        ),
    );

    const filteredProds = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );

    return { categories: filteredCats, products: filteredProds };
  }, [searchQuery]);

  return (
    <section id="products" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>

        {/* --- Sticky Header: Search + Slider --- */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-md py-4 mb-8 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-full border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Category Slider */}
            <div className="flex overflow-x-auto gap-2 no-scrollbar w-full pb-1">
              {filteredData.categories.map((cat) => (
                <button
                  key={`nav-${cat}`}
                  onClick={() =>
                    scrollToCategory(cat.toLowerCase().replace(/\s+/g, "-"))
                  }
                  className="whitespace-nowrap px-5 py-2 rounded-full border border-primary/10 bg-card text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Category Sections --- */}
        {filteredData.categories.length > 0 ? (
          filteredData.categories.map((cat) => {
            const catId = cat.toLowerCase().replace(/\s+/g, "-");
            const catProducts = filteredData.products.filter(
              (p) => p.category === cat,
            );

            if (catProducts.length === 0) return null;

            const isExpanded = expanded[cat];
            const visible = isExpanded
              ? catProducts
              : catProducts.slice(0, INITIAL_COUNT);

            return (
              <div key={cat} id={catId} className="mb-12 scroll-mt-32">
                <h3 className="font-heading text-xl font-bold text-foreground mb-4 border-l-4 border-primary pl-3">
                  {cat}{" "}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({catProducts.length})
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {visible.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {catProducts.length > INITIAL_COUNT && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="inline-flex items-center gap-1 rounded-lg border border-primary px-6 py-2 text-sm font-semibold text-primary hover:bg-accent transition-colors"
                    >
                      {isExpanded ? "Show Less" : "See More"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No products found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsByCategory;
