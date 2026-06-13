import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Bookmark, CalendarPlus, CheckCircle, Sparkles } from "lucide-react";
import { GeneratedContent, ContentType, UserProfile } from "@/types/content";
import { generateMockContent, generateCalendarContent } from "@/lib/mockContent";
import SparkLoader from "./SparkLoader";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface ContentResultsProps {
  type: ContentType;
  profile: UserProfile;
  onSave: (content: GeneratedContent) => void;
  onAddToCalendar: (content: GeneratedContent) => void;
  onBack: () => void;
}

const platformIcons: Record<string, string> = {
  Instagram: "📸",
  Facebook: "📘",
  TikTok: "🎵",
  LinkedIn: "💼",
};

export default function ContentResults({ type, profile, onSave, onAddToCalendar, onBack }: ContentResultsProps) {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const items = type === "calendar"
        ? generateCalendarContent(profile).slice(0, 3)
        : generateMockContent(type, profile);
      setContents(items);
      setLoading(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 1800);
  };

  useEffect(() => { generate(); }, [type]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const allText = contents.map((c, i) => `--- Variation ${i + 1} ---\n${c.text}\n${c.hashtags.join(" ")}`).join("\n\n");
    await navigator.clipboard.writeText(allText);
    toast.success("All 3 variations copied!");
  };

  const regenerate = (index: number) => {
    const newItems = type === "calendar"
      ? generateCalendarContent(profile).slice(0, 3)
      : generateMockContent(type, profile);
    setContents((prev) => prev.map((item, i) => (i === index ? newItems[index] : item)));
    toast.success("Fresh content generated!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <SparkLoader key="loader" />
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">You're showing up. That's already half the battle. 🔥</p>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">Your Content is Ready!</h2>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <button onClick={copyAll} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold gradient-hero text-primary-foreground">
                <Copy className="w-3.5 h-3.5" /> Copy All 3
              </button>
              <button onClick={onBack} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-secondary text-secondary-foreground border border-border">
                ← Pick Another Type
              </button>
            </div>

            {/* Content Cards */}
            <div className="space-y-4">
              {contents.map((content, i) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-elevated p-5"
                >
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-lg">{platformIcons[content.platform] || "📱"}</span>
                    <span className="text-xs font-medium text-muted-foreground">{content.platform}</span>
                    <span className="badge-tone">{content.tone}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {content.wordCount} words · {content.charCount} chars
                    </span>
                  </div>

                  {/* Content text */}
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed mb-3">
                    {content.text}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {content.hashtags.map((h) => (
                      <span key={h} className="text-xs font-medium text-primary">{h}</span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyToClipboard(`${content.text}\n\n${content.hashtags.join(" ")}`, content.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-all"
                    >
                      {copied === content.id ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === content.id ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => regenerate(i)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                    </button>
                    <button
                      onClick={() => { onSave(content); toast.success("Saved to library!"); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => { onAddToCalendar(content); toast.success("Added to calendar!"); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-all"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" /> Calendar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
