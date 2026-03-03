import { useProductos } from "@/hooks/useProductos";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const Promociones = () => {
  const { data: products = [], isLoading } = useProductos();
  const promos = products.filter((p) => p.promocion);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <p className="font-body text-sm text-muted-foreground">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Promociones</h1>
        <p className="font-body text-sm text-muted-foreground">Aprovecha nuestras ofertas especiales</p>
      </motion.div>
      {promos.length === 0 ? (
        <p className="text-center text-muted-foreground font-body text-sm py-20">No hay promociones activas</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {promos.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Promociones;
