import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone } from "lucide-react";

const Contacto = () => (
  <main className="container mx-auto px-4 py-20">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Escríbenos</p>
        <h1 className="font-display text-3xl md:text-4xl text-foreground">Contacto</h1>
      </div>

      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-4 p-4 bg-secondary rounded-sm">
          <Mail size={20} className="text-accent" />
          <div>
            <p className="font-body text-xs text-muted-foreground">Email</p>
            <p className="font-body text-sm text-foreground">info@atelier.com</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-secondary rounded-sm">
          <Phone size={20} className="text-accent" />
          <div>
            <p className="font-body text-xs text-muted-foreground">Teléfono</p>
            <p className="font-body text-sm text-foreground">+57 300 123 4567</p>
          </div>
        </div>
        <a
          href="https://wa.me/573001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-accent text-accent-foreground rounded-sm hover:opacity-90 transition-opacity"
        >
          <MessageCircle size={20} />
          <div>
            <p className="font-body text-xs opacity-70">WhatsApp</p>
            <p className="font-body text-sm font-medium">Chatea con nosotros</p>
          </div>
        </a>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Tu nombre"
          className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <input
          type="email"
          placeholder="Tu email"
          className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <textarea
          rows={4}
          placeholder="Tu mensaje"
          className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-body text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          Enviar Mensaje
        </button>
      </form>
    </motion.div>
  </main>
);

export default Contacto;
