import React from "react";
import { Printer, ArrowLeft, X, ShieldCheck } from "lucide-react";
import { CtcBreakdown, formatInrCurrency } from "@talent-flow/api";

interface CtcBreakdownViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown?: CtcBreakdown;
  jobTitle?: string;
  companyName?: string;
}

export const CtcBreakdownViewModal: React.FC<CtcBreakdownViewModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  jobTitle,
  companyName = "IMS Learning Resources Pvt Ltd",
}) => {
  if (!isOpen || !breakdown) return null;

  const fmt = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return "0.00";
    return Number(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Navbar mimic */}
        <div className="bg-[#0080c8] px-5 py-3 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider text-sm">WORKLINE</span>
            <span className="text-white/40">|</span>
            <span className="text-xs text-white/90">
              {companyName} · Official Compensation & CTC Record
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breadcrumb row */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
          <span>Home</span>
          <span>/</span>
          <span>Compensation & Benefits</span>
          <span>/</span>
          <span>Requisitions</span>
          <span>/</span>
          <span className="text-[#0080c8] font-bold">
            View CTC ({jobTitle || "Job Requisition"})
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 font-sans">
          {/* Reference Document Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-sky-50 dark:bg-sky-950/60 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 font-bold">
                  <th className="py-2.5 px-3 w-16 text-center">SL. No</th>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3 w-48 text-right">Amount Per Month</th>
                  <th className="py-2.5 px-3 w-48 text-right">Amount Per Annum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-250">
                {/* Total Fixed Compensation (A) */}
                <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3">
                    Total Fixed Compensation (A)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">1</td>
                  <td className="py-2 px-3">Tot Fixed Comp Input</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.totFixedCompInput?.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.totFixedCompInput?.annual)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">2</td>
                  <td className="py-2 px-3">Basic</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.basic.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.basic.annual)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">3</td>
                  <td className="py-2 px-3">Retaining Allowance</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.retainingAllowance?.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.retainingAllowance?.annual)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">4</td>
                  <td className="py-2 px-3">House Rent Allowance</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.houseRentAllowance.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.houseRentAllowance.annual)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">5</td>
                  <td className="py-2 px-3">Special Allowance</td>
                  <td className="py-2 px-3 text-right font-mono text-[#0052cc] dark:text-sky-400 font-semibold">
                    {fmt(breakdown.fixedCompensation.specialAllowance.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#0052cc] dark:text-sky-400 font-semibold">
                    {fmt(breakdown.fixedCompensation.specialAllowance.annual)}
                  </td>
                </tr>
                <tr className="bg-sky-50/60 dark:bg-sky-950/40 font-bold text-slate-900 dark:text-slate-100">
                  <td className="py-2 px-3 text-center font-mono">6</td>
                  <td className="py-2 px-3 text-[#0052cc] dark:text-sky-400">
                    Total Fixed Compensation (a)
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.totalFixedCompensation.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCompensation.totalFixedCompensation.annual)}
                  </td>
                </tr>

                {/* Retiral Benefits (B) */}
                <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3">
                    Retiral Benefits (B)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">7</td>
                  <td className="py-2 px-3">Employer PF Contribution</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.employerPfContribution.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.employerPfContribution.annual)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">8</td>
                  <td className="py-2 px-3">Gratuity</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.gratuity.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.gratuity.annual)}
                  </td>
                </tr>
                <tr className="bg-sky-50/60 dark:bg-sky-950/40 font-bold text-slate-900 dark:text-slate-100">
                  <td className="py-2 px-3 text-center font-mono">9</td>
                  <td className="py-2 px-3">Total Retiral Benefits (b)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.totalRetiralBenefits.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.retiralBenefits.totalRetiralBenefits.annual)}
                  </td>
                </tr>

                {/* Fixed CTC */}
                <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3">
                    Fixed CTC
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">10</td>
                  <td className="py-2 px-3">Fixed CTC (a+b+c)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCtc.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.fixedCtc.annual)}
                  </td>
                </tr>

                {/* Variable (D) */}
                <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3">
                    Variable (D)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">11</td>
                  <td className="py-2 px-3">Performance Incentive</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.variablePay.performanceIncentive.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.variablePay.performanceIncentive.annual)}
                  </td>
                </tr>
                <tr className="bg-sky-50/60 dark:bg-sky-950/40 font-bold text-slate-900 dark:text-slate-100">
                  <td className="py-2 px-3 text-center font-mono">12</td>
                  <td className="py-2 px-3">Total Variables (d)</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.variablePay.totalVariables.monthly)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(breakdown.variablePay.totalVariables.annual)}
                  </td>
                </tr>

                {/* Cost to Company */}
                <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                  <td colSpan={4} className="py-2 px-3">
                    Cost to Company
                  </td>
                </tr>
                <tr className="bg-slate-100 dark:bg-slate-850 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <td className="py-3 px-3 text-center font-mono text-[#0052cc] dark:text-sky-400">
                    13
                  </td>
                  <td className="py-3 px-3">Total Cost to Company</td>
                  <td className="py-3 px-3 text-right font-mono">
                    {fmt(breakdown.totalCostToCompany.monthly)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {fmt(breakdown.totalCostToCompany.annual)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Action Footer matching Reference Doc Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded bg-[#3399cc] hover:bg-[#2883b0] text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-[#3399cc] hover:bg-[#2883b0] text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
