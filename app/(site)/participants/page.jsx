"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ParticipantsPage() {
  const { showToast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });

  const [filters, setFilters] = useState({
    name: "",
    eventId: "",
    paymentStatus: "",
    phase: "",
    type: "",
  });

  /* ---------------- PIN AUTH ---------------- */

  const handleUnlock = () => {
    if (pin === "9076") {
      sessionStorage.setItem("admin_access", "true");
      setAuthorized(true);
    } else {
      showToast({
      type: "error",
      message: "Invalid PIN",
    });
    }
  };

  useEffect(() => {
    const access = sessionStorage.getItem("admin_access");
    if (access) setAuthorized(true);
  }, []);

  /* ---------------- FETCH DATA ---------------- */

  const fetchParticipants = async (page = 1) => {
    setLoading(true);

    const query = new URLSearchParams({
      page,
      limit: meta.limit,
      ...filters,
    });

    const res = await fetch(`/api/admin/participants?${query}`);
    const result = await res.json();

    setData(result.data);
    setMeta(result.meta);

    setLoading(false);
  };

  useEffect(() => {
    if (authorized) fetchParticipants();
  }, [filters, authorized]);

  /* ---------------- UI ---------------- */

  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl p-8 rounded-xl w-80 text-center">
          <h2 className="text-xl font-bold mb-4">Admin Access</h2>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter 4-digit PIN"
            className="w-full border p-2 rounded mb-4"
          />
          <button
            onClick={handleUnlock}
            className="w-full bg-orange-600 text-white py-2 rounded"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto px-6 py-34">

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Total" value={meta.total} />
        <MetricCard label="Paid" value={data.filter(d => d.paid).length} />
        <MetricCard label="Pending" value={data.filter(d => !d.paid).length} />
        <MetricCard label="Events" value={new Set(data.map(d => d.event?.name)).size} />
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input placeholder="Search name" onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))} className="border p-2 rounded" />
        <input placeholder="Event ID" onChange={(e) => setFilters(f => ({ ...f, eventId: e.target.value }))} className="border p-2 rounded" />
        <select onChange={(e) => setFilters(f => ({ ...f, paymentStatus: e.target.value }))} className="border p-2 rounded">
          <option value="">Payment Status</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="PENDING">PENDING</option>
          <option value="FAILED">FAILED</option>
        </select>
        <select onChange={(e) => setFilters(f => ({ ...f, phase: e.target.value }))} className="border p-2 rounded">
          <option value="">Phase</option>
          <option value="EarlyBird">EarlyBird</option>
          <option value="Regular">Regular</option>
          <option value="LateOnsite">LateOnsite</option>
        </select>
        <select onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))} className="border p-2 rounded">
          <option value="">Type</option>
          <option value="student">Student</option>
          <option value="eastAfrica">East Africa</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Event</th>
              <th>Phase</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6">No data found</td>
              </tr>
            ) : (
              data.map((p) => (
                <tr key={p.participant_id} className="border-t">
                  <td className="p-3">{p.full_name}</td>
                  <td>{p.email}</td>
                  <td>{p.event?.name}</td>
                  <td>{p.phase}</td>
                  <td>{p.type}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${p.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.paid ? "PAID" : "PENDING"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <button disabled={meta.page === 1} onClick={() => fetchParticipants(meta.page - 1)}>
          Prev
        </button>
        <span>Page {meta.page}</span>
        <button onClick={() => fetchParticipants(meta.page + 1)}>
          Next
        </button>
      </div>

    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

const MetricCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SkeletonRow = () => (
  <tr className="border-t animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="p-3">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);
