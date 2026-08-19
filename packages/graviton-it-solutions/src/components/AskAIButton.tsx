import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { answerQuestion } from "@graviton/lib/graviton-kb";

type Msg = {
  role: "user" | "assistant";
  content: string;
  followups?: string[];
};

const INITIAL_SUGGESTIONS = [
  "What does Graviton do?",
  "Salesforce vs HubSpot — which fits us?",
  "How long does a CRM implementation take?",
  "Where can AI add value in my CRM?",
];

export default function AskAIButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const lastFollowups = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "assistant" && m.followups && m.followups.length) {
        return m.followups;
      }
    }
    return [];
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setTyping(true);

    // Tiny artificial delay so the typing dots feel natural.
    const delay = 350 + Math.min(700, q.length * 12);
    window.setTimeout(() => {
      const result = answerQuestion(q);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: result.answer,
          followups: result.followups,
        },
      ]);
      setTyping(false);
    }, delay);
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-60 flex items-center gap-2.5 pl-2 pr-5 py-2 rounded-full bg-background border-2 border-primary shadow-[0_8px_30px_-6px_rgba(229,90,40,0.4)] hover:shadow-[0_8px_40px_-4px_rgba(229,90,40,0.55)] transition-shadow"
        aria-label="Open Ask AI"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-primary-foreground">
          <Sparkles className="w-4 h-4" strokeWidth={2.5} />
        </span>
        <span className="text-sm font-medium text-foreground">How can I help you?</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[80] w-[calc(100vw-2rem)] sm:w-440px h-[80vh] sm:h-600px max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-primary/40"
              style={{
                background: "linear-gradient(180deg, #fff7f1 0%, #fffaf6 40%, #ffffff 100%)",
                boxShadow: "0 20px 60px -10px rgba(0,0,0,0.3), 0 0 0 2px rgba(229,90,40,0.5)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-primary/15 bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-primary-foreground">
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-foreground">Graviton AI</span>
                    <span className="text-10px text-muted-foreground">CRM &amp; AI assistant</span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5 space-y-4"
              >
                <div className="flex gap-3">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-primary-foreground">
                    <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1.5">
                      Hi there — I'm your Graviton AI guide.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Ask me anything about CRM strategy, Salesforce / HubSpot / Zoho, AI in CRM,
                      implementation timelines, or our services.
                    </p>
                    {messages.length === 0 && (
                      <div className="flex flex-wrap gap-2">
                        {INITIAL_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="text-xs sm:text-sm px-3.5 py-2 rounded-full bg-primary/10 text-foreground hover:bg-primary/20 transition-colors border border-primary/20"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                    {m.role === "assistant" && (
                      <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-primary-foreground">
                        <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                    )}
                    <div
                      className={`max-w-80% text-sm px-4 py-2.5 rounded-2xl prose prose-sm prose-p:my-1 prose-ul:my-1 ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm prose-invert"
                          : "bg-white/80 text-foreground rounded-tl-sm border border-primary/10"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-3">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-primary-foreground">
                      <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div className="bg-white/80 border border-primary/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}

                {!typing && lastFollowups.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-11">
                    {lastFollowups.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-foreground hover:bg-primary/20 transition-colors border border-primary/20"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-primary/15 bg-white/70 backdrop-blur-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2 bg-white rounded-full pl-5 pr-1.5 py-1.5 border border-primary/20"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, 500))}
                    placeholder="Ask anything about CRM or AI…"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-gl-orange-hover transition-colors disabled:opacity-50"
                    disabled={!input.trim() || typing}
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-10px text-muted-foreground text-center mt-2 leading-relaxed">
                  Answers come from Graviton's own knowledge base — no external AI.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
