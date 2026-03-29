import { StaticImageData } from "next/image";
export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: StaticImageData | string; // Updated type for Next.js
  popular?: boolean;
};

export const products: Product[] = [
  // Fruits
  {
    id: "oranges",
    name: "Oranges",
    price: 150,
    unit: "kg",
    category: "Fruits",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801084/product-oranges_wemafp.jpg",
    popular: true,
  },
  {
    id: "bananas",
    name: "Bananas",
    price: 120,
    unit: "bunch",
    category: "Fruits",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801076/product-bananas_biy18q.jpg",
  },
  {
    id: "mangoes",
    name: "Mangoes",
    price: 200,
    unit: "kg",
    category: "Fruits",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801078/product-mangoes_rygfum.jpg",
  },
  {
    id: "pineapple",
    name: "Pineapple",
    price: 180,
    unit: "piece",
    category: "Fruits",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801085/product-pineapple_xzrs8y.jpg",
  },
  {
    id: "watermelon",
    name: "Watermelon",
    price: 250,
    unit: "piece",
    category: "Fruits",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801090/product-watermelon_wwi8qy.jpg",
  },
  {
    id: "avocado",
    name: "Avocado",
    price: 100,
    unit: "kg",
    category: "Fruits",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801077/product-avocado_nj9tqu.jpg",
  },

  // Vegetables
  {
    id: "sukuma",
    name: "Sukuma Wiki",
    price: 30,
    unit: "bunch",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801090/product-sukuma_lmbsb9.jpg",
    popular: true,
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    price: 80,
    unit: "kg",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801090/product-tomatoes_hgyg6h.jpg",
  },
  {
    id: "cabbage",
    name: "Cabbage",
    price: 60,
    unit: "piece",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801076/product-cabbage_rdzia6.jpg",
  },
  {
    id: "onions",
    name: "Onions",
    price: 100,
    unit: "kg",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801078/product-onions_afedwq.jpg",
  },
  {
    id: "carrots",
    name: "Carrots",
    price: 90,
    unit: "kg",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801077/product-carrots_qulwau.jpg",
  },
  {
    id: "spinach",
    name: "Spinach",
    price: 40,
    unit: "bunch",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801086/product-spinach_gxer4m.jpg",
  },
  {
    id: "peas",
    name: "Green Peas",
    price: 120,
    unit: "kg",
    category: "Vegetables",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801085/product-peas_iaq99l.jpg",
  },

  // Grains
  {
    id: "beans",
    name: "Beans",
    price: 180,
    unit: "kg",
    category: "Grains",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801076/product-beans_zktfd4.jpg",
    popular: true,
  },
  {
    id: "rice",
    name: "Rice",
    price: 200,
    unit: "kg",
    category: "Grains",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801085/product-rice_hp0txw.jpg",
  },
  {
    id: "maize",
    name: "Maize",
    price: 100,
    unit: "kg",
    category: "Grains",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801078/product-maize_ds7awa.jpg",
  },
  {
    id: "greengrams",
    name: "Green Grams",
    price: 220,
    unit: "kg",
    category: "Grains",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801078/product-greengrams_ahqkfs.jpg",
  },

  // Dairy & Poultry
  {
    id: "honey",
    name: "Honey",
    price: 800,
    unit: "500ml",
    category: "Dairy & Others",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801078/product-honey_zvcsfz.jpg",
  },
  {
    id: "milk",
    name: "Fresh Milk",
    price: 70,
    unit: "litre",
    category: "Dairy & Others",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801078/product-milk_betwdi.jpg",
  },
  {
    id: "eggs",
    name: "Eggs",
    price: 450,
    unit: "tray",
    category: "Dairy & Others",
    image:
      "https://res.cloudinary.com/meshack-kipkemoi/image/upload/v1774801077/product-eggs_rsz47d.jpg",
  },
];

export const categories = ["Fruits", "Vegetables", "Grains", "Dairy & Others"];
