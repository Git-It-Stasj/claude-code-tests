import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { classifyEmail, draftReply } from "./anthropic";
import { getAuthUrl, handleCallback, getInbox, sendReply } from "./gmail";
import { lookupKB } from "./knowledge-base";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/classify", async (req, res) => {
  try {
    const { subject, body } = req.body as { subject: string; body: string };
    if (!subject || !body) {
      return res.status(400).json({ error: "subject and body are required" });
    }
    const result = await classifyEmail(subject, body);
    return res.json(result);
  } catch (error) {
    console.error("Classify error:", error);
    return res.status(500).json({ error: "Classification failed" });
  }
});

app.post("/api/respond", async (req, res) => {
  try {
    const { email, intent } = req.body as {
      email: { subject: string; body: string; from: string };
      intent: string;
    };
    if (!email || !intent) {
      return res.status(400).json({ error: "email and intent are required" });
    }
    const kbContext = lookupKB(intent);
    const reply = await draftReply(email, kbContext);
    return res.json({ reply, kbContext });
  } catch (error) {
    console.error("Respond error:", error);
    return res.status(500).json({ error: "Response drafting failed" });
  }
});

app.get("/api/gmail/auth", (_req, res) => {
  try {
    const authUrl = getAuthUrl();
    return res.redirect(authUrl);
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Failed to generate auth URL" });
  }
});

app.get("/api/gmail/callback", async (req, res) => {
  try {
    const { code } = req.query as { code: string };
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }
    await handleCallback(code);
    return res.redirect("http://localhost:5173/agent?gmail=connected");
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({ error: "OAuth callback failed" });
  }
});

app.get("/api/gmail/inbox", async (_req, res) => {
  try {
    const emails = await getInbox();
    return res.json(emails);
  } catch (error) {
    console.error("Inbox error:", error);
    return res.status(500).json({ error: "Failed to fetch inbox" });
  }
});

app.post("/api/gmail/reply", async (req, res) => {
  try {
    const { threadId, to, subject, body } = req.body as {
      threadId: string;
      to: string;
      subject: string;
      body: string;
    };
    if (!threadId || !to || !subject || !body) {
      return res.status(400).json({ error: "threadId, to, subject, and body are required" });
    }
    await sendReply(threadId, to, subject, body);
    return res.json({ success: true });
  } catch (error) {
    console.error("Reply error:", error);
    return res.status(500).json({ error: "Failed to send reply" });
  }
});

app.listen(PORT, () => {
  console.log(`Email agent server running on port ${PORT}`);
});
