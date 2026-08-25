import React, { useState } from "react";
import { OfferDetails, CandidateProfile } from "../../types/candidate";
import {
  FileCheck,
  IndianRupee,
  Award,
  CheckCircle2,
  Download,
  PenTool,
  Sparkles,
  Clock,
  Heart,
} from "lucide-react";
import { toast } from "../../lib/sweetalert";

interface OfferStageViewProps {
  offer: OfferDetails;
  candidate: CandidateProfile;
  onAcceptOffer: (signedName: string) => void;
}

export const OfferStageView: React.FC<OfferStageViewProps> = ({
  offer,
  candidate,
  onAcceptOffer,
}) => {
  const [showSignModal, setShowSignModal] = useState(false);
  const [typedName, setTypedName] = useState(candidate.name);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const isAccepted = offer.status === "accepted";

  const handleSignAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName.trim()) {
      toast.error("Please enter your full legal name");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please accept the offer terms and conditions");
      return;
    }

    onAcceptOffer(typedName);
    setShowSignModal(false);
    toast.success("Offer Accepted! Welcome to the TalentFlow team! 🎉");
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isAccepted ? (
              <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" />
                <span>Offer Accepted & Executed</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-warning/10 text-warning-foreground text-xs font-semibold border border-warning/30 flex items-center gap-1 animate-pulse">
                <Clock className="size-3.5" />
                <span>Action Required: Signature Pending</span>
              </span>
            )}
            <span className="text-xs text-muted-foreground">Offer Ref #{offer.offerId}</span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Formal Offer & Equity Compensation
          </h2>
          <p className="text-xs text-muted-foreground">
            Review compensation structure, benefits package, and execute electronic agreement
          </p>
        </div>

        {!isAccepted && (
          <button
            onClick={() => setShowSignModal(true)}
            className="px-5 py-2.5 rounded-md bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PenTool className="size-3.5" />
            <span>Sign & Accept Offer</span>
          </button>
        )}
      </div>

      {/* Compensation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Base Salary (Yearly)</span>
            <div className="p-1.5 rounded-md bg-surface text-ember border border-border">
              <IndianRupee className="size-3.5" />
            </div>
          </div>
          <div className="text-2xl font-display font-normal text-foreground">
            ₹{offer.baseSalaryYearly.toLocaleString("en-IN")}
          </div>
          <div className="text-11px text-success font-medium mt-0.5">Paid Bi-Weekly</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sign-On Bonus</span>
            <div className="p-1.5 rounded-md bg-surface text-success border border-border">
              <Sparkles className="size-3.5" />
            </div>
          </div>
          <div className="text-2xl font-display font-normal text-success">
            ₹{offer.signOnBonus.toLocaleString("en-IN")}
          </div>
          <div className="text-11px text-muted-foreground mt-0.5">First Paycheck Lump-sum</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Equity Grant</span>
            <div className="p-1.5 rounded-md bg-surface text-ember border border-border">
              <Award className="size-3.5" />
            </div>
          </div>
          <div className="text-2xl font-display font-normal text-foreground">
            {offer.equityShares.toLocaleString("en-IN")} Options
          </div>
          <div className="text-11px text-muted-foreground mt-0.5">{offer.equityVesting}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Remote Setup Stipend</span>
            <div className="p-1.5 rounded-md bg-surface text-foreground border border-border">
              <Heart className="size-3.5" />
            </div>
          </div>
          <div className="text-2xl font-display font-normal text-foreground">
            ₹{offer.remoteStipend.toLocaleString("en-IN")}
          </div>
          <div className="text-11px text-muted-foreground mt-0.5">
            + ₹{Math.round(offer.remoteStipend / 3).toLocaleString("en-IN")} Monthly Tech Allowance
          </div>
        </div>
      </div>

      {/* Offer Letter Document Preview */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-surface text-ember rounded-md border border-border">
              <FileCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-normal text-foreground">
                Official Offer Contract Document
              </h3>
              <p className="text-xs text-muted-foreground">
                TalentFlow Executive Employment Agreement
              </p>
            </div>
          </div>

          <button
            onClick={() => toast.info("Downloading official PDF document...")}
            className="px-3.5 py-1.5 rounded-md bg-surface hover:bg-accent/60 text-foreground border border-border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="size-3.5 text-ember" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Document Frame */}
        <div className="bg-surface p-5 rounded-md border border-border space-y-3 font-sans text-xs text-foreground leading-relaxed max-h-96 overflow-y-auto">
          <div className="text-center font-bold text-xs text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
            TALENTFLOW TECH INC. — EMPLOYMENT OFFER AGREEMENT
          </div>

          <p>
            Dear <strong>{candidate.name}</strong>,
          </p>
          <p>
            On behalf of TalentFlow Tech Inc., we are thrilled to offer you the position of{" "}
            <strong>{offer.positionTitle}</strong>. We were extremely impressed by your experience
            and background, and we believe your skills will be a massive asset to our team.
          </p>

          <div className="bg-card p-3.5 rounded-md border border-border space-y-1 font-mono text-11px">
            <div>• Position: {offer.positionTitle}</div>
            <div>• Department: {offer.department}</div>
            <div>
              • Annual Base Compensation: ₹{offer.baseSalaryYearly.toLocaleString("en-IN")} INR
            </div>
            <div>• Sign-on Bonus: ₹{offer.signOnBonus.toLocaleString("en-IN")} INR</div>
            <div>
              • Equity Stock Grant: {offer.equityShares.toLocaleString("en-IN")} ISO Stock Options (
              {offer.equityVesting})
            </div>
            <div>• Paid Time Off: {offer.ptoDays} Flexible Days Annually</div>
            <div>• Target Start Date: {candidate.targetStartDate}</div>
          </div>

          <p className="text-muted-foreground">
            This offer is contingent upon successful completion of standard background verification
            checks and submission of required right-to-work documentation.
          </p>

          {isAccepted && (
            <div className="mt-3 p-3 rounded-md bg-success/10 border border-success/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-success" />
                <div>
                  <div className="text-xs font-bold text-success">Digitally Signed & Validated</div>
                  <div className="text-10px text-muted-foreground">
                    Signed by: {offer.signedName} on{" "}
                    {new Date(offer.signedAt || "").toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-success text-success-foreground font-bold text-10px rounded-full uppercase">
                VERIFIED E-SIGN
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Signing */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6 shadow-lifted space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
                <PenTool className="size-4 text-ember" />
                <span>Execute Offer E-Signature</span>
              </h3>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-medium px-2 py-1 rounded bg-surface border border-border cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSignAndSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Legal Name (Typed Signature)
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md bg-surface border border-border text-foreground font-mono text-xs focus:outline-none focus:border-ember"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              {/* Signature Visual Preview */}
              {typedName && (
                <div className="p-3 bg-surface rounded-md border border-dashed border-border text-center">
                  <div className="text-10px uppercase tracking-wider text-muted-foreground mb-0.5">
                    E-Signature Preview
                  </div>
                  <div className="font-display italic text-2xl text-ember tracking-wide">
                    {typedName}
                  </div>
                  <div className="text-9px text-muted-foreground mt-0.5 font-mono">
                    Timestamp: {new Date().toISOString()}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-border text-ember focus:ring-ember cursor-pointer"
                />
                <label htmlFor="agree" className="text-xs text-muted-foreground cursor-pointer">
                  I agree that my electronic signature above is legally binding and equivalent to a
                  hand-written signature on this employment offer.
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="w-1/2 py-2 rounded-md bg-surface hover:bg-accent/60 text-foreground text-xs font-medium border border-border cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-md bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 cursor-pointer"
                >
                  Confirm & Execute Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
