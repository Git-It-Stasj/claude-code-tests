import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type EmailIntent = "return" | "shipping" | "product" | "billing" | "general";

export interface ClassificationResult {
  intent: EmailIntent;
  confidence: number;
}

export async function classifyEmail(
  subject: string,
  body: string
): Promise<ClassificationResult> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Classify this customer service email into exactly one of these intents: return, shipping, product, billing, general.

Subject: ${subject}
Body: ${body}

Respond with JSON only in this format: {"intent": "return|shipping|product|billing|general", "confidence": 0.0-1.0}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const parsed = JSON.parse(text) as ClassificationResult;
  return parsed;
}

export async function draftReply(
  email: { subject: string; body: string; from: string },
  kbContext: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a helpful customer service agent for Forge Shop, an e-commerce store. Draft a professional, friendly reply to this customer email using the knowledge base context provided.

Customer Email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Knowledge Base Context:
${kbContext}

Write only the email reply body, no subject line. Be concise, friendly, and helpful. Sign off as "Forge Shop Support Team".`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return text;
}
