import { motion } from "framer-motion";
import { Copy, Trash2 } from "lucide-react";
import { GeneratedContent } from "@/types/content";
import { toast } from "sonner";

interface SavedLibraryProps {
  items: GeneratedContent[];
  onRemove: (id: string) => void;
}

const typeLabels: Record<string, { emoji: string; badge: string }> = {
  hook: { emoji: "🔥", badge: "badge-tone" },
  caption: { emoji: "📖", badge: "badge-tone" },
  story: { emoji: "🎥", badge: "badge-tone" },
  calendar: { emoji: "📅", badge: "badge-yellow" },
  recruiting: { emoji: "💬", badge: "badge-purple" },
  customer: { emoji: "❤️", badge: "badge-tone" },
  engagement: { emoji: "🙋", badge: "badge-teal" },
};

export default function SavedLibrary({ items, onRemove }: SavedLibraryProps) {
  const copyToClipboard = async (text: string, hashtags: string[]) => {
    await navigator.clipboard.writeText(`${text}\n\n${hashtags.join(" ")}`);
    toast.success("Copied!");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📚</p>
        <p className="font-display font-bold text-foreground text-lg">Your library is empty</p>
        <p className="text-sm text-muted-foreground mt-1">Save content from results to build your library.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const meta = typeLabels[item.type] || { emoji: "✨", badge: "badge-tone" };
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span>{meta.emoji}</span>
              <span className={meta.badge}>{item.type}</span>
              <span className="badge-tone">{item.tone}</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-line line-clamp-4 mb-3">{item.text}</p>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(item.text, item.hashtags)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-all"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-destructive border border-border hover:border-destructive/30 transition-all"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
