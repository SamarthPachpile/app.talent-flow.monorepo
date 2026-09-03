import React, { useState, useEffect } from "react";
import {
  Calculator,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  CtcBreakdown,
  calculateDefaultCtcBreakdown,
  recomputeCtcBreakdownTotals,
} from "@talent-flow/api";

interface CtcBreakdownEditorProps {
  value?: CtcBreakdown;
  onChange: (breakdown: CtcBreakdown) => void;
  companyName?: string;
  targetAnnualCtc?: number;
}

export const CtcBreakdownEditor: React.FC<CtcBreakdownEditorProps> = ({
  value,
  onChange,
  companyName = "IMS Learning Resources Pvt Ltd",
  targetAnnualCtc = 770000,
}) => {
  const [breakdown, setBreakdown] = useState<CtcBreakdown>(() => {
    if (value && value.totalCostToCompany?.annual) {
      return value;
    }
    return calculateDefaultCtcBreakdown(targetAnnualCtc, companyName);
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Sync if value prop updates from parent
  useEffect(() => {
    if (value && value.totalCostToCompany?.annual) {
      setBreakdown(value);
    }
  }, [value]);

  const handleComponentChange = (
    section: "fixed" | "retiral" | "variable",
    field: string,
    monthlyVal: number,
  ) => {
    const round2 = (val: number) => Math.round(val * 100) / 100;
    const mo = Math.max(0, monthlyVal || 0);
    const yr = round2(mo * 12);

    const updated = JSON.parse(JSON.stringify(breakdown)) as CtcBreakdown;

    if (section === "fixed") {
      if (field === "basic") {
        updated.fixedCompensation.basic = { monthly: mo, annual: yr };
      } else if (field === "retainingAllowance") {
        updated.fixedCompensation.retainingAllowance = { monthly: mo, annual: yr };
      } else if (field === "houseRentAllowance") {
        updated.fixedCompensation.houseRentAllowance = { monthly: mo, annual: yr };
      } else if (field === "specialAllowance") {
        updated.fixedCompensation.specialAllowance = { monthly: mo, annual: yr };
      }
    } else if (section === "retiral") {
      if (field === "employerPfContribution") {
        updated.retiralBenefits.employerPfContribution = { monthly: mo, annual: yr };
      } else if (field === "gratuity") {
        updated.retiralBenefits.gratuity = { monthly: mo, annual: yr };
      }
    } else if (section === "variable") {
      if (field === "performanceIncentive") {
        updated.variablePay.performanceIncentive = { monthly: mo, annual: yr };
      }
    }

    const recomputed = recomputeCtcBreakdownTotals(updated);
    setBreakdown(recomputed);
    onChange(recomputed);
  };

  const handleAutoCalculate = (customTarget?: number) => {
    const target =
      customTarget || breakdown.totalCostToCompany?.annual || targetAnnualCtc || 770000;
    const calculated = calculateDefaultCtcBreakdown(
      target,
      companyName,
      "01-Jun-2026",
      "Onroll (Code on Wages)",
    );
    setBreakdown(calculated);
    onChange(calculated);
  };

  const fmt = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return "0.00";
    return Number(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>CTC Compensation Structure & Breakup</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Code on Wages Compliant
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Detailed salary breakup according to company legal entity standards.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAutoCalculate()}
            className="px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-orange-200/80 dark:border-orange-800/60 cursor-pointer"
            title="Auto-calculate statutory percentages"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Calculate</span>
          </button>
          <button
            type="button"
            onClick={() => handleAutoCalculate(770000)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to 7.70L reference document values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reference Sample (7.70L)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Callout regarding Candidate Privacy */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11.5px]">
          <strong>Candidate Privacy Protection Active:</strong> Only the overall Total CTC (e.g.{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            ₹{fmt(breakdown.totalCostToCompany?.annual)} / year
          </span>
          ) will be presented across the candidate portal and job previews. The detailed breakdown
          below (Basic, HRA, Retiral, PF, Gratuity) is securely stored in your MongoDB Atlas
          database for internal HR and offer generation.
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Structured Breakdown Table matching Reference Doc Image */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-sky-50 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <th className="py-2.5 px-3 w-16 text-center">SL. No</th>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3 w-48 text-right">Amount Per Month (₹)</th>
                  <th className="py-2.5 px-3 w-48 text-right">Amount Per Annum (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-250">
                {/* SECTION A HEADER */}
                <tr className="bg-slate-50 dark:bg-slate-850/80 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3 tracking-wide text-xs">
                    Total Fixed Compensation (A)
                  </td>
                </tr>

                {/* 1. Tot Fixed Comp Input */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">1</td>
                  <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                    Tot Fixed Comp Input
                  </td>
                  <td className="py-1.5 px-3 text-right font-mono font-medium text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.fixedCompensation.totFixedCompInput?.monthly)}
                  </td>
                  <td className="py-1.5 px-3 text-right font-mono font-medium text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.fixedCompensation.totFixedCompInput?.annual)}
                  </td>
                </tr>

                {/* 2. Basic */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">2</td>
                  <td className="py-2 px-3 font-medium">Basic</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.fixedCompensation.basic.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange("fixed", "basic", parseFloat(e.target.value) || 0)
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.fixedCompensation.basic.annual)}
                  </td>
                </tr>

                {/* 3. Retaining Allowance */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">3</td>
                  <td className="py-2 px-3 font-medium">Retaining Allowance</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.fixedCompensation.retainingAllowance?.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange(
                          "fixed",
                          "retainingAllowance",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.fixedCompensation.retainingAllowance?.annual)}
                  </td>
                </tr>

                {/* 4. House Rent Allowance */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">4</td>
                  <td className="py-2 px-3 font-medium">House Rent Allowance</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.fixedCompensation.houseRentAllowance.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange(
                          "fixed",
                          "houseRentAllowance",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.fixedCompensation.houseRentAllowance.annual)}
                  </td>
                </tr>

                {/* 5. Special Allowance */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">5</td>
                  <td className="py-2 px-3 font-medium">Special Allowance</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.fixedCompensation.specialAllowance.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange(
                          "fixed",
                          "specialAllowance",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.fixedCompensation.specialAllowance.annual)}
                  </td>
                </tr>

                {/* 6. Total Fixed Compensation (a) Subtotal */}
                <tr className="bg-sky-50/70 dark:bg-sky-950/40 font-bold text-sky-900 dark:text-sky-200 border-t border-b border-sky-200 dark:border-sky-800">
                  <td className="py-2 px-3 text-center font-mono">6</td>
                  <td className="py-2 px-3">Total Fixed Compensation (a)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.totalFixedCompensation.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.totalFixedCompensation.annual)}
                  </td>
                </tr>

                {/* SECTION B HEADER */}
                <tr className="bg-slate-50 dark:bg-slate-850/80 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3 tracking-wide text-xs">
                    Retiral Benefits (B)
                  </td>
                </tr>

                {/* 7. Employer PF Contribution */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">7</td>
                  <td className="py-2 px-3 font-medium">Employer PF Contribution</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.retiralBenefits.employerPfContribution.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange(
                          "retiral",
                          "employerPfContribution",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.retiralBenefits.employerPfContribution.annual)}
                  </td>
                </tr>

                {/* 8. Gratuity */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">8</td>
                  <td className="py-2 px-3 font-medium">Gratuity</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.retiralBenefits.gratuity.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange(
                          "retiral",
                          "gratuity",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.retiralBenefits.gratuity.annual)}
                  </td>
                </tr>

                {/* 9. Total Retiral Benefits (b) Subtotal */}
                <tr className="bg-sky-50/70 dark:bg-sky-950/40 font-bold text-sky-900 dark:text-sky-200 border-t border-b border-sky-200 dark:border-sky-800">
                  <td className="py-2 px-3 text-center font-mono">9</td>
                  <td className="py-2 px-3">Total Retiral Benefits (b)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.totalRetiralBenefits.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.totalRetiralBenefits.annual)}
                  </td>
                </tr>

                {/* SECTION C HEADER / FIXED CTC */}
                <tr className="bg-slate-50 dark:bg-slate-850/80 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3 tracking-wide text-xs">
                    Fixed CTC
                  </td>
                </tr>

                {/* 10. Fixed CTC (a+b+c) */}
                <tr className="bg-slate-100/70 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-slate-100">
                  <td className="py-2 px-3 text-center font-mono">10</td>
                  <td className="py-2 px-3">Fixed CTC (a+b+c)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCtc.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCtc.annual)}
                  </td>
                </tr>

                {/* SECTION D HEADER */}
                <tr className="bg-slate-50 dark:bg-slate-850/80 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3 tracking-wide text-xs">
                    Variable (D)
                  </td>
                </tr>

                {/* 11. Performance Incentive */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">11</td>
                  <td className="py-2 px-3 font-medium">Performance Incentive</td>
                  <td className="py-1 px-3 text-right font-mono">
                    <input
                      type="number"
                      value={breakdown.variablePay.performanceIncentive.monthly || ""}
                      onChange={(e) =>
                        handleComponentChange(
                          "variable",
                          "performanceIncentive",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-32 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-right font-mono font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {fmt(breakdown.variablePay.performanceIncentive.annual)}
                  </td>
                </tr>

                {/* 12. Total Variables (d) */}
                <tr className="bg-sky-50/70 dark:bg-sky-950/40 font-bold text-sky-900 dark:text-sky-200 border-t border-b border-sky-200 dark:border-sky-800">
                  <td className="py-2 px-3 text-center font-mono">12</td>
                  <td className="py-2 px-3">Total Variables (d)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.variablePay.totalVariables.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.variablePay.totalVariables.annual)}
                  </td>
                </tr>

                {/* SECTION E / SUMMARY */}
                <tr className="bg-slate-50 dark:bg-slate-850/80 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3 tracking-wide text-xs">
                    Cost to Company
                  </td>
                </tr>

                {/* 13. Total Cost to Company */}
                <tr className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-orange-950/40 font-bold text-orange-950 dark:text-orange-200 border-t-2 border-orange-500/30">
                  <td className="py-3 px-3 text-center font-mono text-orange-600 dark:text-orange-400">
                    13
                  </td>
                  <td className="py-3 px-3 text-sm flex items-center gap-1.5 text-orange-950 dark:text-orange-100">
                    <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Total Cost to Company (CTC)</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-orange-600 dark:text-orange-400">
                    ₹{fmt(breakdown.totalCostToCompany.monthly)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base text-orange-600 dark:text-orange-400">
                    ₹{fmt(breakdown.totalCostToCompany.annual)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
