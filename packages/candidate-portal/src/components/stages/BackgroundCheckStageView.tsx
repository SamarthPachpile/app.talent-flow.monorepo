import React, { useState } from "react";
import { BackgroundCheck } from "../../types/candidate";
import { ShieldCheck, Upload, FileText, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

interface BackgroundCheckStageViewProps {
  backgroundCheck: BackgroundCheck;
  onUploadDoc: (docId: string) => void;
}

export const BackgroundCheckStageView: React.FC<BackgroundCheckStageViewProps> = ({
  backgroundCheck,
  onUploadDoc,
}) => {
  const [ssnInput, setSsnInput] = useState(
    backgroundCheck.ssnLast4 ? `***-**-${backgroundCheck.ssnLast4}` : "",
  );
  const [ssnSaved, setSsnSaved] = useState(!!backgroundCheck.ssnLast4);

  const handleSSNSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ssnInput.trim() || ssnInput.length < 4) {
      toast.error("Please enter a valid 4-digit SSN snippet");
      return;
    }
    setSsnSaved(true);
    toast.success("SSN Verification saved securely");
  };

  const isCleared = backgroundCheck.status === "clear";

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isCleared ? (
              <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" />
                <span>Background Report CLEARED</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-ember/10 text-ember text-xs font-semibold border border-ember/20 flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                <span>Background Check In Progress</span>
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Powered by {backgroundCheck.provider}
            </span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Background Check & Compliance Documents
          </h2>
          <p className="text-xs text-muted-foreground">
            Submit required tax forms, identity proof, and consent for employment screening
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Documents Upload Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card">
            <h3 className="text-lg font-display font-normal text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-4 text-ember" />
              <span>Required Verification Documents</span>
            </h3>

            <div className="space-y-2.5">
              {backgroundCheck.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-surface rounded-md border border-border flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-md ${
                        doc.status === "verified"
                          ? "bg-success/10 text-success"
                          : "bg-card text-muted-foreground border border-border"
                      }`}
                    >
                      {doc.status === "verified" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <FileText className="size-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground">{doc.type}</div>
                    </div>
                  </div>

                  {doc.status === "verified" ? (
                    <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
                      Uploaded & Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onUploadDoc(doc.id);
                        toast.success(`Uploaded document: ${doc.name}`);
                      }}
                      className="px-3 py-1.5 rounded-md bg-ember text-ember-foreground font-semibold text-xs flex items-center gap-1.5 shadow-xs hover:bg-ember/90 transition-colors cursor-pointer"
                    >
                      <Upload className="size-3.5" />
                      <span>Upload File</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SSN Security & Background Status */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
            <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
              <Lock className="size-4 text-ember" />
              <span>Identity SSN Consent</span>
            </h3>

            <form onSubmit={handleSSNSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  SSN (Last 4 Digits)
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={ssnInput}
                  onChange={(e) => setSsnInput(e.target.value)}
                  disabled={ssnSaved}
                  placeholder="***-**-4892"
                  className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground font-mono text-xs focus:outline-none focus:border-ember disabled:opacity-60"
                />
              </div>

              {!ssnSaved ? (
                <button
                  type="submit"
                  className="w-full py-2 rounded-md bg-ember text-ember-foreground text-xs font-semibold hover:bg-ember/90 cursor-pointer shadow-xs"
                >
                  Save Encrypted SSN
                </button>
              ) : (
                <div className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-md border border-success/20 flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  <span>SSN Consent Signed & Encrypted</span>
                </div>
              )}
            </form>

            <div className="pt-2 border-t border-border text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">Privacy Notice:</div>
              <p>
                Your SSN and documents are encrypted using AES-256 and transmitted directly to
                Checkr for screening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
