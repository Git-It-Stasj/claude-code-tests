import { ContentType, GeneratedContent, UserProfile } from "@/types/content";

const hookTemplates = [
  "Nobody talks about this, but {niche} changed my life when I stopped trying to be perfect and started being real.",
  "I was told I'd never make it in {niche}. Here's what happened 6 months later… 👀",
  "The #1 mistake I see in {niche}? Thinking you need to have it all figured out before you start.",
];

const captionTemplates = [
  "Real talk: When I first started in {niche}, I had NO idea what I was doing. 😅\n\nBut here's what I've learned — showing up messy beats not showing up at all.\n\nIf you're sitting on the sidelines wondering if this is for you… it is. 💛\n\n{product}\n\nDrop a 🔥 if you needed to hear this today!",
  "Stop scrolling for a sec. 🛑\n\nI used to think success in {niche} meant having thousands of followers. Spoiler: it doesn't.\n\nIt means connecting with the RIGHT people.\n\nLike you. Reading this right now. ✨\n\n{product}\n\nSave this post for when you need a reminder. 📌",
  "POV: You finally bet on yourself 💪\n\nI remember the day I said YES to this journey in {niche}. Terrified? Absolutely. Worth it? Every single day.\n\n{product}\n\nTag someone who needs to take the leap! 👇",
];

const storyTemplates = [
  "SLIDE 1: \"Can I be honest with you for a second?\" 🎤\n\nSLIDE 2: \"I used to think {niche} wasn't for people like me. But then I realized — I was exactly the person it was made for.\"\n\nSLIDE 3: \"If you're curious about {product}… DM me 'SPARK' and I'll share what changed everything for me. ✨\"",
  "SLIDE 1: \"3 things I wish I knew before starting in {niche}…\" 📋\n\nSLIDE 2: \"1. You don't need to be an expert. 2. Consistency > perfection. 3. Your story IS your strategy.\"\n\nSLIDE 3: \"Want my free guide? Comment 'YES' below! 🙌\"",
  "SLIDE 1: \"Hot take incoming… 🔥\"\n\nSLIDE 2: \"The {niche} industry doesn't need more salespeople. It needs more REAL people sharing real results.\"\n\nSLIDE 3: \"That's exactly what I do with {product}. Tap the link to learn more 👆\"",
];

const recruitingTemplates = [
  "I'm looking for 3 people who are tired of being told their dreams are \"too big.\" 🌟\n\nIf you've been curious about {niche} but weren't sure where to start — this is your sign.\n\nNo experience needed. Just heart, hustle, and a willingness to learn.\n\n{product}\n\nDM me \"TEAM\" to chat! 💬",
  "What if I told you that 6 months from now, you could have a completely different life?\n\nThat's what happened when I joined this {niche} community.\n\nWe're growing, and I'm looking for my next rockstar. 💎\n\nDrop a ✋ if you want the details!",
  "I didn't join {niche} because I had it all figured out.\n\nI joined because I was tired of being stuck.\n\nNow? I get to help others break free too. 🚀\n\n{product}\n\nLooking for 2 action-takers this month. Is that you? Comment below! 👇",
];

const customerTemplates = [
  "Okay but can we talk about how {product} literally changed my morning routine? ☀️\n\nI was skeptical at first (I know, I know). But after 30 days? My {niche} results speak for themselves.\n\nSwipe to see the difference → \n\nWant to try it? Link in bio! 🔗",
  "\"Does it actually work?\" — you, probably 😏\n\nHere's what happened when I committed to {product} for 60 days:\n\n✅ More energy\n✅ Better results\n✅ Actually excited about {niche}\n\nReady to feel this good? DM me! 💌",
  "This is your reminder that you deserve to invest in yourself. 💛\n\n{product} has been my secret weapon in {niche}, and I'm done keeping it a secret.\n\nComment \"INFO\" and I'll send you everything you need to know! ✨",
];

const engagementTemplates = [
  "Quick poll! 📊\n\nWhat's your biggest struggle with {niche} right now?\n\nA) Not enough time ⏰\nB) Don't know where to start 🤷\nC) Afraid of what people will think 😰\nD) All of the above 😅\n\nDrop your letter below! Let's talk about it 👇",
  "Fill in the blank: \n\nIf I could change ONE thing about my {niche} journey, it would be __________.\n\nI'll go first: I wish I started sooner! 🙈\n\nYour turn! 👇",
  "This or that — {niche} edition! 🎯\n\n☀️ Morning routine or 🌙 Night routine?\n📱 Stories or 📸 Feed posts?\n🎤 Going live or ✍️ Writing captions?\n\nDrop your answers! I'm curious 👀",
];

