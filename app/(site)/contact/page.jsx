"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h3>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E5553C]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E5553C] text-white font-semibold py-4 rounded-lg hover:bg-[#cf4b35] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}