import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SparkLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-6"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full gradient-hero"
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold font-display text-foreground">Sparking your content…</p>
        <p className="text-sm text-muted-foreground mt-1">Crafting something amazing just for you ✨</p>
      </div>
    </motion.div>
  );
}
