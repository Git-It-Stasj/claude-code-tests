import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MailOpen,
  CheckCircle,
  Loader2,
  Send,
  BookOpen,
  Cpu,
  Zap,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

type EmailIntent = "return" | "shipping" | "product" | "billing" | "general";

interface SampleEmail {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  threadId: string;
  intent: EmailIntent;
}

interface PipelineStage {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "idle" | "running" | "done" | "error";
}

interface AgentResult {
  intent: EmailIntent;
  confidence: number;
  kbContext: string;
  reply: string;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: "demo-1",
    threadId: "thread-1",
    from: "sarah.johnson@email.com",
    subject: "I need to return my order #12345",
    date: "2026-06-12T09:14:00Z",
    intent: "return",
    body: `Hi,

I received my order #12345 two days ago but unfortunately the item doesn't fit properly. I'd like to initiate a return. The item is still in its original packaging with all tags attached.

Could you please let me know the process for returning this?

Thanks,
Sarah`,
  },
  {
    id: "demo-2",
    threadId: "thread-2",
    from: "mike.chen@email.com",
    subject: "Where is my package?",
    date: "2026-06-12T10:02:00Z",
    intent: "shipping",
    body: `Hello,

I placed an order 8 days ago (order #67890) and it still hasn't arrived. The tracking hasn't updated in 3 days and just says "In Transit".

Can you help me figure out what's going on?

Best,
Mike`,
  },
  {
    id: "demo-3",
    threadId: "thread-3",
    from: "lisa.park@email.com",
    subject: "Question about headphone compatibility",
    date: "2026-06-12T11:30:00Z",
    intent: "product",
    body: `Hi there,

I'm looking at buying the wireless headphones on your site but I'm not sure if they'll work with my older laptop that only has a 3.5mm jack and no Bluetooth. Can you tell me if they come with an adapter or if they're compatible with wired connections?

Also, what's the battery life like?

Thanks,
Lisa`,
  },
  {
    id: "demo-4",
    threadId: "thread-4",
    from: "david.williams@email.com",
    subject: "Charged twice for my order",
    date: "2026-06-12T13:45:00Z",
    intent: "billing",
    body: `To Whom It May Concern,

I just checked my credit card statement and noticed I was charged twice for order #54321 placed on June 10th. The first charge went through fine but there's a duplicate charge from the same day.

I need this resolved as soon as possible. My order total was $89.50 and I've been charged $179.00 total.

Regards,
David Williams`,
  },
  {
    id: "demo-5",
    threadId: "thread-5",
    from: "emma.davis@email.com",
    subject: "Do you offer gift wrapping?",
    date: "2026-06-12T14:20:00Z",
    intent: "general",
    body: `Hi!

I'm looking to buy something for my mom's birthday next week and was wondering if you offer gift wrapping? Also, is there a way to include a personalized message with the order?

Looking forward to hearing from you!

Emma`,
  },
];

const MOCK_KB_CONTEXTS: Record<EmailIntent, string> = {
  return: `policy: Forge Shop offers 30-day returns on all items. Return shipping is free on orders over $50. Items must be in original condition with tags attached.

steps:
1. Email support@forgeshop.com with your order number
2. We'll send a prepaid return label within 24 hours
3. Pack item securely and drop off at any carrier location
4. Refund processed within 3-5 business days of receipt`,

  shipping: `domestic: Standard shipping 5-7 business days ($4.99). Express 2-day shipping available ($12.99). Free standard shipping on orders over $75.

international: International shipping 7-14 business days. Rates calculated at checkout. Customs/duties are customer's responsibility.

express: 2-day express shipping available for $12.99. Order by 2pm ET for same-day dispatch.

freeThreshold: Free standard shipping on all domestic orders over $75.

standard: Standard shipping: 5-7 business days for $4.99.`,

  product: `categories: electronics accessories, home goods, apparel

materials: All materials listed on product pages. Electronics accessories come with 1-year warranty.

sizing: Size guides available on each apparel product page. We recommend measuring and comparing to our size chart.`,

  billing: `methods: We accept Visa, Mastercard, Amex, Discover, and PayPal. All transactions are SSL encrypted.

invoicing: Invoices sent within 24 hours of order confirmation to the email on file.

refunds: Refunds appear on your statement within 5-7 business days. PayPal refunds are instant.`,

  general: `hours: Customer support available Monday-Friday, 9am-5pm ET.

email: support@forgeshop.com

response: We respond to all emails within 24 business hours.`,
};

