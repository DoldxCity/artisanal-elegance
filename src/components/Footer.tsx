import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-xl mb-4">ATELIER</h3>
          <p className="font-body text-sm opacity-70 leading-relaxed">
            Productos artesanales hechos con amor, dedicación y materiales de la más alta calidad.
          </p>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-widest uppercase mb-4 opacity-50">Tienda</h4>
          <div className="space-y-2">
            <Link to="/productos" className="block font-body text-sm opacity-70 hover:opacity-100 transition-opacity">Todos los Productos</Link>
            <Link to="/promociones" className="block font-body text-sm opacity-70 hover:opacity-100 transition-opacity">Promociones</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-widest uppercase mb-4 opacity-50">Información</h4>
          <div className="space-y-2">
            <Link to="/nosotros" className="block font-body text-sm opacity-70 hover:opacity-100 transition-opacity">Nosotros</Link>
            <Link to="/contacto" className="block font-body text-sm opacity-70 hover:opacity-100 transition-opacity">Contacto</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-widest uppercase mb-4 opacity-50">Contacto</h4>
          <div className="space-y-2 font-body text-sm opacity-70">
            <p>info@atelier.com</p>
            <p>+57 300 123 4567</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
        <p className="font-body text-xs opacity-40">
          © 2026 Atelier. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
