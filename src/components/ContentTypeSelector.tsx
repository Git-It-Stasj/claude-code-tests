import { motion } from "framer-motion";
import { CONTENT_TYPES, ContentType } from "@/types/content";

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
}

export default function ContentTypeSelector({ onSelect }: ContentTypeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-display text-foreground mb-2">What do you want to create?</h2>
        <p className="text-muted-foreground">Pick a content type and we'll spark 3 variations for you.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {CONTENT_TYPES.map((ct, i) => (
          <motion.button
            key={ct.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(ct.id)}
            className="card-elevated-hover p-4 md:p-5 text-left flex flex-col gap-2"
          >
            <span className="text-3xl">{ct.icon}</span>
            <span className="font-bold font-display text-foreground text-sm md:text-base">{ct.label}</span>
            <span className="text-xs text-muted-foreground leading-snug">{ct.description}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