const MOCK_REPLIES: Record<EmailIntent, string> = {
  return: `Hi Sarah,

Thank you for reaching out about your return for order #12345! We're happy to help.

Since your item still has tags attached and is in its original packaging, it's eligible for our 30-day return policy.

Here's what to do next:

1. Reply to this email with your order number (#12345) to initiate the return
2. We'll send you a prepaid return label within 24 hours
3. Pack the item securely and drop it off at any carrier location
4. Once we receive it, your refund will be processed within 3-5 business days

Since your order appears to be over $50, return shipping will be on us!

If you have any other questions, don't hesitate to ask.

Warm regards,
Forge Shop Support Team`,

  shipping: `Hi Mike,

Thank you for getting in touch about your order #67890. I understand how frustrating it can be when a package seems stuck in transit!

Our standard shipping typically takes 5-7 business days, and it looks like your package may have experienced a carrier delay. Here's what we can do:

1. I've flagged your order for our shipping team to investigate with the carrier
2. If the tracking doesn't update within the next 2 business days, we'll arrange a replacement or full refund — whichever you prefer
3. You'll receive an email update within 24 business hours

In the meantime, you can also contact the carrier directly with your tracking number for the most up-to-date information.

We sincerely apologize for the inconvenience and appreciate your patience!

Best,
Forge Shop Support Team`,

  product: `Hi Lisa,

Great question about the wireless headphones! I'm happy to help clarify compatibility.

Regarding your specific questions:

- **Wired connection**: Yes! These headphones include a 3.5mm audio cable in the box, so they work perfectly with your laptop's headphone jack. No Bluetooth required.
- **Battery life**: On wireless mode, you get approximately 20 hours of playback. When using the wired cable, they work passively with no battery drain at all.

All our electronics accessories come with a 1-year warranty, and you can find the full technical specifications on the product page — just look for the "Specs" tab.

If you have any other questions before purchasing, feel free to ask. We're happy to help you find the perfect fit!

Cheers,
Forge Shop Support Team`,

  billing: `Hi David,

Thank you for bringing this to our attention right away — a duplicate charge is definitely something we want to resolve quickly!

I can see there was an issue with the payment processing for order #54321. Here's what will happen:

1. We've identified the duplicate charge of $89.50
2. The refund has been initiated to your credit card on file
3. You should see the credit appear on your statement within **5-7 business days**

If you paid via PayPal, the refund will be instant. For credit cards, the timeline depends on your bank's processing.

For your records, please keep a note of this email. If you don't see the refund within 7 business days, please reply here and we'll escalate immediately.

We sincerely apologize for the inconvenience and thank you for your patience.

Best regards,
Forge Shop Support Team`,

  general: `Hi Emma,

What a lovely idea — a birthday gift for your mom!

Regarding your questions:

- **Gift wrapping**: Yes, we do offer gift wrapping! You'll find the option in your cart at checkout. There's a small $3.99 fee for premium gift wrapping with a ribbon.
- **Personalized message**: Absolutely! Once you select gift wrapping, a text box will appear where you can write a personalized message (up to 150 characters). We'll print it on a card and include it with your package.

If you're ordering for a birthday next week, we'd recommend choosing **Express 2-day shipping** ($12.99) at checkout to make sure it arrives in time — just order by 2pm ET on a weekday.

Hope your mom has a wonderful birthday!

Warmly,
Forge Shop Support Team`,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const INTENT_COLORS: Record<EmailIntent, string> = {
  return: "bg-orange-100 text-orange-800 border-orange-200",
  shipping: "bg-blue-100 text-blue-800 border-blue-200",
  product: "bg-green-100 text-green-800 border-green-200",
  billing: "bg-red-100 text-red-800 border-red-200",
  general: "bg-purple-100 text-purple-800 border-purple-200",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmailAgent() {
  const [searchParams] = useSearchParams();
  const gmailConnected = searchParams.get("gmail") === "connected";

  const [demoMode, setDemoMode] = useState(true);
  const [emails, setEmails] = useState<SampleEmail[]>(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<SampleEmail | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([
    { id: "classify", label: "Classifying intent…", icon: <Cpu className="w-4 h-4" />, status: "idle" },
    { id: "kb", label: "Looking up knowledge base…", icon: <BookOpen className="w-4 h-4" />, status: "idle" },
    { id: "draft", label: "Drafting reply…", icon: <Zap className="w-4 h-4" />, status: "idle" },
  ]);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [editedReply, setEditedReply] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState<string | null>(null);

  // Fetch real inbox when switching to Gmail mode
  useEffect(() => {
    if (!demoMode) {
      setInboxLoading(true);
      setInboxError(null);
      fetch("http://localhost:3001/api/gmail/inbox")
        .then((r) => r.json())
        .then((data: unknown) => {
          if (Array.isArray(data)) {
            setEmails(data as SampleEmail[]);
          } else {
            setInboxError("Failed to load inbox. Is the server running?");
          }
        })
        .catch(() => setInboxError("Cannot reach server at localhost:3001."))
        .finally(() => setInboxLoading(false));
    } else {
      setEmails(SAMPLE_EMAILS);
      setSelectedEmail(null);
      setAgentResult(null);
      setEditedReply("");
      resetPipeline();
    }
  }, [demoMode]);

  function resetPipeline() {
    setPipeline((prev) => prev.map((s) => ({ ...s, status: "idle" as const })));
  }

  function updateStage(id: string, status: PipelineStage["status"]) {
    setPipeline((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runDemoPipeline(email: SampleEmail) {
    setIsRunning(true);
    setAgentResult(null);
    setEditedReply("");
    resetPipeline();

    // Stage 1: Classify
    updateStage("classify", "running");
    await delay(800);
    updateStage("classify", "done");

    // Stage 2: KB lookup
    updateStage("kb", "running");
    await delay(600);
    updateStage("kb", "done");

    // Stage 3: Draft
    updateStage("draft", "running");
    await delay(1200);
    updateStage("draft", "done");

    const result: AgentResult = {
      intent: email.intent,
      confidence: 0.92 + Math.random() * 0.07,
      kbContext: MOCK_KB_CONTEXTS[email.intent],
      reply: MOCK_REPLIES[email.intent],
    };

    setAgentResult(result);
    setEditedReply(result.reply);
    setIsRunning(false);
  }

  async function runRealPipeline(email: SampleEmail) {
    setIsRunning(true);
    setAgentResult(null);
    setEditedReply("");
    resetPipeline();

    try {
      // Stage 1: Classify
      updateStage("classify", "running");
      const classifyRes = await fetch("http://localhost:3001/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: email.subject, body: email.body }),
      });
      const { intent, confidence } = (await classifyRes.json()) as {
        intent: EmailIntent;
        confidence: number;
      };
      updateStage("classify", "done");

      // Stage 2: KB + Draft
      updateStage("kb", "running");
      await delay(200);
      updateStage("kb", "done");

      updateStage("draft", "running");
      const respondRes = await fetch("http://localhost:3001/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, intent }),
      });
      const { reply, kbContext } = (await respondRes.json()) as {
        reply: string;
        kbContext: string;
      };
      updateStage("draft", "done");

      setAgentResult({ intent, confidence, kbContext, reply });
      setEditedReply(reply);
    } catch (err) {
      console.error(err);
      pipeline.forEach((s) => {
        if (s.status === "running") updateStage(s.id, "error");
      });
    } finally {
      setIsRunning(false);
    }
  }

  function handleSelectEmail(email: SampleEmail) {
    setSelectedEmail(email);
    setAgentResult(null);
    setEditedReply("");
    resetPipeline();
  }

  function handleRunAgent() {
    if (!selectedEmail) return;
    if (demoMode) {
      runDemoPipeline(selectedEmail);
    } else {
      runRealPipeline(selectedEmail);
    }
  }

  async function handleSendReply() {
    if (!selectedEmail || !editedReply) return;

    if (demoMode) {
      setSentIds((prev) => new Set(prev).add(selectedEmail.id));
      return;
    }

    try {
      await fetch("http://localhost:3001/api/gmail/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedEmail.threadId,
          to: selectedEmail.from,
          subject: selectedEmail.subject,
          body: editedReply,
        }),
      });
      setSentIds((prev) => new Set(prev).add(selectedEmail.id));
    } catch (err) {
      console.error("Send failed:", err);
    }
  }

  const stageIconClass = (status: PipelineStage["status"]) => {
    if (status === "running") return "text-blue-500 animate-pulse";
    if (status === "done") return "text-green-600";
    if (status === "error") return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:block">Email Agent</span>
            </Link>
            {demoMode && (
              <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-xs font-semibold">
                DEMO MODE
              </Badge>
            )}
            {gmailConnected && !demoMode && (
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs font-semibold">
                Gmail Connected
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="demo-toggle"
                checked={demoMode}
                onCheckedChange={setDemoMode}
              />
              <Label htmlFor="demo-toggle" className="text-sm cursor-pointer">
                Demo mode
              </Label>
            </div>

            {!demoMode && !gmailConnected && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open("http://localhost:3001/api/gmail/auth", "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Connect Gmail
              </Button>
            )}

            <Link to="/guide">
              <Button size="sm" variant="ghost">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Guide
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main split view */}
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
          {/* Left — inbox list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {demoMode ? "Sample Emails" : "Inbox"}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {emails.length}
              </Badge>
            </div>

            {inboxLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading inbox…
              </div>
            )}

            {inboxError && (
              <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{inboxError}</p>
              </div>
            )}

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="flex flex-col gap-2 pr-2">
                {emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const isSent = sentIds.has(email.id);
                  return (
                    <button
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`text-left rounded-lg border p-3 transition-all hover:border-primary/40 hover:bg-muted/50 ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isSent ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          ) : (
                            <MailOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          )}
                          <span className="text-xs text-muted-foreground truncate">
                            {email.from.split("@")[0]}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-snug line-clamp-2">
                        {email.subject}
                      </p>
                      {demoMode && (
                        <Badge
                          variant="outline"
                          className={`mt-1.5 text-xs ${INTENT_COLORS[(email as SampleEmail).intent]}`}
                        >
                          {(email as SampleEmail).intent}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right — email detail + agent */}
          <div className="flex flex-col gap-4">
            {!selectedEmail ? (
              <div className="flex-1 flex items-center justify-center border rounded-xl border-dashed border-border bg-muted/20 min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Select an email to get started</p>
                  <p className="text-sm mt-1">The agent will classify it and draft a reply</p>
                </div>
              </div>
            ) : (
              <>
                {/* Email detail card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base leading-snug">
                          {selectedEmail.subject}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          From: <span className="text-foreground">{selectedEmail.from}</span>
                          {" · "}
                          {formatDate(selectedEmail.date)}
                        </p>
                      </div>
                      {agentResult && (
                        <Badge
                          variant="outline"
                          className={`shrink-0 ${INTENT_COLORS[agentResult.intent]}`}
                        >
                          {agentResult.intent}
                          {" · "}
                          {Math.round(agentResult.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                      {selectedEmail.body}
                    </p>
                  </CardContent>
                </Card>

                {/* Pipeline + Run button */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Button
                    onClick={handleRunAgent}
                    disabled={isRunning || sentIds.has(selectedEmail.id)}
                    className="gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running agent…
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Run Agent
                      </>
                    )}
                  </Button>

                  {/* Pipeline stages */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {pipeline.map((stage, i) => (
                      <div key={stage.id} className="flex items-center gap-1.5">
                        {i > 0 && (
                          <span className="text-muted-foreground/40 text-xs">→</span>
                        )}
                        <span
                          className={`flex items-center gap-1 text-xs font-medium ${stageIconClass(stage.status)}`}
                        >
                          {stage.status === "running" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : stage.status === "done" ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            stage.icon
                          )}
                          {stage.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KB context (collapsed by default, shown after pipeline) */}
                {agentResult && (
                  <>
                    <details className="group">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 select-none">
                        <BookOpen className="w-3.5 h-3.5" />
                        Knowledge base context used
                        <span className="group-open:hidden">(click to expand)</span>
                      </summary>
                      <pre className="mt-2 text-xs bg-muted/60 rounded-lg p-3 whitespace-pre-wrap leading-relaxed font-mono overflow-auto max-h-40">
                        {agentResult.kbContext}
                      </pre>
                    </details>

                    <Separator />

                    {/* Drafted reply */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Drafted reply
                          <span className="font-normal text-muted-foreground ml-2 text-xs">
                            (editable before sending)
                          </span>
                        </Label>
                        {sentIds.has(selectedEmail.id) && (
                          <Badge
                            variant="outline"
                            className="text-green-700 border-green-300 bg-green-50 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Sent
                          </Badge>
                        )}
                      </div>

                      <Textarea
                        value={editedReply}
                        onChange={(e) => setEditedReply(e.target.value)}
                        disabled={sentIds.has(selectedEmail.id)}
                        className="min-h-[220px] font-mono text-sm leading-relaxed resize-y"
                      />

                      <div className="flex justify-end">
                        <Button
                          onClick={handleSendReply}
                          disabled={
                            !editedReply.trim() || sentIds.has(selectedEmail.id)
                          }
                          className="gap-2"
                        >
                          <Send className="w-4 h-4" />
                          {demoMode ? "Send Reply (demo)" : "Send Reply"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
