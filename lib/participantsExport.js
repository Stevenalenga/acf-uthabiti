const PHASE_LABELS = {
  EarlyBird: "Early Bird",
  Regular: "Regular",
  LateOnsite: "Late / On-site",
};

const TYPE_LABELS = {
  student: "Student",
  eastAfrica: "East Africa",
  other: "International",
};

export const PARTICIPANT_EXPORT_HEADERS = [
  "Name",
  "Email",
  "Phone",
  "Organization",
  "Country",
  "Profession",
  "Event",
  "Phase",
  "Type",
  "Amount (USD)",
  "Payment Status",
  "Payment Method",
  "Payment Reference",
  "Paid",
  "Invoice Number",
  "Receipt Number",
  "Registered At",
];

export function participantToExportRow(p) {
  const payment = p.payments?.[0];
  const invoice = p.documents?.find((d) => d.type === "INVOICE");
  const receipt = p.documents?.find((d) => d.type === "RECEIPT");

  return [
    p.full_name || "",
    p.email || "",
    p.phone || "",
    p.organization || "",
    p.country || "",
    p.profession || "",
    p.event?.name || "",
    PHASE_LABELS[p.phase] || p.phase || "",
    TYPE_LABELS[p.type] || p.type || "",
    payment?.amount ?? "",
    payment?.status || "",
    payment?.method || "",
    payment?.payment_reference || "",
    p.paid ? "Yes" : "No",
    invoice?.document_number || "",
    receipt?.document_number || "",
    p.createdAt ? new Date(p.createdAt).toISOString() : "",
  ];
}

export function buildParticipantsCsv(participants) {
  const rows = [
    PARTICIPANT_EXPORT_HEADERS,
    ...participants.map(participantToExportRow),
  ];

  return rows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}
