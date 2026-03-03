import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/573001234567"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-40 bg-accent text-accent-foreground p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    aria-label="Contactar por WhatsApp"
  >
    <MessageCircle size={24} />
  </motion.a>
);

export default WhatsAppButton;
