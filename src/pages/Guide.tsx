import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  ArrowLeft,
  Cpu,
  Zap,
  BookOpen,
  Key,
  Server,
  Rocket,
  Code2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Code block helper ────────────────────────────────────────────────────────

function CodeBlock({ code, lang = "typescript" }: { code: string; lang?: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/80 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{lang}</span>
      </div>
      <pre className="overflow-x-auto p-4 bg-[hsl(var(--muted)/0.4)] text-sm font-mono leading-relaxed whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Guide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/agent">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back to Agent
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-bold text-base">Developer Guide</span>
            </div>
          </div>
          <Link to="/">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold hidden sm:block">Email Agent</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="container py-10 max-w-4xl">
        {/* Hero */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 text-xs text-primary border-primary/30 bg-primary/5">
            Customer Service Email Agent Framework
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-3">How it works</h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            A complete walkthrough of building an AI-powered email triage and response system using
            Anthropic's Claude models, Gmail OAuth, and a knowledge base — all without writing a single rule.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="models">Model selection</TabsTrigger>
            <TabsTrigger value="gmail">Gmail OAuth</TabsTrigger>
            <TabsTrigger value="kb">Knowledge base</TabsTrigger>
            <TabsTrigger value="deploy">Deploying</TabsTrigger>
          </TabsList>

          {/* ── OVERVIEW ───────────────────────────────────────────────── */}
          <TabsContent value="overview" className="flex flex-col gap-8">
            <Section id="what" icon={<Zap className="w-4 h-4" />} title="What this agent does">
              <p className="text-muted-foreground leading-relaxed">
                This framework automates the first-response layer of customer support email. Given an
                incoming email, the agent:
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    step: "1",
                    title: "Classifies intent",
                    desc: "Uses Claude Haiku — a fast, cheap model — to categorize the email as return, shipping, product, billing, or general.",
                    color: "bg-blue-50 border-blue-200 text-blue-700",
                  },
                  {
                    step: "2",
                    title: "Looks up the KB",
                    desc: "Queries a local TypeScript knowledge base keyed by intent. No vector database needed — simple and auditable.",
                    color: "bg-green-50 border-green-200 text-green-700",
                  },
                  {
                    step: "3",
                    title: "Drafts a reply",
                    desc: "Uses Claude Sonnet to write a personalized, policy-accurate reply using the KB context as grounding.",
                    color: "bg-purple-50 border-purple-200 text-purple-700",
                  },
                ].map(({ step, title, desc, color }) => (
                  <Card key={step} className={`border ${color.split(" ").slice(1).join(" ")}`}>
                    <CardHeader className="pb-2">
                      <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-xs font-bold mb-1`}>
                        {step}
                      </div>
                      <CardTitle className="text-sm">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Demo mode</strong> — the default — runs entirely in the browser with no API keys
                    required. Toggle off demo mode and start the Express server to connect to real Gmail
                    and call live Claude APIs.
                  </p>
                </CardContent>
              </Card>
            </Section>

            <Separator />

            <Section id="structure" icon={<Code2 className="w-4 h-4" />} title="Project structure">
              <CodeBlock
                lang="text"
                code={`forge-content-1/
├── server/
│   ├── index.ts          # Express API server
│   ├── anthropic.ts      # Claude classify + draftReply
│   ├── gmail.ts          # Gmail OAuth + read/send
│   ├── knowledge-base.ts # KB data + lookupKB()
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── src/
    └── pages/
        ├── EmailAgent.tsx  # Main UI (this page)
        └── Guide.tsx       # This guide`}
              />
            </Section>
          </TabsContent>

          {/* ── PIPELINE ───────────────────────────────────────────────── */}
          <TabsContent value="pipeline" className="flex flex-col gap-8">
            <Section id="pipeline" icon={<Cpu className="w-4 h-4" />} title="The agent pipeline">
              <p className="text-muted-foreground leading-relaxed">
                The pipeline is a simple three-step sequential chain. Each step is a separate API call
                with a different model optimized for the task.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="classify">
                  <AccordionTrigger className="font-semibold">
                    Step 1: classifyEmail() — Haiku
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      Sends the email subject + body to Claude Haiku with a strict JSON-output prompt.
                      Classification is a low-stakes, structured-output task — Haiku handles it
                      perfectly at ~10x lower cost than Sonnet.
                    </p>
                    <CodeBlock
                      code={`// server/anthropic.ts
export async function classifyEmail(
  subject: string,
  body: string
): Promise<ClassificationResult> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{
      role: "user",
      content: \`Classify this customer service email into exactly one of:
return, shipping, product, billing, general.

Subject: \${subject}
Body: \${body}

Respond with JSON only: {"intent": "...", "confidence": 0.0-1.0}\`
    }],
  });
  return JSON.parse(text) as ClassificationResult;
}`}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="kb">
                  <AccordionTrigger className="font-semibold">
                    Step 2: lookupKB() — no LLM needed
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      A simple TypeScript dictionary lookup — no vector search, no embeddings.
                      The intent key maps directly to a section of the knowledge base.
                      This context is then passed to Sonnet for grounding.
                    </p>
                    <CodeBlock
                      code={`// server/knowledge-base.ts
export function lookupKB(intent: string): string {
  const section = KB[intent] || KB.general;
  return Object.entries(section)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return \`\${key}:\\n\${value.join("\\n")}\`;
      }
      return \`\${key}: \${value}\`;
    })
    .join("\\n\\n");
}`}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="draft">
                  <AccordionTrigger className="font-semibold">
                    Step 3: draftReply() — Sonnet
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      The KB context is injected into the Sonnet prompt alongside the original email.
                      Sonnet produces a professional, personalized reply grounded in your policies.
                      The UI makes the reply editable before sending — a human stays in the loop.
                    </p>
                    <CodeBlock
                      code={`// server/anthropic.ts
export async function draftReply(
  email: { subject: string; body: string; from: string },
  kbContext: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: \`You are a customer service agent for Forge Shop.
Draft a professional, friendly reply using the KB context.

Customer Email:
From: \${email.from}
Subject: \${email.subject}
Body: \${email.body}

Knowledge Base Context:
\${kbContext}

Write only the email body. Sign off as "Forge Shop Support Team".\`
    }],
  });
  return text;
}`}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="endpoint">
                  <AccordionTrigger className="font-semibold">
                    API endpoints — Express server
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { method: "POST", path: "/api/classify", desc: "Classify email intent via Haiku" },
                        { method: "POST", path: "/api/respond", desc: "Generate KB context + Sonnet reply" },
                        { method: "GET", path: "/api/gmail/auth", desc: "Redirect to Google OAuth screen" },
                        { method: "GET", path: "/api/gmail/callback", desc: "Handle OAuth code exchange" },
                        { method: "GET", path: "/api/gmail/inbox", desc: "Fetch unread Gmail messages" },
                        { method: "POST", path: "/api/gmail/reply", desc: "Send a reply via Gmail" },
                      ].map(({ method, path, desc }) => (
                        <div key={path} className="flex items-start gap-2 rounded-lg border p-3 bg-muted/30">
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 ${
                              method === "POST"
                                ? "text-blue-700 border-blue-300 bg-blue-50"
                                : "text-green-700 border-green-300 bg-green-50"
                            }`}
                          >
                            {method}
                          </Badge>
                          <div>
                            <p className="text-xs font-mono font-semibold">{path}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>
          </TabsContent>

          {/* ── MODELS ─────────────────────────────────────────────────── */}
          <TabsContent value="models" className="flex flex-col gap-8">
            <Section id="models" icon={<Cpu className="w-4 h-4" />} title="Model selection criteria">
              <p className="text-muted-foreground leading-relaxed">
                This project uses two models with different roles. Understanding when to use which model
                is key to building efficient, cost-effective agents.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Model</th>
                      <th className="text-left py-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Speed</th>
                      <th className="text-left py-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Cost</th>
                      <th className="text-left py-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Best for</th>
                      <th className="text-left py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Used here</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">Haiku</Badge>
                      </td>
                      <td className="py-3 pr-4 text-green-600 font-medium">Fastest</td>
                      <td className="py-3 pr-4 text-green-600 font-medium">Lowest</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        Classification, extraction, structured output, short Q&A
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 text-green-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          classifyEmail()
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">Sonnet</Badge>
                      </td>
                      <td className="py-3 pr-4 text-amber-600 font-medium">Fast</td>
                      <td className="py-3 pr-4 text-amber-600 font-medium">Moderate</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        Long-form writing, nuanced reasoning, complex instructions
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 text-green-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          draftReply()
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">Opus</Badge>
                      </td>
                      <td className="py-3 pr-4 text-red-500 font-medium">Slower</td>
                      <td className="py-3 pr-4 text-red-500 font-medium">Highest</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        Deep research, complex multi-step reasoning, agentic tasks
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        Not used (overkill for this)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-sm mb-2">Why Haiku for classification?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Classification is a low-complexity, high-volume task with a constrained output space
                    (5 categories). Haiku handles this reliably at roughly 10x lower cost than Sonnet.
                    At 1,000 emails/day, that's a significant saving. Reserve Sonnet (and its larger
                    context window and stronger reasoning) for the drafting step where quality matters.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-sm mb-2">When would you upgrade to Opus?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>Handling escalations that require deep policy interpretation</li>
                    <li>Autonomously researching order history across multiple systems</li>
                    <li>Drafting responses to legally sensitive or high-value enterprise complaints</li>
                    <li>Multi-turn agentic workflows (look up order → check inventory → issue refund)</li>
                  </ul>
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* ── GMAIL ──────────────────────────────────────────────────── */}
          <TabsContent value="gmail" className="flex flex-col gap-8">
            <Section id="gmail" icon={<Key className="w-4 h-4" />} title="Setting up Gmail OAuth">
              <p className="text-muted-foreground leading-relaxed">
                Gmail integration uses OAuth 2.0 with the Google People + Gmail APIs. Here's the
                complete setup process.
              </p>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="gcp">
                  <AccordionTrigger className="font-semibold">
                    1. Create a Google Cloud project
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                      <li>Go to <code className="text-xs bg-muted px-1 py-0.5 rounded">console.cloud.google.com</code></li>
                      <li>Create a new project (or use an existing one)</li>
                      <li>Navigate to <strong>APIs & Services → Library</strong></li>
                      <li>Search for and enable <strong>Gmail API</strong></li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="oauth-screen">
                  <AccordionTrigger className="font-semibold">
                    2. Configure the OAuth consent screen
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                      <li>Go to <strong>APIs & Services → OAuth consent screen</strong></li>
                      <li>Choose <strong>External</strong> (or Internal for Google Workspace)</li>
                      <li>Fill in app name, user support email, developer contact</li>
                      <li>Add scopes: <code className="text-xs bg-muted px-1 py-0.5 rounded">gmail.readonly</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">gmail.send</code></li>
                      <li>Add your email as a test user (required for external apps)</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="credentials">
                  <AccordionTrigger className="font-semibold">
                    3. Create OAuth 2.0 credentials
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                      <li>Go to <strong>APIs & Services → Credentials</strong></li>
                      <li>Click <strong>Create Credentials → OAuth client ID</strong></li>
                      <li>Choose <strong>Web application</strong></li>
                      <li>Add authorized redirect URI: <code className="text-xs bg-muted px-1 py-0.5 rounded">http://localhost:3001/api/gmail/callback</code></li>
                      <li>Download the JSON or copy your Client ID and Secret</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="env">
                  <AccordionTrigger className="font-semibold">
                    4. Configure environment variables
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      Copy <code className="text-xs bg-muted px-1 py-0.5 rounded">server/.env.example</code> to <code className="text-xs bg-muted px-1 py-0.5 rounded">server/.env</code> and fill in your values:
                    </p>
                    <CodeBlock
                      lang="bash"
                      code={`ANTHROPIC_API_KEY=sk-ant-...
GMAIL_CLIENT_ID=12345-abc.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REDIRECT_URI=http://localhost:3001/api/gmail/callback
PORT=3001`}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="run">
                  <AccordionTrigger className="font-semibold">
                    5. Start the server and connect
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <CodeBlock
                      lang="bash"
                      code={`cd server
npm install
npm run dev
# Server starts on http://localhost:3001

# In a second terminal:
cd ..
npm run dev
# Frontend starts on http://localhost:5173`}
                    />
                    <p className="text-sm text-muted-foreground">
                      Then in the Email Agent UI: toggle <strong>Demo mode off</strong> and click
                      <strong> Connect Gmail</strong>. You'll be redirected to Google's consent screen.
                      After authorizing, you'll be returned to the agent with a live inbox.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>
          </TabsContent>

          {/* ── KB ─────────────────────────────────────────────────────── */}
          <TabsContent value="kb" className="flex flex-col gap-8">
            <Section id="kb" icon={<BookOpen className="w-4 h-4" />} title="Customizing the knowledge base">
              <p className="text-muted-foreground leading-relaxed">
                The knowledge base is a plain TypeScript object in{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">server/knowledge-base.ts</code>.
                No database or embedding pipeline required — just edit the data.
              </p>

              <CodeBlock
                code={`// server/knowledge-base.ts
const KB: Record<string, KBSection> = {
  return: {
    policy: "30-day returns on all items...",
    steps: [
      "1. Email support@yourshop.com with order number",
      "2. We'll send a prepaid label within 24 hours",
      // add more steps...
    ],
  },
  shipping: {
    domestic: "Standard 5-7 days ($4.99)...",
    express: "2-day express for $12.99...",
  },
  // Add new intent sections here:
  warranty: {
    policy: "All electronics carry a 1-year manufacturer warranty...",
    claimProcess: "Visit our warranty portal at...",
  },
};`}
              />

              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-sm mb-3">Adding a new intent category</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      Add a new key to <code className="text-xs bg-muted px-1 py-0.5 rounded">KB</code> in{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">knowledge-base.ts</code>
                    </li>
                    <li>
                      Add the new intent string to the <code className="text-xs bg-muted px-1 py-0.5 rounded">EmailIntent</code> union type in{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">anthropic.ts</code>
                    </li>
                    <li>
                      Update the classification prompt to include the new category name
                    </li>
                    <li>
                      (Optional) Add a demo entry in{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">MOCK_KB_CONTEXTS</code>{" "}
                      and <code className="text-xs bg-muted px-1 py-0.5 rounded">MOCK_REPLIES</code>{" "}
                      in <code className="text-xs bg-muted px-1 py-0.5 rounded">EmailAgent.tsx</code>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">For larger knowledge bases</p>
                    <p className="leading-relaxed">
                      At scale, consider replacing the dictionary with a retrieval step: embed KB chunks
                      with <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-xs">text-embedding-3-small</code> (or Voyage AI),
                      store in Pinecone/pgvector, and do a semantic search instead of a direct key lookup.
                      The rest of the pipeline stays the same.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* ── DEPLOY ─────────────────────────────────────────────────── */}
          <TabsContent value="deploy" className="flex flex-col gap-8">
            <Section id="deploy" icon={<Rocket className="w-4 h-4" />} title="Deploying to production">
              <p className="text-muted-foreground leading-relaxed">
                The server is a standard Express app. Here's how to take it to production.
              </p>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="token-storage">
                  <AccordionTrigger className="font-semibold">
                    Token storage (important!)
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      Currently, OAuth tokens are stored in a module-level variable
                      (<code className="text-xs bg-muted px-1 py-0.5 rounded">storedTokens</code> in{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">gmail.ts</code>).
                      This is fine for local demos but will lose tokens on server restart.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      For production, persist tokens to a database (e.g. Postgres, Redis, or even
                      a local encrypted JSON file). Encrypt the{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">refresh_token</code> at rest.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="railway">
                  <AccordionTrigger className="font-semibold">
                    Deploy server to Railway / Fly.io / Render
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <CodeBlock
                      lang="bash"
                      code={`# Build the server
cd server
npm run build

# The dist/ folder contains compiled JS
# Set environment variables in your hosting dashboard:
# ANTHROPIC_API_KEY, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET
# GMAIL_REDIRECT_URI=https://your-server-domain.com/api/gmail/callback
# PORT=3001`}
                    />
                    <p className="text-sm text-muted-foreground">
                      Update the Google Cloud Console redirect URI to your production server URL.
                      Update the frontend API base URL (currently hardcoded to{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">localhost:3001</code>) to your
                      deployed server URL — use a{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_API_URL</code> env var.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="scale">
                  <AccordionTrigger className="font-semibold">
                    Scaling the pipeline
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                      <li>Use a job queue (BullMQ, Inngest) to process emails asynchronously</li>
                      <li>Add a Gmail Push Notification webhook instead of polling the inbox</li>
                      <li>Cache KB lookups in Redis (TTL: your policy update frequency)</li>
                      <li>Add Anthropic prompt caching for the system prompt to cut ~90% of input token costs</li>
                      <li>Log intent + confidence to a database to monitor drift and retrain prompts</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="server-start">
                  <AccordionTrigger className="font-semibold">
                    Quick local start commands
                  </AccordionTrigger>
                  <AccordionContent>
                    <CodeBlock
                      lang="bash"
                      code={`# Terminal 1 — API server
cd server && cp .env.example .env
# Edit .env with your keys
npm install && npm run dev

# Terminal 2 — Frontend
npm run dev

# Then visit http://localhost:5173/agent
# Toggle off "Demo mode" to use live Gmail + Claude APIs`}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>

            <Separator />

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
              <div>
                <p className="font-semibold text-sm">Ready to try it?</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Demo mode works with zero configuration.
                </p>
              </div>
              <Link to="/agent">
                <Button className="gap-2">
                  <Server className="w-4 h-4" />
                  Open Email Agent
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
