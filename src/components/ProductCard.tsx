import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { getProductImage } from "@/lib/images";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-sm bg-secondary aspect-square mb-3">
        <img
          src={getProductImage(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isPromotion && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-body font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm">
            Promo
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-body text-sm font-medium text-foreground tracking-wider uppercase">
              No disponible
            </span>
          </div>
        )}
        {!outOfStock && (
          <button
            onClick={() => addItem(product)}
            className="absolute bottom-3 right-3 bg-primary text-primary-foreground p-2.5 rounded-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
            aria-label="Agregar al carrito"
          >
            <ShoppingBag size={16} />
          </button>
        )}
      </div>
      <h3 className="font-body text-sm font-medium text-foreground">{product.name}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-body text-sm text-accent font-medium">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="font-body text-xs text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
      {!outOfStock && (
        <p className="font-body text-xs text-muted-foreground mt-1">
          {product.stock} disponibles
        </p>
      )}
    </motion.div>
  );
};

export default ProductCard;
