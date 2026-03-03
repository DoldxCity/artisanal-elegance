export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  isPromotion: boolean;
  description: string;
};

export const categories = [
  "Todos",
  "Joyería",
  "Bolsos",
  "Velas",
  "Accesorios",
  "Cuero",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Set de Aretes Dorados",
    price: 45000,
    originalPrice: 58000,
    category: "Joyería",
    image: "product-1",
    stock: 12,
    isPromotion: true,
    description: "Hermoso set de aretes artesanales bañados en oro de 24k.",
  },
  {
    id: "2",
    name: "Bolso Tejido Artesanal",
    price: 120000,
    category: "Bolsos",
    image: "product-2",
    stock: 5,
    isPromotion: false,
    description: "Bolso tejido a mano con fibras naturales y diseño único.",
  },
  {
    id: "3",
    name: "Vela Aromática Cerámica",
    price: 35000,
    category: "Velas",
    image: "product-3",
    stock: 20,
    isPromotion: false,
    description: "Vela artesanal en contenedor de cerámica hecho a mano.",
  },
  {
    id: "4",
    name: "Pañuelo de Seda Bordado",
    price: 68000,
    originalPrice: 85000,
    category: "Accesorios",
    image: "product-4",
    stock: 8,
    isPromotion: true,
    description: "Pañuelo de seda con bordados artesanales delicados.",
  },
  {
    id: "5",
    name: "Billetera de Cuero",
    price: 55000,
    category: "Cuero",
    image: "product-5",
    stock: 0,
    isPromotion: false,
    description: "Billetera de cuero genuino curtido artesanalmente.",
  },
  {
    id: "6",
    name: "Collar y Aretes Terracota",
    price: 78000,
    originalPrice: 95000,
    category: "Joyería",
    image: "product-6",
    stock: 6,
    isPromotion: true,
    description: "Set de collar y aretes en cerámica y baño de oro.",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
