export const TAMARIND_DINNER = {
  adultUsd: 60,
  childUsd: 30,
  adultKes: 7764,
  childKes: 3882,
  pdfPath: "/downloads/Tamarind_Dhow_Delegate_Guide.pdf",
};

export const PARTNERSHIP_DINNER = {
  title: "Dinner Cruise",
  venue: "Char-Choma Restaurant",
  venueDetail: "Aga Khan Beach Cottages, Bamburi, Mombasa",
  dateLabel: "Wednesday 14 October 2026",
  timeLabel: "7:00pm",
  feeKes: 1500,
  feeUsd: 12,
  pagePath: "/tamarind-dinner",
  mpesa: {
    paybill: "4068527",
    accountHint: "Your name or ID number",
  },
};

export function dinnerAmountKes(adults, children) {
  return (
    Number(adults) * TAMARIND_DINNER.adultKes +
    Number(children) * TAMARIND_DINNER.childKes
  );
}

export function partnershipDinnerAmountKes(guests) {
  return Number(guests) * PARTNERSHIP_DINNER.feeKes;
}

export function partnershipDinnerAmountUsd(guests) {
  return Number(guests) * PARTNERSHIP_DINNER.feeUsd;
}

export function formatPartnershipDinnerAmount(guests, currency = "KES") {
  if (String(currency).toUpperCase() === "USD") {
    return `USD ${partnershipDinnerAmountUsd(guests).toFixed(2)}`;
  }
  return `KES ${partnershipDinnerAmountKes(guests).toLocaleString("en-KE")}`;
}

export function isDinnerPaymentReference(reference) {
  const value = String(reference || "");
  return value.startsWith("DHOW-") || value.startsWith("PARTNER-");
}

export function isPartnershipDinnerReference(reference) {
  return String(reference || "").startsWith("PARTNER-");
}
