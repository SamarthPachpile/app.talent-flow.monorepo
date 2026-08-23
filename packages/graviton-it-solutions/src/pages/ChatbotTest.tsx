import { useState } from "react";
import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import { usePageMeta } from "@graviton/lib/use-page-meta";
import {
  answerQuestion,
  clearUnmatchedLog,
  exportUnmatchedLog,
  getUnmatchedLog,
  type MatchResult,
} from "@graviton/lib/graviton-kb";
import { Check, X, Download, Trash2, Play } from "lucide-react";

type TestCase = {
  query: string;
  expectId?: string;
  expectMatched?: boolean;
};

const SUITE: TestCase[] = [
  // Company
  { query: "What does Graviton do?", expectId: "what-is-graviton" },
  { query: "tell me about your company", expectId: "what-is-graviton" },
  { query: "where are you located", expectId: "office-location" },
  { query: "address?", expectId: "office-location" },
  { query: "which industries do you serve", expectId: "industries" },
  // Services
  { query: "what services do you offer", expectId: "services-overview" },
  { query: "do you do CRM consulting", expectId: "crm-strategy" },
  { query: "implement salesforce for us", expectId: "implementation" },
  { query: "we want to migrate from zoho to hubspot", expectId: "migration" },
  { query: "can you integrate CRM with our ERP", expectId: "integration" },
  { query: "build dashboards in power bi", expectId: "analytics" },
  { query: "snowflake pipeline", expectId: "data-engineering" },
  // Platforms (synonyms)
  { query: "do you work with sfdc", expectId: "salesforce" },
  { query: "what about sf?", expectId: "salesforce" },
  { query: "hubspot", expectId: "hubspot" },
  { query: "zoho one", expectId: "zoho" },
  { query: "ms dynamics", expectId: "dynamics" },
  { query: "d365", expectId: "dynamics" },
  { query: "salesforce vs hubspot", expectId: "salesforce-vs-hubspot" },
  { query: "which CRM is better for us", expectId: "salesforce-vs-hubspot" },
  // AI
  { query: "where can AI add value in CRM", expectId: "ai-in-crm" },
  { query: "predictive lead scoring", expectId: "lead-scoring" },
  { query: "build a sales copilot", expectId: "copilots" },
  { query: "call summary tool like gong", expectId: "conversation-intelligence" },
  { query: "what is agentic ai", expectId: "agentic-ai" },
  { query: "is our data ready for AI", expectId: "ai-readiness" },
  // Pricing / engagement
  { query: "how much does it cost", expectId: "pricing" },
  { query: "can I get a quote", expectId: "pricing" },
  { query: "how long does implementation take", expectId: "timeline" },
  { query: "do you offer managed services", expectId: "support" },
  { query: "how do you measure ROI", expectId: "roi" },
  { query: "soc 2 compliance", expectId: "security-compliance" },
  // Meta
  { query: "talk to sales", expectId: "contact" },
  { query: "book a demo", expectId: "contact" },
  { query: "open positions", expectId: "careers" },
  { query: "are you hiring", expectId: "careers" },
  { query: "hi", expectId: "greeting" },
  { query: "thanks!", expectId: "thanks" },
  // Should *not* confidently match (off-topic)
  { query: "weather in tokyo", expectMatched: false },
  { query: "recipe for pasta", expectMatched: false },
];

type Row = {
  test: TestCase;
  result: MatchResult;
  pass: boolean;
};

function runSuite(): Row[] {
  return SUITE.map((test) => {
    const result = answerQuestion(test.query);
    let pass = true;
    if (test.expectId !== undefined) {
      pass = result.topId === test.expectId && result.confidence === "high";
    } else if (test.expectMatched === false) {
      pass = result.confidence !== "high";
    }
    return { test, result, pass };
  });
}

export default function ChatbotTest() {
  usePageMeta(
    "Chatbot Test — Graviton",
    "Internal: run sample questions against the local chatbot knowledge base.",
  );
  const [rows, setRows] = useState<Row[]>(() => runSuite());
  const [log, setLog] = useState(() => getUnmatchedLog());

  const passed = rows.filter((r) => r.pass).length;
  const total = rows.length;

  const downloadLog = () => {
    const csv = exportUnmatchedLog();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `graviton-unmatched-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section
        id="chatbot-test"
        data-section="chatbot-test"
        data-label="Tests"
        className="pt-32 pb-16 sm:pt-36 max-w-[1200px] mx-auto px-4 sm:px-6"
      >
        <p className="text-10px sm:text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Internal · Diagnostic
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">Chatbot Test Suite</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Runs {SUITE.length} sample questions against the local knowledge base and verifies the
          matched entry id and confidence. Use this to grow the dataset.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              passed === total
                ? "bg-green-100 text-green-700"
                : passed / total > 0.8
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {passed} / {total} passing
          </div>
          <button
            onClick={() => setRows(runSuite())}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-gl-orange-hover transition"
          >
            <Play className="w-4 h-4" /> Re-run
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-3 py-2 w-10">#</th>
                <th className="px-3 py-2 w-16">Pass</th>
                <th className="px-3 py-2">Query</th>
                <th className="px-3 py-2">Expected</th>
                <th className="px-3 py-2">Matched</th>
                <th className="px-3 py-2 w-20">Conf</th>
                <th className="px-3 py-2 w-16 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2">
                    {r.pass ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.test.query}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {r.test.expectId ?? (r.test.expectMatched === false ? "(no match)" : "—")}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{r.result.topId ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">{r.result.confidence}</td>
                  <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                    {r.result.score?.toFixed(1) ?? "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="unmatched-log"
        data-section="unmatched-log"
        data-label="Unmatched Log"
        className="pb-24 max-w-[1200px] mx-auto px-4 sm:px-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold">Unmatched query log</h2>
            <p className="text-muted-foreground text-sm">
              Captured locally on this device — {log.length} entr{log.length === 1 ? "y" : "ies"}.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLog(getUnmatchedLog())}
              className="text-sm px-3 py-2 rounded-full border border-border hover:bg-muted"
            >
              Refresh
            </button>
            <button
              disabled={log.length === 0}
              onClick={downloadLog}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-foreground text-background disabled:opacity-40"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              disabled={log.length === 0}
              onClick={() => {
                clearUnmatchedLog();
                setLog(getUnmatchedLog());
              }}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full border border-border hover:bg-muted disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {log.length === 0 ? (
          <p className="text-sm text-muted-foreground">No unmatched queries logged yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Confidence</th>
                  <th className="px-3 py-2 text-right">Top score</th>
                  <th className="px-3 py-2">Query</th>
                </tr>
              </thead>
              <tbody>
                {[...log].reverse().map((e, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(e.ts).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-xs">{e.confidence}</td>
                    <td className="px-3 py-2 text-right text-xs">{e.topScore}</td>
                    <td className="px-3 py-2">{e.query}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
