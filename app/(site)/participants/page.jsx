"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  LogOut,
  Filter,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

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

const PAYMENT_STATUS_STYLES = {
  SUCCESS: "bg-green-100 text-green-800 ring-green-600/20",
  PENDING: "bg-amber-100 text-amber-800 ring-amber-600/20",
  FAILED: "bg-red-100 text-red-800 ring-red-600/20",
};

const EMPTY_FILTERS = {
  name: "",
  eventId: "",
  paymentStatus: "",
  phase: "",
  type: "",
};

export default function ParticipantsPage() {
  const { showToast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, failed: 0 });

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  const handleUnlock = () => {
    if (pin === "9076") {
      sessionStorage.setItem("admin_access", "true");
      setAuthorized(true);
    } else {
      showToast({ type: "error", message: "Invalid PIN" });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_access");
    setAuthorized(false);
    setPin("");
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_access")) setAuthorized(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, name: searchInput }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchParticipants = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(meta.limit),
          ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
          ),
        });

        const res = await fetch(`/api/admin/participants?${query}`);
        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Failed to load participants");

        setData(result.data || []);
        setMeta(result.meta || { page: 1, limit: 15, total: 0, totalPages: 1 });
        setStats(result.stats || { total: 0, paid: 0, pending: 0, failed: 0 });
      } catch (error) {
        showToast({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    },
    [filters, meta.limit, showToast]
  );

  useEffect(() => {
    if (authorized) fetchParticipants(1);
  }, [authorized, filters, fetchParticipants]);

  const clearFilters = () => {
    setSearchInput("");
    setFilters(EMPTY_FILTERS);
  };

  const exportCsv = () => {
    if (!data.length) {
      showToast({ type: "info", message: "No data to export on this page" });
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Organization",
      "Country",
      "Event",
      "Phase",
      "Type",
      "Amount",
      "Payment Status",
      "Payment Reference",
      "Registered",
    ];

    const rows = data.map((p) => {
      const payment = p.payments?.[0];
      return [
        p.full_name,
        p.email,
        p.phone,
        p.organization,
        p.country,
        p.event?.name || "",
        PHASE_LABELS[p.phase] || p.phase,
        TYPE_LABELS[p.type] || p.type,
        payment?.amount ?? "",
        payment?.status ?? "",
        payment?.payment_reference ?? "",
        p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `acf-participants-page-${meta.page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="bg-white shadow-xl border border-orange-100 p-8 rounded-2xl w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Lock className="h-7 w-7 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter your PIN to view the participant registry
            </p>
          </div>

          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="4-digit PIN"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleUnlock}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition cursor-pointer"
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">
              ACF Mombasa 2026
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Participant Registry
            </h1>
            <p className="text-gray-500 mt-1">
              Search, filter, and review conference registrations
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fetchParticipants(meta.page)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Lock
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Registrations" value={stats.total} tone="orange" />
          <StatCard icon={CheckCircle2} label="Paid" value={stats.paid} tone="green" />
          <StatCard icon={Clock} label="Pending Payment" value={stats.pending} tone="amber" />
          <StatCard icon={XCircle} label="Failed Payments" value={stats.failed} tone="red" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, organization, or phone..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 cursor-pointer"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-orange-600 text-white text-xs rounded-full px-2 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {(showFilters || activeFilterCount > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
              <FilterSelect
                label="Payment Status"
                value={filters.paymentStatus}
                onChange={(v) => setFilters((f) => ({ ...f, paymentStatus: v }))}
                options={[
                  { value: "", label: "All statuses" },
                  { value: "SUCCESS", label: "Paid (Success)" },
                  { value: "PENDING", label: "Pending" },
                  { value: "FAILED", label: "Failed" },
                ]}
              />
              <FilterSelect
                label="Registration Phase"
                value={filters.phase}
                onChange={(v) => setFilters((f) => ({ ...f, phase: v }))}
                options={[
                  { value: "", label: "All phases" },
                  { value: "EarlyBird", label: "Early Bird" },
                  { value: "Regular", label: "Regular" },
                  { value: "LateOnsite", label: "Late / On-site" },
                ]}
              />
              <FilterSelect
                label="Participant Type"
                value={filters.type}
                onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
                options={[
                  { value: "", label: "All types" },
                  { value: "student", label: "Student" },
                  { value: "eastAfrica", label: "East Africa" },
                  { value: "other", label: "International" },
                ]}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Event ID
                </label>
                <input
                  value={filters.eventId}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, eventId: e.target.value }))
                  }
                  placeholder="Optional"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing{" "}
            <strong className="text-gray-900">
              {data.length ? (meta.page - 1) * meta.limit + 1 : 0}–
              {(meta.page - 1) * meta.limit + data.length}
            </strong>{" "}
            of <strong className="text-gray-900">{meta.total}</strong> matching
            participants
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="p-4 font-semibold w-8" />
                  <th className="p-4 font-semibold">Participant</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Organization</th>
                  <th className="p-4 font-semibold hidden lg:table-cell">Event</th>
                  <th className="p-4 font-semibold hidden sm:table-cell">Phase</th>
                  <th className="p-4 font-semibold hidden lg:table-cell">Type</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold hidden xl:table-cell">Documents</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500">
                      <Users className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                      <p className="font-medium">No participants found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  data.map((p) => {
                    const payment = p.payments?.[0];
                    const isExpanded = expandedId === p.participant_id;
                    const invoice = p.documents?.find((d) => d.type === "INVOICE");
                    const receipt = p.documents?.find((d) => d.type === "RECEIPT");

                    return (
                      <ParticipantRow
                        key={p.participant_id}
                        participant={p}
                        payment={payment}
                        invoice={invoice}
                        receipt={receipt}
                        isExpanded={isExpanded}
                        onToggle={() =>
                          setExpandedId(isExpanded ? null : p.participant_id)
                        }
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1 || loading}
              onClick={() => fetchParticipants(meta.page - 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={meta.page >= meta.totalPages || loading}
              onClick={() => fetchParticipants(meta.page + 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParticipantRow({
  participant: p,
  payment,
  invoice,
  receipt,
  isExpanded,
  onToggle,
}) {
  const status = payment?.status || "PENDING";

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-orange-50/40 transition cursor-pointer"
        onClick={onToggle}
      >
        <td className="p-4 text-gray-400">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </td>
        <td className="p-4">
          <p className="font-medium text-gray-900">{p.full_name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{p.email}</p>
          <p className="text-gray-400 text-xs md:hidden mt-0.5">{p.organization}</p>
        </td>
        <td className="p-4 hidden md:table-cell text-gray-700">{p.organization}</td>
        <td className="p-4 hidden lg:table-cell text-gray-700">
          {p.event?.name || "—"}
        </td>
        <td className="p-4 hidden sm:table-cell text-gray-700">
          {PHASE_LABELS[p.phase] || p.phase}
        </td>
        <td className="p-4 hidden lg:table-cell text-gray-700">
          {TYPE_LABELS[p.type] || p.type}
        </td>
        <td className="p-4">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${PAYMENT_STATUS_STYLES[status] || PAYMENT_STATUS_STYLES.PENDING}`}
          >
            {status}
          </span>
          {payment?.amount != null && (
            <p className="text-xs text-gray-500 mt-1">${payment.amount} USD</p>
          )}
        </td>
        <td className="p-4 hidden xl:table-cell" onClick={(e) => e.stopPropagation()}>
          <DocumentLinks invoice={invoice} receipt={receipt} />
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-orange-50/30 border-b border-gray-100">
          <td colSpan={8} className="p-4 sm:p-6">
            <ExpandedDetails
              participant={p}
              payment={payment}
              invoice={invoice}
              receipt={receipt}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedDetails({ participant: p, payment, invoice, receipt }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      <DetailGroup title="Contact">
        <DetailItem label="Phone" value={p.phone} />
        <DetailItem label="Country" value={p.country} />
        <DetailItem label="Organization" value={p.organization} />
      </DetailGroup>

      <DetailGroup title="Registration">
        <DetailItem label="Profession" value={p.profession} />
        <DetailItem label="Phase" value={PHASE_LABELS[p.phase] || p.phase} />
        <DetailItem label="Type" value={TYPE_LABELS[p.type] || p.type} />
        <DetailItem
          label="Registered"
          value={p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
        />
      </DetailGroup>

      <DetailGroup title="Payment">
        <DetailItem label="Status" value={payment?.status || "PENDING"} />
        <DetailItem label="Method" value={payment?.method || "—"} />
        <DetailItem label="Amount" value={payment?.amount != null ? `$${payment.amount} USD` : "—"} />
        <DetailItem label="Reference" value={payment?.payment_reference || "—"} />
        {payment?.paidAt && (
          <DetailItem
            label="Paid At"
            value={new Date(payment.paidAt).toLocaleString()}
          />
        )}
      </DetailGroup>

      {(p.accessibility?.length > 0 || p.dietary?.length > 0) && (
        <DetailGroup title="Requirements">
          {p.accessibility?.length > 0 && (
            <DetailItem
              label="Accessibility"
              value={p.accessibility.map((a) => a.value).join(", ")}
            />
          )}
          {p.dietary?.length > 0 && (
            <DetailItem
              label="Dietary"
              value={p.dietary.map((d) => d.value).join(", ")}
            />
          )}
        </DetailGroup>
      )}

      <DetailGroup title="Documents">
        <DocumentLinks invoice={invoice} receipt={receipt} stacked />
        {invoice && (
          <DetailItem label="Invoice No." value={invoice.document_number} />
        )}
        {receipt && (
          <DetailItem label="Receipt No." value={receipt.document_number} />
        )}
      </DetailGroup>
    </div>
  );
}

function DocumentLinks({ invoice, receipt, stacked = false }) {
  if (!invoice && !receipt) {
    return <span className="text-xs text-gray-400">No documents yet</span>;
  }

  const linkClass = stacked
    ? "inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm font-medium"
    : "inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-xs font-medium mr-2";

  return (
    <div className={stacked ? "space-y-2" : ""}>
      {invoice && (
        <a
          href={`/api/admin/documents/${invoice.document_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <FileText className="h-3.5 w-3.5" />
          Invoice
        </a>
      )}
      {receipt && (
        <a
          href={`/api/admin/documents/${receipt.document_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <FileText className="h-3.5 w-3.5" />
          Receipt
        </a>
      )}
    </div>
  );
}

function DetailGroup({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        {title}
      </h4>
      <dl className="space-y-1.5">{children}</dl>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="text-gray-500 shrink-0">{label}:</dt>
      <dd className="text-gray-900 break-all">{value || "—"}</dd>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-80">{label}</p>
        <Icon className="h-5 w-5 opacity-60" />
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