const templateMap: Record<ContentType, string[]> = {
  hook: hookTemplates,
  caption: captionTemplates,
  story: storyTemplates,
  calendar: captionTemplates,
  recruiting: recruitingTemplates,
  customer: customerTemplates,
  engagement: engagementTemplates,
};

const hashtagSets: Record<ContentType, string[][]> = {
  hook: [
    ["#contentcreator", "#socialmedia", "#hookgenerator", "#realtalk", "#entrepreneur"],
    ["#mindsetshift", "#growthmindset", "#businesstips", "#showup", "#motivated"],
    ["#truth", "#reallife", "#sidehustle", "#dreambig", "#nofear"],
  ],
  caption: [
    ["#authentic", "#communityovercompetition", "#socialmediatips", "#showupforyourself"],
    ["#beyourownboss", "#entrepreneurlife", "#motivated", "#inspiration"],
    ["#betonyourself", "#worthit", "#journey", "#transformation"],
  ],
  story: [
    ["#storytime", "#igstories", "#behindthescenes"],
    ["#tips", "#socialmedia", "#growthhacks"],
    ["#hottake", "#truth", "#realresults"],
  ],
  calendar: [
    ["#contentcalendar", "#planwithme", "#socialmediaplanning"],
    ["#consistency", "#contentcreation", "#marketing"],
    ["#planningday", "#batchcontent", "#organize"],
  ],
  recruiting: [
    ["#teambuilding", "#opportunity", "#joinus", "#networkmarketing", "#dreamteam"],
    ["#bossbabe", "#entrepreneur", "#sidehustle", "#freedom", "#workfromhome"],
    ["#leadership", "#growyourteam", "#changeyourlife", "#nowhiring"],
  ],
  customer: [
    ["#results", "#transformation", "#productreview", "#musthave"],
    ["#honest review", "#beforeandafter", "#gamechanger"],
    ["#selflove", "#investinyourself", "#worthit"],
  ],
  engagement: [
    ["#poll", "#community", "#letsconnect", "#engagement"],
    ["#fillintheblank", "#shareyourstory", "#community"],
    ["#thisorthat", "#funquestions", "#gettoknowme"],
  ],
};

export function generateMockContent(
  type: ContentType,
  profile: UserProfile
): GeneratedContent[] {
  const templates = templateMap[type];
  const hashtags = hashtagSets[type];
  const platforms = profile.platforms.length > 0 ? profile.platforms : ["Instagram"];

  return templates.map((template, i) => {
    const text = template
      .replace(/\{niche\}/g, profile.niche || "your niche")
      .replace(/\{product\}/g, profile.productDescription || "what I do")
      .replace(/\{name\}/g, profile.name || "friend");

    return {
      id: `${type}-${Date.now()}-${i}`,
      type,
      platform: platforms[i % platforms.length],
      text,
      hashtags: hashtags[i] || hashtags[0],
      tone: profile.tone || "Relatable",
      wordCount: text.split(/\s+/).length,
      charCount: text.length,
      saved: false,
    };
  });
}

export function generateCalendarContent(profile: UserProfile): GeneratedContent[] {
  const types: ContentType[] = ["hook", "caption", "recruiting", "customer", "engagement", "story"];
  const items: GeneratedContent[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const type = types[i % types.length];
    const templates = templateMap[type];
    const template = templates[i % templates.length];
    const text = template
      .replace(/\{niche\}/g, profile.niche || "your niche")
      .replace(/\{product\}/g, profile.productDescription || "what I do")
      .replace(/\{name\}/g, profile.name || "friend");

    items.push({
      id: `cal-${Date.now()}-${i}`,
      type,
      platform: profile.platforms[i % Math.max(profile.platforms.length, 1)] || "Instagram",
      text,
      hashtags: hashtagSets[type][i % hashtagSets[type].length],
      tone: profile.tone || "Relatable",
      wordCount: text.split(/\s+/).length,
      charCount: text.length,
      saved: false,
      calendarDate: date.toISOString().split("T")[0],
    });
  }

  return items;
}
