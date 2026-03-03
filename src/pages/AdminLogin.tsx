import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Cuenta creada. Revisa tu email para confirmar.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error("Credenciales inválidas");
      } else {
        navigate("/admin");
      }
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-foreground mb-1">Panel de Administración</h1>
          <p className="font-body text-sm text-muted-foreground">
            {isSignUp ? "Crear nueva cuenta" : "Inicia sesión para continuar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-body text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Cargando..." : isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center mt-4 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </motion.div>
    </main>
  );
};

export default AdminLogin;
