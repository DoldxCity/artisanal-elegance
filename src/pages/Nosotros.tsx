import { motion } from "framer-motion";

const Nosotros = () => (
  <main className="container mx-auto px-4 py-20">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Nuestra historia</p>
      <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">Nosotros</h1>
      <div className="space-y-6 font-body text-sm text-muted-foreground leading-relaxed">
        <p>
          Somos una marca femenina dedicada a crear productos artesanales únicos, donde cada pieza refleja la pasión por lo hecho a mano y el compromiso con la calidad premium.
        </p>
        <p>
          Nuestro taller es un espacio donde la creatividad y la tradición se encuentran. Trabajamos con materiales seleccionados cuidadosamente para ofrecer piezas que no solo son hermosas, sino que cuentan historias.
        </p>
        <p>
          Creemos en la moda consciente, en el poder de lo artesanal y en la elegancia que viene de la autenticidad. Cada producto que sale de nuestras manos lleva consigo un pedacito de nuestro corazón.
        </p>
      </div>
    </motion.div>
  </main>
);

export default Nosotros;
