import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const createOAuth2Client = (): OAuth2Client => {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
};

export function getAuthUrl(): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  });
}

let storedTokens: Record<string, unknown> | null = null;

export async function handleCallback(code: string): Promise<void> {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  storedTokens = tokens as Record<string, unknown>;
}

export interface GmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  threadId: string;
}

export async function getInbox(): Promise<GmailMessage[]> {
  if (!storedTokens) {
    throw new Error("Not authenticated. Please complete OAuth flow first.");
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(storedTokens as Parameters<typeof oauth2Client.setCredentials>[0]);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const response = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread",
    maxResults: 10,
  });

  const messages = response.data.messages || [];
  const emailDetails: GmailMessage[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const headers = detail.data.payload?.headers || [];
    const from = headers.find((h) => h.name === "From")?.value || "";
    const subject = headers.find((h) => h.name === "Subject")?.value || "";
    const date = headers.find((h) => h.name === "Date")?.value || "";

    let body = "";
    const parts = detail.data.payload?.parts;
    if (parts) {
      const textPart = parts.find((p) => p.mimeType === "text/plain");
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
      }
    } else if (detail.data.payload?.body?.data) {
      body = Buffer.from(detail.data.payload.body.data, "base64").toString("utf-8");
    }

    emailDetails.push({
      id: msg.id,
      from,
      subject,
      body,
      date,
      threadId: detail.data.threadId || msg.id,
    });
  }

  return emailDetails;
}

export async function sendReply(
  threadId: string,
  to: string,
  subject: string,
  body: string
): Promise<void> {
  if (!storedTokens) {
    throw new Error("Not authenticated. Please complete OAuth flow first.");
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(storedTokens as Parameters<typeof oauth2Client.setCredentials>[0]);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const emailContent = [
    `To: ${to}`,
    `Subject: Re: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].join("\n");

  const encodedEmail = Buffer.from(emailContent).toString("base64url");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedEmail,
      threadId,
    },
  });
}
