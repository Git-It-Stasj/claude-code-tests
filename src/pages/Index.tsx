import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, BookOpen, CalendarDays, ArrowLeft } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import OnboardingForm from "@/components/OnboardingForm";
import ContentTypeSelector from "@/components/ContentTypeSelector";
import ContentResults from "@/components/ContentResults";
import SavedLibrary from "@/components/SavedLibrary";
import ContentCalendar from "@/components/ContentCalendar";
import { UserProfile, ContentType, GeneratedContent } from "@/types/content";
import { generateCalendarContent } from "@/lib/mockContent";

type AppView = "onboarding" | "selector" | "results" | "library" | "calendar";

export default function Index() {
  const [view, setView] = useState<AppView>("onboarding");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [savedContent, setSavedContent] = useState<GeneratedContent[]>(() => {
    const stored = localStorage.getItem("contentspark-saved");
    return stored ? JSON.parse(stored) : [];
  });
  const [calendarContent, setCalendarContent] = useState<GeneratedContent[]>(() => {
    const stored = localStorage.getItem("contentspark-calendar");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("contentspark-saved", JSON.stringify(savedContent));
  }, [savedContent]);

  useEffect(() => {
    localStorage.setItem("contentspark-calendar", JSON.stringify(calendarContent));
  }, [calendarContent]);

  const handleOnboardingComplete = (p: UserProfile) => {
    setProfile(p);
    // Auto-generate calendar content
    const cal = generateCalendarContent(p);
    setCalendarContent(cal);
    setView("selector");
  };

  const handleSelectType = (type: ContentType) => {
    if (type === "calendar") {
      setView("calendar");
      return;
    }
    setSelectedType(type);
    setView("results");
  };

  const handleSave = (content: GeneratedContent) => {
    setSavedContent((prev) => {
      if (prev.find((c) => c.id === content.id)) return prev;
      return [...prev, { ...content, saved: true }];
    });
  };

  const handleAddToCalendar = (content: GeneratedContent) => {
    const today = new Date();
    // Find next empty day
    const usedDates = new Set(calendarContent.map((c) => c.calendarDate));
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      if (!usedDates.has(dateStr)) {
        setCalendarContent((prev) => [...prev, { ...content, calendarDate: dateStr }]);
        return;
      }
    }
    // If all full, replace last
    setCalendarContent((prev) => [...prev, { ...content, calendarDate: today.toISOString().split("T")[0] }]);
  };

  const stepNumber = view === "onboarding" ? 1 : view === "selector" ? 2 : 3;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">ContentSpark</span>
          </div>
          {profile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("library")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  view === "library"
                    ? "gradient-hero text-primary-foreground border-transparent"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/30"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Library{savedContent.length > 0 && ` (${savedContent.length})`}
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  view === "calendar"
                    ? "gradient-hero text-primary-foreground border-transparent"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/30"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                Calendar
              </button>
            </div>
          )}
        </div>
        {view === "onboarding" && <ProgressBar currentStep={1} totalSteps={3} />}
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8 md:py-12">
        {/* Back button for non-primary views */}
        {(view === "library" || view === "calendar" || view === "results") && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setView("selector")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to content types
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {view === "onboarding" && (
            <motion.div key="onboarding" exit={{ opacity: 0, y: -20 }}>
              <OnboardingForm onComplete={handleOnboardingComplete} />
            </motion.div>
          )}

          {view === "selector" && (
            <motion.div key="selector" exit={{ opacity: 0, y: -20 }}>
              <ContentTypeSelector onSelect={handleSelectType} />
            </motion.div>
          )}

          {view === "results" && profile && selectedType && (
            <motion.div key="results" exit={{ opacity: 0, y: -20 }}>
              <ContentResults
                type={selectedType}
                profile={profile}
                onSave={handleSave}
                onAddToCalendar={handleAddToCalendar}
                onBack={() => setView("selector")}
              />
            </motion.div>
          )}

          {view === "library" && (
            <motion.div key="library" exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold font-display text-foreground mb-4">My Saved Content</h2>
              <SavedLibrary
                items={savedContent}
                onRemove={(id) => setSavedContent((prev) => prev.filter((c) => c.id !== id))}
              />
            </motion.div>
          )}

          {view === "calendar" && (
            <motion.div key="calendar" exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
              <ContentCalendar items={calendarContent} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-semibold">SheBuilds</span> · Stop staring at a blank screen. Start showing up.
        </p>
      </footer>
    </div>
  );
}
