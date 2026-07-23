"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const inputClass =
  "w-full border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light]";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800 ring-amber-600/20",
  USED: "bg-green-100 text-green-800 ring-green-600/20",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  USED: "Registered",
};

export default function CeoInvitesPage() {
  const { showToast } = useToast();

  const [authorized, setAuthorized] = useState(false);
  const [creds, setCreds] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [resendingToken, setResendingToken] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    note: "",
  });

  const authHeaders = useCallback(
    (c = creds) => ({
      "x-ceo-email": c?.email || "",
      "x-ceo-password": c?.password || "",
    }),
    [creds]
  );

  const fetchInvites = useCallback(
    async (c = creds) => {
      setLoading(true);
      try {
        const res = await fetch("/api/ceo/invites", {
          headers: authHeaders(c),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to load invites");
        setInvites(result.data || []);
      } catch (error) {
        showToast({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    },
    [authHeaders, creds, showToast]
  );

  useEffect(() => {
    const stored = sessionStorage.getItem("ceo_auth");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setCreds(parsed);
      setAuthorized(true);
      fetchInvites(parsed);
    } catch {
      sessionStorage.removeItem("ceo_auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    const attempt = {
      email: loginEmail.trim().toLowerCase(),
      password: loginPassword.trim(),
    };

    if (!attempt.email || !attempt.password) {
      showToast({ type: "error", message: "Enter your email and password" });
      return;
    }

    setLoggingIn(true);
    try {
      const res = await fetch("/api/ceo/invites", {
        headers: {
          "x-ceo-email": attempt.email,
          "x-ceo-password": attempt.password,
        },
      });

      if (res.status === 401) {
        showToast({ type: "error", message: "Invalid email or password" });
        return;
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Login failed");

      sessionStorage.setItem("ceo_auth", JSON.stringify(attempt));
      setCreds(attempt);
      setAuthorized(true);
      setInvites(result.data || []);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ceo_auth");
    setCreds(null);
    setAuthorized(false);
    setLoginEmail("");
    setLoginPassword("");
    setInvites([]);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();

    const amount = Number(form.amount);
    if (!form.email.trim()) {
      showToast({ type: "error", message: "Recipient email is required" });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      showToast({ type: "error", message: "Enter a valid price in USD" });
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/ceo/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          amount,
          note: form.note,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send invite");

      showToast({
        type: result.emailSent ? "success" : "warning",
        message: result.emailSent
          ? `Invitation sent to ${form.email}`
          : "Invite created, but the email could not be sent. Use Resend to retry.",
      });

      setForm({ name: "", email: "", amount: "", note: "" });
      fetchInvites();
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSending(false);
    }
  };

  const handleResend = async (invite) => {
    setResendingToken(invite.token);
    try {
      const res = await fetch("/api/ceo/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ action: "resend", token: invite.token }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to resend");

      showToast({
        type: "success",
        message: `Invitation resent to ${invite.email}`,
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setResendingToken(null);
    }
  };

  const copyLink = (invite) => {
    const url = `${window.location.origin}/event-register?invite=${invite.token}`;
    navigator.clipboard
      .writeText(url)
      .then(() => showToast({ type: "success", message: "Invite link copied" }))
      .catch(() => showToast({ type: "error", message: "Could not copy link" }));
  };

  if (!authorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="bg-white shadow-xl border border-orange-100 p-8 rounded-2xl w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Lock className="h-7 w-7 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              CEO Special Invitations
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to send special registration invitations
            </p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Email Address
          </label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="ceo@uthabitiafrica.org"
            autoComplete="username"
            className={`${inputClass} px-4 py-3 mb-4 text-base`}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Password
          </label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter your password"
            autoComplete="current-password"
            className={`${inputClass} px-4 py-3 mb-5 text-base`}
          />

          <button
            onClick={handleLogin}
            disabled={loggingIn}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition cursor-pointer disabled:opacity-60"
          >
            {loggingIn ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-28 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">
              ACF Mombasa 2026
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Special Invitations
            </h1>
            <p className="text-gray-500 mt-1">
              Send personal registration invitations with a custom price
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fetchInvites()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* New invite form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Mail className="h-4 w-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-gray-900">
              Send a New Invitation
            </h2>
          </div>

          <form onSubmit={handleSendInvite} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Dr. Jane Doe"
                className={`${inputClass} px-3 py-2.5 text-sm`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email*
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="guest@example.com"
                className={`${inputClass} px-3 py-2.5 text-sm`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Price (USD)*
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 250"
                className={`${inputClass} px-3 py-2.5 text-sm`}
              />
            </div>

            <div className="md:row-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Note (optional)
              </label>
              <input
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="A short personal message included in the email"
                className={`${inputClass} px-3 py-2.5 text-sm`}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-60 cursor-pointer"
              >
                {sending ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Invite list */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Sent Invitations
            </h2>
            <span className="text-xs text-gray-500">
              {invites.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="p-4 font-semibold">Recipient</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Sent</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                      {[...Array(5)].map((__, j) => (
                        <td key={j} className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-full max-w-[120px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : invites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-500">
                      <Mail className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                      <p className="font-medium">No invitations sent yet</p>
                      <p className="text-sm mt-1">
                        Use the form above to send your first special invitation
                      </p>
                    </td>
                  </tr>
                ) : (
                  invites.map((invite) => (
                    <tr
                      key={invite.invite_id}
                      className="border-b border-gray-100 hover:bg-orange-50/40 transition"
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-900">
                          {invite.invited_name || "—"}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {invite.email}
                        </p>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        ${invite.amount} USD
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[invite.status] || STATUS_STYLES.PENDING}`}
                        >
                          {invite.status === "USED" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {STATUS_LABELS[invite.status] || invite.status}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-500">
                        {invite.createdAt
                          ? new Date(invite.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {invite.status !== "USED" && (
                            <button
                              onClick={() => handleResend(invite)}
                              disabled={resendingToken === invite.token}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                            >
                              <Send
                                className={`h-3 w-3 ${resendingToken === invite.token ? "animate-pulse" : ""}`}
                              />
                              {resendingToken === invite.token
                                ? "Resending..."
                                : "Resend Email"}
                            </button>
                          )}
                          <button
                            onClick={() => copyLink(invite)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium hover:bg-gray-50 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            Copy Link
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
