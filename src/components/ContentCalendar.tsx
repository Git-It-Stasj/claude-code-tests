import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GeneratedContent, ContentType } from "@/types/content";

interface ContentCalendarProps {
  items: GeneratedContent[];
}

const typeColorClass: Record<ContentType, string> = {
  hook: "bg-primary/20 border-primary/30",
  caption: "bg-primary/15 border-primary/25",
  story: "bg-primary/20 border-primary/30",
  calendar: "bg-primary/10 border-primary/20",
  recruiting: "bg-content-purple/15 border-content-purple/25",
  customer: "bg-coral/15 border-coral/25",
  engagement: "bg-content-yellow/15 border-content-yellow/25",
};

const typeEmoji: Record<ContentType, string> = {
  hook: "🔥",
  caption: "📖",
  story: "🎥",
  calendar: "📅",
  recruiting: "💬",
  customer: "❤️",
  engagement: "🙋",
};

export default function ContentCalendar({ items }: ContentCalendarProps) {
  const [selectedItem, setSelectedItem] = useState<GeneratedContent | null>(null);

  const today = new Date();
  const daysInMonth = 30;
  const days: { date: string; dayNum: number; content?: GeneratedContent }[] = [];

  for (let i = 0; i < daysInMonth; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const content = items.find((item) => item.calendarDate === dateStr);
    days.push({ date: dateStr, dayNum: d.getDate(), content });
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfWeek = new Date(today).getDay();

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold font-display text-foreground">30-Day Content Calendar</h3>
        <p className="text-sm text-muted-foreground mt-1">Click any day to view content details</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mb-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-content-purple/30" /> Recruiting</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-coral/30" /> Customer</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-content-yellow/30" /> Engagement</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/20" /> Other</span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for alignment */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => (
          <motion.button
            key={day.date}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => day.content && setSelectedItem(day.content)}
            className={`aspect-square rounded-lg border text-xs flex flex-col items-center justify-center gap-0.5 transition-all ${
              day.content
                ? `${typeColorClass[day.content.type]} cursor-pointer hover:shadow-md`
                : "bg-secondary/50 border-border/50"
            }`}
          >
            <span className="font-semibold text-foreground">{day.dayNum}</span>
            {day.content && <span className="text-[10px]">{typeEmoji[day.content.type]}</span>}
          </motion.button>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-elevated p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{typeEmoji[selectedItem.type]}</span>
                  <span className="badge-tone">{selectedItem.type}</span>
                  <span className="badge-tone">{selectedItem.tone}</span>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed mb-3">{selectedItem.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedItem.hashtags.map((h) => (
                  <span key={h} className="text-xs font-medium text-primary">{h}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
