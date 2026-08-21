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

/** Family Bank KES account for participants paying in Kenyan Shillings. */
export const BANK_DETAILS_KES = {
  accountName: "Uthabiti Africa Advisory Services Limited",
  bankName: "Family Bank Kenya Limited",
  paybill: "222111",
  accountNo: "068000024909",
  currency: "KES",
};

/** Family Bank USD → KES exchange rate used on KES invoices. */
export const FAMILY_BANK_USD_TO_KES = 132.5;

export function convertUsdToKes(usdAmount, rate = FAMILY_BANK_USD_TO_KES) {
  return Math.round(Number(usdAmount) * Number(rate) * 100) / 100;
}

export function formatInvoiceAmount(amount, currency = "USD") {
  const value = Number(amount);
  if (currency === "KES") {
    return `KES ${value.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${value.toFixed(2)} USD`;
}

export function getBankDetailsForCurrency(currency = "USD") {
  return currency === "KES" ? BANK_DETAILS_KES : BANK_DETAILS;
}

export const FEES = {
  EarlyBird: { student: 60, eastAfrica: 300, other: 375 },
  // Regular / Late: "regular" = Other Participant, "EA" = East Africa Participant
  Regular: { student: 75, eastAfrica: 425, other: 375 },
  LateOnsite: { student: 90, eastAfrica: 475, other: 425 },
};

/**
 * Limited-time discount (Africa/Nairobi calendar dates, inclusive).
 * After `end`, standard phase fees apply again automatically.
 */
export const PROMO_DISCOUNT = {
  start: "2026-08-17",
  end: "2026-08-31",
  label: "Limited-time discount ends 31 Aug 2026",
  /** Public claim code for already-registered unpaid participants */
  claimCode: "ACF26-SAVE-NOW",
  claimPath: "/promo-invoice",
  fees: {
    eastAfrica: 380,
    other: 400,
  },
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

export function isPromoActive(now = new Date()) {
  const today = nairobiDateKey(now);
  return today >= PROMO_DISCOUNT.start && today <= PROMO_DISCOUNT.end;
}

export function getStandardFee(phase, type) {
  if (!phase || !type) return null;
  const amount = FEES[phase]?.[type];
  return amount == null ? null : Number(amount);
}

/** Effective fee for a phase/type, applying the active promo when available. */
export function getRegistrationFee(phase, type, now = new Date()) {
  const standard = getStandardFee(phase, type);
  if (standard == null) return null;

  if (isPromoActive(now) && PROMO_DISCOUNT.fees[type] != null) {
    return Number(PROMO_DISCOUNT.fees[type]);
  }

  return standard;
}

export function formatPromoEndDate() {
  const [year, month, day] = PROMO_DISCOUNT.end.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getPromoClaimCode() {
  return (
    process.env.PROMO_CLAIM_CODE?.trim() ||
    PROMO_DISCOUNT.claimCode
  ).toUpperCase();
}

export function isValidPromoClaimCode(code) {
  if (!code) return false;
  return String(code).trim().toUpperCase() === getPromoClaimCode();
}

/** Promo invoice amount for an existing registration type, or null if not eligible. */
export function getPromoClaimFee(type) {
  if (!type) return null;
  const amount = PROMO_DISCOUNT.fees[type];
  return amount == null ? null : Number(amount);
}

export function getLineItemDescription(phase, type) {
  const phaseLabel = PHASE_LABELS[phase] || phase;
  const typeLabel = TYPE_LABELS[type] || type;
  const promoNote = isPromoActive() ? " – Limited-time discount" : "";
  return `Delegate Fees during Africa Childcare Forum 2026 (${phaseLabel} – ${typeLabel}${promoNote}) for 1 Pax`;
}
