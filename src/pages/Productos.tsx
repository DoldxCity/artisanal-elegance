import { useState, useMemo } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const Productos = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== "Todos") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          Nuestros Productos
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Cada pieza es única y elaborada con dedicación
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2.5 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent md:w-64"
        />
        <div className="flex flex-wrap gap-2 flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-sm font-body text-xs tracking-wider uppercase transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 bg-secondary text-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="default">Ordenar</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground font-body text-sm py-20">
          No se encontraron productos
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Productos;
