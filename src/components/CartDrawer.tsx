import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductImage } from "@/lib/images";

const CartDrawer = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  const sendToWhatsApp = () => {
    const message = items
      .map(
        (i) =>
          `• ${i.product.name} x${i.quantity} — ${formatPrice(
            i.product.price * i.quantity
          )}`
      )
      .join("\n");

    const total = formatPrice(totalPrice);
    const text = encodeURIComponent(
      `¡Hola! Me gustaría realizar el siguiente pedido:\n\n${message}\n\n*Total: ${total}*\n\n¡Gracias!`
    );
    window.open(`https://wa.me/573001234567?text=${text}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg">Tu Carrito</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground font-body text-sm mt-12">
                  Tu carrito está vacío
                </p>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4"
                    >
                      <img
                        src={getProductImage(item.product.image)}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-body text-sm font-medium text-foreground truncate">
                          {item.product.name}
                        </h3>
                        <p className="font-body text-sm text-accent mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-body text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.min(
                                  item.quantity + 1,
                                  item.product.stock
                                )
                              )
                            }
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted-foreground">
                    Total
                  </span>
                  <span className="font-display text-lg text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={sendToWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-sm font-body text-sm font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={18} />
                  Enviar Pedido por WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-muted-foreground font-body text-xs hover:text-foreground transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
