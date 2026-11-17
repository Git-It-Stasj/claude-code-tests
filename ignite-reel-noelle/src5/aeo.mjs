// Generates the AEO sidecars for v5: chapters.vtt, on-screen-text.vtt, transcript, JSON-LD.  node aeo.mjs a|b
import fs from "node:fs";
const v = process.argv[2] || "a";
const V = { a: { time: "10:00AM", iso: "2026-11-18T10:00:00-08:00", co: "KPMG, GitHub and Intuit", sfx: "" },
            b: { time: "12:45PM", iso: "2026-11-18T12:45:00-08:00", co: "KPMG, GitHub and Credit Karma", sfx: "-ALT-per-post" } }[v];
const B = (n) => (n === 0 ? 0 : Math.min(34.75, 0.03 + n * 60 / 128));
const ts = (s) => { const ms = Math.round(s * 1000), h = 0, m = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60;
  return `00:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`; };
const ch = [[0, 10, "The problem: everyone is spending on AI"], [10, 15, "Microsoft Ignite 2026, San Francisco"], [15, 20, "The AI House presented by KPMG"],
  [20, 32, "Speaker: Noelle Russell, Founder, AI Leadership Institute"], [32, 44, "Session: The Frontier Value Method"],
  [44, 64, "The three steps of the Frontier Value Method"], [64, 75, "Date, time and venue"]];
const text = [[0, 5, "Everyone is spending on AI."], [5, 10, "Who is measuring the value? (chart: AI spend rises, measured value stays flat: the gap)"],
  [10, 15, "Microsoft Ignite 2026. San Francisco. Nov 17–20. Moscone Center and online."],
  [15, 20, "Presented by KPMG: The AI House. The room where enterprise AI gets done."],
  [20, 32, "Noelle Russell, Founder, AI Leadership Institute. #1 Agentic AI Leader 2025. 5x Microsoft AI MVP. 3.4M+ learners. TEDx speaker. Best-selling author."],
  [32, 44, "The session: The Frontier Value Method: From Token Spend to Business Value."],
  [44, 64, `The Frontier Value Method: 1. Pick the right workflows. 2. Model the human-agent cost. 3. Underwrite outcomes, not tokens. With ${V.co}.`],
  [64, 75, `The AI House, presented by KPMG. Wed Nov 18, ${V.time} Pacific. KPMG Exchange, 175 4th St, San Francisco. Invitation only.`]];
const vtt = (rows) => "WEBVTT\n\n" + rows.map(([a, b, t], i) => `${i + 1}\n${ts(B(a))} --> ${ts(B(b))}\n${t}\n`).join("\n");
const out = "../out/v5/";
fs.writeFileSync(out + `chapters${V.sfx}.vtt`, vtt(ch));
fs.writeFileSync(out + `on-screen-text${V.sfx}.vtt`, vtt(text));
const transcript = text.map(([a, , t]) => `[${ts(B(a)).slice(3, 8)}] ${t}`).join("\n");
fs.writeFileSync(out + `on-screen-text-transcript${V.sfx}.txt`,
  "On-screen text transcript (the video has no voiceover; music only)\n\n" + transcript + "\n");
const ld = {
  "@context": "https://schema.org", "@type": "VideoObject",
  name: "Noelle Russell at The AI House presented by KPMG | Microsoft Ignite 2026",
  description: `Noelle Russell, Founder of the AI Leadership Institute, presents The Frontier Value Method: From Token Spend to Business Value at The AI House presented by KPMG during Microsoft Ignite 2026 in San Francisco, Wednesday November 18, ${V.time} Pacific, at KPMG Exchange, 175 4th St. Three steps: pick the right workflows, model the human-agent cost, underwrite outcomes, not tokens. Get your free Microsoft Ignite 2026 digital pass: https://bit.ly/4iUaePY`,
  thumbnailUrl: ["REPLACE_WITH_PUBLIC_THUMBNAIL_URL"], uploadDate: "2026-11-16", duration: "PT35S",
  contentUrl: "REPLACE_WITH_PUBLIC_VIDEO_URL", inLanguage: "en", isFamilyFriendly: true,
  keywords: "Noelle Russell, AI Leadership Institute, The AI House, KPMG, Microsoft Ignite 2026, Frontier Value Method, AI ROI, token spend, business value, responsible AI, agentic AI, enterprise AI",
  transcript, width: 1080, height: 1920,
  creator: { "@type": "Person", name: "Noelle Russell", jobTitle: "Founder", worksFor: { "@type": "Organization", name: "AI Leadership Institute" }, sameAs: ["REPLACE_WITH_NOELLE_PROFILE_URLS"] },
  about: [{ "@type": "Thing", name: "The Frontier Value Method" }, { "@type": "Thing", name: "AI return on investment" }, { "@type": "Thing", name: "Responsible AI" }],
  mentions: [{ "@type": "Organization", name: "KPMG" }, { "@type": "Organization", name: "Microsoft" }],
  hasPart: ch.map(([a, b, t]) => ({ "@type": "Clip", name: t, startOffset: Math.round(B(a)), endOffset: Math.round(B(b)), url: "REPLACE_WITH_PUBLIC_VIDEO_URL#t=" + Math.round(B(a)) })),
  subjectOf: { "@type": "Event", name: "The Frontier Value Method: From Token Spend to Business Value",
    startDate: V.iso, eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: "KPMG Exchange (The AI House presented by KPMG)", address: { "@type": "PostalAddress", streetAddress: "175 4th St", addressLocality: "San Francisco", addressRegion: "CA", addressCountry: "US" } },
    performer: { "@type": "Person", name: "Noelle Russell" }, organizer: { "@type": "Organization", name: "KPMG" },
    superEvent: { "@type": "Event", name: "Microsoft Ignite 2026", startDate: "2026-11-17", endDate: "2026-11-20", location: { "@type": "Place", name: "Moscone Center", address: "San Francisco, CA" } } },
};
fs.writeFileSync(out + `videoobject${V.sfx}.jsonld`, JSON.stringify(ld, null, 2));
console.log("aeo", v);
