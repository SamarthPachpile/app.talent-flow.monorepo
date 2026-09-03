import type { CtcBreakdown } from "@talent-flow/schema-types";

export function formatInrCurrency(amount: unknown): string {
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]/g, "")) || 0
      : (amount as number) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatSalaryRangeDisplay(
  salaryRangeOrMin?: unknown,
  salaryMinOrMax?: unknown,
  salaryMaxOrCur?: unknown,
  _currency?: unknown,
  _salaryPeriod?: unknown,
  ..._rest: unknown[]
): string {
  if (typeof salaryRangeOrMin === "string" && salaryRangeOrMin.trim() !== "")
    return salaryRangeOrMin;
  if (!salaryRangeOrMin && !salaryMinOrMax && !salaryMaxOrCur) return "Not Disclosed";
  if (typeof salaryMinOrMax === "number" && typeof salaryMaxOrCur === "number") {
    return `${formatInrCurrency(salaryMinOrMax)} - ${formatInrCurrency(salaryMaxOrCur)}`;
  }
  if (typeof salaryRangeOrMin === "number" && typeof salaryMinOrMax === "number") {
    return `${formatInrCurrency(salaryRangeOrMin)} - ${formatInrCurrency(salaryMinOrMax)}`;
  }
  if (typeof salaryRangeOrMin === "number") return `From ${formatInrCurrency(salaryRangeOrMin)}`;
  if (typeof salaryMinOrMax === "number") return `Up to ${formatInrCurrency(salaryMinOrMax)}`;
  return "Not Disclosed";
}

export function recomputeCtcBreakdownTotals(b: CtcBreakdown): CtcBreakdown {
  const round2 = (val: number) => Math.round((val || 0) * 100) / 100;
  const basicMo = b.fixedCompensation?.basic?.monthly || 0;
  const basicYr = round2(basicMo * 12);
  if (b.fixedCompensation?.basic) b.fixedCompensation.basic.annual = basicYr;
  const hraMo = b.fixedCompensation?.houseRentAllowance?.monthly || 0;
  const hraYr = round2(hraMo * 12);
  if (b.fixedCompensation?.houseRentAllowance)
    b.fixedCompensation.houseRentAllowance.annual = hraYr;
  const retMo = b.fixedCompensation?.retainingAllowance?.monthly || 0;
  const retYr = round2(retMo * 12);
  if (b.fixedCompensation?.retainingAllowance)
    b.fixedCompensation.retainingAllowance.annual = retYr;
  const specMo = b.fixedCompensation?.specialAllowance?.monthly || 0;
  const specYr = round2(specMo * 12);
  if (b.fixedCompensation?.specialAllowance) b.fixedCompensation.specialAllowance.annual = specYr;

  const totFixedMo = round2(basicMo + hraMo + retMo + specMo);
  const totFixedYr = round2(totFixedMo * 12);
  if (b.fixedCompensation) {
    b.fixedCompensation.totalFixedCompensation = { monthly: totFixedMo, annual: totFixedYr };
  }

  const pfMo = b.retiralBenefits?.employerPfContribution?.monthly || 0;
  const pfYr = round2(pfMo * 12);
  if (b.retiralBenefits?.employerPfContribution)
    b.retiralBenefits.employerPfContribution.annual = pfYr;
  const gratMo = b.retiralBenefits?.gratuity?.monthly || 0;
  const gratYr = round2(gratMo * 12);
  if (b.retiralBenefits?.gratuity) b.retiralBenefits.gratuity.annual = gratYr;

  const totRetMo = round2(pfMo + gratMo);
  const totRetYr = round2(totRetMo * 12);
  if (b.retiralBenefits) {
    b.retiralBenefits.totalRetiralBenefits = { monthly: totRetMo, annual: totRetYr };
  }

  const fixedCtcMo = round2(totFixedMo + totRetMo);
  const fixedCtcYr = round2(fixedCtcMo * 12);
  b.fixedCtc = { monthly: fixedCtcMo, annual: fixedCtcYr };

  const perfMo = b.variablePay?.performanceIncentive?.monthly || 0;
  const perfYr = round2(perfMo * 12);
  if (b.variablePay?.performanceIncentive) b.variablePay.performanceIncentive.annual = perfYr;
  const totVarMo = round2(perfMo);
  const totVarYr = round2(totVarMo * 12);
  if (b.variablePay) {
    b.variablePay.totalVariables = { monthly: totVarMo, annual: totVarYr };
  }

  const ctcMo = round2(fixedCtcMo + totVarMo);
  const ctcYr = round2(ctcMo * 12);
  b.totalCostToCompany = { monthly: ctcMo, annual: ctcYr };
  b.totalCtc = ctcYr;
  b.baseSalary = basicYr;
  return b;
}

export function calculateDefaultCtcBreakdown(
  targetAnnualCtc = 770000,
  _companyName = "Company",
  _doj = "01-Jun-2026",
  _structure = "Onroll (Code on Wages)",
): CtcBreakdown {
  const round2 = (val: number) => Math.round((val || 0) * 100) / 100;
  const monthlyCtc = targetAnnualCtc / 12;
  const basicMo = round2(monthlyCtc * 0.5);
  const hraMo = round2(basicMo * 0.4);
  const pfMo = Math.min(1800, round2(basicMo * 0.12));
  const gratMo = round2((basicMo * 15) / (26 * 12));
  const perfMo = round2(monthlyCtc * 0.05);
  const specMo = Math.max(0, round2(monthlyCtc - (basicMo + hraMo + pfMo + gratMo + perfMo)));

  const initial: CtcBreakdown = {
    currency: "INR",
    totalCtc: targetAnnualCtc,
    baseSalary: round2(basicMo * 12),
    fixedCompensation: {
      basic: { monthly: basicMo, annual: round2(basicMo * 12) },
      retainingAllowance: { monthly: 0, annual: 0 },
      houseRentAllowance: { monthly: hraMo, annual: round2(hraMo * 12) },
      specialAllowance: { monthly: specMo, annual: round2(specMo * 12) },
      totalFixedCompensation: { monthly: 0, annual: 0 },
    },
    retiralBenefits: {
      employerPfContribution: { monthly: pfMo, annual: round2(pfMo * 12) },
      gratuity: { monthly: gratMo, annual: round2(gratMo * 12) },
      totalRetiralBenefits: { monthly: 0, annual: 0 },
    },
    fixedCtc: { monthly: 0, annual: 0 },
    variablePay: {
      performanceIncentive: { monthly: perfMo, annual: round2(perfMo * 12) },
      totalVariables: { monthly: 0, annual: 0 },
    },
    totalCostToCompany: { monthly: 0, annual: 0 },
  };

  return recomputeCtcBreakdownTotals(initial);
}
