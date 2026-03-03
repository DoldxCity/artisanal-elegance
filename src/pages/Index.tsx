import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    text: "Cada pieza que compré es única y la calidad es excepcional. Se nota el amor en cada detalle.",
    rating: 5,
  },
  {
    name: "Camila Rodríguez",
    text: "Los accesorios son hermosos y el servicio al cliente es impecable. 100% recomendado.",
    rating: 5,
  },
  {
    name: "Valentina López",
    text: "Regalé un set de joyería y quedó encantada. Los empaques son preciosos.",
    rating: 5,
  },
];

const featured = products.slice(0, 4);
const promos = products.filter((p) => p.isPromotion);

const Index = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <img
          src={heroBanner}
          alt="Accesorios artesanales elegantes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 to-foreground/10" />
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-lg"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-3">
              Hecho a mano con amor
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6">
              Elegancia en cada detalle
            </h2>
            <p className="font-body text-sm md:text-base text-primary-foreground/80 mb-8 leading-relaxed max-w-md">
              Descubre piezas únicas elaboradas artesanalmente, donde cada creación cuenta una historia de dedicación y belleza.
            </p>
            <Link
              to="/productos"
              className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-sm font-body text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              Ver Productos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Nuestra colección
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Productos Destacados
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/productos"
            className="inline-block border border-foreground text-foreground px-8 py-3 rounded-sm font-body text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Ver Todo
          </Link>
        </div>
      </section>

      {/* Promotions */}
      {promos.length > 0 && (
        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-2">
                Ofertas especiales
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                Promociones
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {promos.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Lo que dicen
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Testimonios
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-6"
            >
              <div className="flex justify-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-gold text-gold"
                  />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground italic leading-relaxed mb-4">
                "{t.text}"
              </p>
              <p className="font-body text-xs tracking-wider uppercase text-foreground">
                {t.name}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
