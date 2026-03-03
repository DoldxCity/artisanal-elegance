import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const imageMap: Record<string, string> = {
  "product-1": product1,
  "product-2": product2,
  "product-3": product3,
  "product-4": product4,
  "product-5": product5,
  "product-6": product6,
};

export const getProductImage = (key: string): string => {
  return imageMap[key] || product1;
};
