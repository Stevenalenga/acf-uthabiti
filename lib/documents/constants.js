export const ORGANIZATION = {
  eventName: "Africa Childcare Forum 2026",
  eventCode: "ACF2026",
  companyName: "Uthabiti Africa",
  address:
    "Mwaka Estate, House 3431, Suna Close, Dagoretti Corner\nP.O. Box 3493 City Square 00200 Nairobi, Kenya",
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
  // Regular / Late: "regular" = Other Participant, "EA" = East Africa Participant
  Regular: { student: 75, eastAfrica: 425, other: 375 },
  LateOnsite: { student: 90, eastAfrica: 475, other: 425 },
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

/** Inclusive registration windows (Africa/Nairobi calendar dates). */
export const PHASE_WINDOWS = {
  EarlyBird: {
    start: "2026-01-15",
    end: "2026-03-31",
    label: "Early Bird: Jan 15 – Mar 31, 2026",
  },
  Regular: {
    start: "2026-04-01",
    end: "2026-06-30",
    label: "Regular: Apr 1 – Jun 30, 2026",
  },
  LateOnsite: {
    start: "2026-07-01",
    end: "2026-09-15",
    label: "Late / On-site: Jul 1 – Sep 15, 2026",
  },
};

function nairobiDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isPhaseOpen(phase, now = new Date()) {
  const window = PHASE_WINDOWS[phase];
  if (!window) return false;
  const today = nairobiDateKey(now);
  return today >= window.start && today <= window.end;
}

export function getOpenPhases(now = new Date()) {
  return Object.keys(PHASE_WINDOWS).filter((phase) => isPhaseOpen(phase, now));
}

export function getLineItemDescription(phase, type) {
  const phaseLabel = PHASE_LABELS[phase] || phase;
  const typeLabel = TYPE_LABELS[type] || type;
  return `Delegate Fees during Africa Childcare Forum 2026 (${phaseLabel} – ${typeLabel}) for 1 Pax`;
}
