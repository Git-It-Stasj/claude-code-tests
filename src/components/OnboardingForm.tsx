import { useState } from "react";
import { motion } from "framer-motion";
import { UserProfile, NICHES, PLATFORMS, GOALS, TONES } from "@/types/content";
import { Sparkles } from "lucide-react";

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    niche: "",
    platforms: [],
    goals: [],
    tone: "",
    productDescription: "",
  });

  const toggleArray = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const isValid =
    profile.name.trim() &&
    profile.niche &&
    profile.platforms.length > 0 &&
    profile.goals.length > 0 &&
    profile.tone &&
    profile.productDescription.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4"
    >
      {/* Hero header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 gradient-hero text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          Quick Setup
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
          Let's spark your content ✨
        </h1>
        <p className="text-muted-foreground">Tell us about you so we can create content that sounds like <em>you</em>.</p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Your name or brand name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="e.g. Sarah's Wellness Co."
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Niche */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Your niche / industry</label>
          <select
            value={profile.niche}
            onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
          >
            <option value="">Select your niche</option>
            {NICHES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Platform focus</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setProfile({ ...profile, platforms: toggleArray(profile.platforms, p) })}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  profile.platforms.includes(p)
                    ? "gradient-hero text-primary-foreground border-transparent"
                    : "bg-card border-border text-foreground hover:border-primary/40"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setProfile({ ...profile, platforms: PLATFORMS })}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                profile.platforms.length === PLATFORMS.length
                  ? "gradient-hero text-primary-foreground border-transparent"
                  : "bg-card border-border text-foreground hover:border-primary/40"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Content goals</label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setProfile({ ...profile, goals: toggleArray(profile.goals, g) })}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  profile.goals.includes(g)
                    ? "gradient-hero text-primary-foreground border-transparent"
                    : "bg-card border-border text-foreground hover:border-primary/40"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Your tone / vibe</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setProfile({ ...profile, tone: t })}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  profile.tone === t
                    ? "gradient-hero text-primary-foreground border-transparent"
                    : "bg-card border-border text-foreground hover:border-primary/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Product description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">What do you sell or promote?</label>
          <input
            type="text"
            value={profile.productDescription}
            onChange={(e) => setProfile({ ...profile, productDescription: e.target.value })}
            placeholder="e.g. plant-based supplements that boost energy"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => isValid && onComplete(profile)}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
            isValid
              ? "gradient-hero text-primary-foreground shadow-lg hover:shadow-xl animate-pulse-glow"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Let's Spark Some Content 🚀
        </motion.button>
      </div>
    </motion.div>
  );
}
