import React, { useState } from "react";
import { CandidateProfile } from "../types/candidate";
import { Send, X, Building2 } from "lucide-react";
import { CompanyDocument } from "@talent-flow/api";

interface HelpdeskModalProps {
  candidate: CandidateProfile;
  onClose: () => void;
  company?: CompanyDocument | null;
}

export const HelpdeskModal: React.FC<HelpdeskModalProps> = ({ candidate, onClose, company }) => {
  const adminName = company?.admin?.fullName || candidate.recruiter.name;
  const compName = company?.name || candidate.companyName || "Acme Corporation";
  const compColor = company?.brandColor || "#6366f1";

  const [messages, setMessages] = useState([
    {
      sender: "recruiter",
      name: adminName,
      text: `Hi ${candidate.name}! Welcome to ${compName}'s candidate onboarding hub. Feel free to message ${adminName} or HR directly if you have any questions!`,
      time: "10:00 AM",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMessage = {
      sender: "candidate",
      name: candidate.name,
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, userMessage]);
    setInputMsg("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "recruiter",
          name: adminName,
          text: `Thanks for reaching out! I've received your note regarding "${inputMsg.slice(0, 30)}..." and ${compName}'s HR team will respond shortly.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full p-5 shadow-lifted space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={compName}
                className="size-9 rounded-xl object-cover border border-border bg-surface p-0.5 shadow-xs shrink-0"
              />
            ) : (
              <div
                className="size-9 rounded-xl grid place-items-center text-white font-bold text-xs shadow-xs shrink-0"
                style={{ backgroundColor: compColor }}
              >
                {compName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-foreground">
                {adminName} · {compName} HR
              </div>
              <div className="text-11px text-ember flex items-center gap-1">
                <Building2 className="size-3" />
                <span>{company?.admin?.workEmail || candidate.recruiter.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md bg-surface hover:bg-accent/60 text-muted-foreground hover:text-foreground border border-border cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "candidate" ? "items-end" : "items-start"}`}
            >
              <div
                className={`p-3 rounded-md max-w-[85%] text-xs ${
                  m.sender === "candidate"
                    ? "bg-ember text-ember-foreground"
                    : "bg-surface text-foreground border border-border"
                }`}
              >
                <p>{m.text}</p>
              </div>
              <span className="text-9px text-muted-foreground mt-0.5 px-1">
                {m.name} · {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-border">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your question for HR or Recruiter..."
            className="flex-1 px-3.5 py-2 rounded-md bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-ember"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-md bg-ember text-ember-foreground text-xs font-semibold flex items-center gap-1 transition-colors hover:bg-ember/90 cursor-pointer shadow-xs"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
