export const ORGANIZATION = {
  eventName: "Africa Childcare Forum 2026",
  eventCode: "ACF2026",
  companyName: "Uthabiti Africa",
  address: "P.o Box 3493-00200, Nairobi, Kenya",
  phone: "+254714262626",
  email: "ACF@uthabitiafrica.org",
  website: "acf.uthabitiafrica.org",
};

export const BANK_DETAILS = {
  accountName: "Uthabiti Africa Advisory Services Limited",
  bankName: "Family Bank Kenya Limited (70)",
  branchName: "Family Bank Tower (068)",
  accountNo: "068000026154",
  swiftCode: "FABLKENA",
  currency: "USD",
};

export const FEES = {
  EarlyBird: { student: 60, eastAfrica: 300, other: 375 },
  Regular: { student: 75, eastAfrica: 350, other: 425 },
  LateOnsite: { student: 90, eastAfrica: 400, other: 475 },
};

export const PHASE_LABELS = {
  EarlyBird: "Early Bird",
  Regular: "Regular",
  LateOnsite: "Late / On-site",
};

export const TYPE_LABELS = {
  student: "Student",
  eastAfrica: "East Africa Participant",
  other: "International Participant",
};

export function getLineItemDescription(phase, type) {
  const phaseLabel = PHASE_LABELS[phase] || phase;
  const typeLabel = TYPE_LABELS[type] || type;
  return `Delegate Fees during Africa Childcare Forum 2026 (${phaseLabel} – ${typeLabel}) for 1 Pax`;
}
