"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ContactPage() {

  const contactSubjects = [
    "General Inquiry",
    "Request for Information",
    "Feedback or Suggestions",

    "Partnership Opportunity",
    "Collaboration Proposal",
    "Donor / Funder Engagement",
    "Corporate Partnership",

    "Childcare Programs Inquiry",
    "Network for Women in Childcare",
    "Collaborative Action for Childcare (CAC)",
    "Mama Plus Program",
    "SACCO & Financial Inclusion",

    "Join the Network",
    "Membership Support",
    "Community Engagement",

    "Events & Convenings",
    "Media & Press Inquiry",
    "Speaking Engagements",

    "Jobs & Careers",
    "Volunteering Opportunities",
    "Internships & Fellowships",

    "Policy & Advocacy",
    "Training & Capacity Building",
    "Data or Research Inquiry",
    "Website / Portal Support",

    "Other",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { showToast } = useToast();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPersonName = (name) => /^[a-zA-Z\s'-]{2,}$/.test(name);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  // Submit form data to API route
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    const fullName = formData.fullName.trim();

    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else if (!isValidPersonName(fullName)) {
      newErrors.fullName = "Enter a valid full name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Valid phone required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      setLoading(true);

      const res = await fetch("/api/contact/sendContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast({
          message: data.error || "Failed to send message",
          type: "error",
        });
        return;
      }

      showToast({
        message: "Message sent successfully",
        type: "success",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSuccess(true);
    } catch {
      showToast({
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      {/* Page Intro */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Contact
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Get in Touch
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              We’d love to hear from you. Reach out for partnerships, registration
              support, sponsorships, or general inquiries related to the Africa
              Childcare Forum.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Secretariat Contact Details
            </h2>

            <p className="text-gray-600 mb-10 max-w-md">
              The Africa Childcare Forum secretariat, hosted by Collaborative
              Action for Childcare, is available to support all official inquiries.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FFF4F0]">
                  <Phone className="text-[#E5553C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone / WhatsApp</p>
                  <p className="text-gray-600">(+254) 714-262-626</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FFF4F0]">
                  <Mail className="text-[#E5553C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Address</p>
                  <p className="text-gray-600">cac@uthabitiafrica.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FFF4F0]">
                  <MapPin className="text-[#E5553C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Office Address</p>
                  <p className="text-gray-600">
                    Africa Childcare Forum<br />
                    c/o Collaborative Action for Childcare<br />
                    Office #1, Overbay Apartments<br />
                    OV1 Junction of Rhapta & Church Road<br />
                    Westlands, Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#FFF4F0] rounded-2xl p-8 shadow-sm">

            {success ? (

            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Message Sent Successful
              </h3>
              <p className="text-gray-600 mt-2">
                Thank you for contacting ACF Uthabiti Africa.
              </p>
            </div>

            ) : (
            <>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
                {errors.fullName && (
                  <small style={{ color: "#e53935" }}>{errors.fullName}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
                {errors.phone && (
                  <small style={{ color: "#e53935" }}>{errors.phone}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
                {errors.email && (
                  <small style={{ color: "#e53935" }}>{errors.email}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]">
                  <option value="">— select subject —</option>
                  {contactSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <small style={{ color: "#e53935" }}>{errors.subject}</small>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
                {errors.message && (
                  <small style={{ color: "#e53935" }}>{errors.message}</small>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E5553C] text-white font-semibold py-4 rounded-lg hover:bg-[#cf4b35] transition-colors cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
            </>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}